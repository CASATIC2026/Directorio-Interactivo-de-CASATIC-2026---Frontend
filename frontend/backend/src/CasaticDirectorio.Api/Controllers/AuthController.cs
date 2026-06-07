using System.Security.Claims;
using System.Security.Cryptography;
using System.Text.RegularExpressions;
using CasaticDirectorio.Api.DTOs.Auth;
using CasaticDirectorio.Api.Services;
using CasaticDirectorio.Domain.Entities;
using CasaticDirectorio.Domain.Enums;
using CasaticDirectorio.Domain.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;

namespace CasaticDirectorio.Api.Controllers;

/// <summary>
/// Autenticación: login JWT, cambio de contraseña, recuperación.
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    // Hash dummy precalculado para que el path "usuario inexistente" tarde
    // lo mismo que "usuario existente" (mitigación de timing-attack en login).
    private const string DummyBcryptHash =
        "$2a$11$abcdefghijklmnopqrstuv0Q1zJxPx0sB2mZHQ7eNxq6h8j1hFB3i7m";

    // Mismo regex que los DTOs (sincronizado con frontend/lib/validators.js).
    private static readonly Regex PasswordRegex =
        new(@"^(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).{8,}$", RegexOptions.Compiled);

    private readonly IUsuarioRepository _usuarios;
    private readonly IJwtService _jwt;
    private readonly ILogService _logService;
    private readonly ILogActividadRepository _logRepo;
    private readonly IWebHostEnvironment _env;
    private readonly ILogger<AuthController> _logger;
    private readonly IEmailService _emailService;

    public AuthController(
        IUsuarioRepository usuarios,
        IJwtService jwt,
        ILogService logService,
        ILogActividadRepository logRepo,
        IWebHostEnvironment env,
        IEmailService emailService,
        ILogger<AuthController> logger)
    {
        _usuarios = usuarios;
        _jwt = jwt;
        _logService = logService;
        _logRepo = logRepo;
        _env = env;
        _emailService = emailService;
        _logger = logger;
    }

    /// <summary>
    /// Inicio de sesión. Devuelve JWT y flag de primer login.
    /// </summary>
    [HttpPost("login")]
    [EnableRateLimiting("auth")]
    public async Task<IActionResult> Login([FromBody] LoginRequest req)
    {
        if (!ModelState.IsValid) return ValidationProblem(ModelState);

        var usuario = await _usuarios.GetByEmailAsync(req.Email);
        var isActive = usuario?.Activo ?? false;

        // Siempre corremos BCrypt.Verify, incluso si el usuario no existe,
        // contra un hash dummy. Así el tiempo de respuesta es uniforme y
        // no se puede enumerar emails por timing.
        var passwordHashToCheck = (usuario != null && isActive)
            ? usuario.PasswordHash
            : DummyBcryptHash;

        var passwordOk = BCrypt.Net.BCrypt.Verify(req.Password ?? "", passwordHashToCheck);

        if (usuario == null || !isActive || !passwordOk)
        {
            await _logService.RegistrarAsync(
                TipoEventoLogActividad.LoginFallido,
                query: req.Email,
                ip: HttpContext.Connection.RemoteIpAddress?.ToString(),
                userAgent: Request.Headers.UserAgent.ToString());

            return Unauthorized(new { message = "Credenciales inválidas" });
        }

        var token = _jwt.GenerateToken(usuario);

        await _logService.RegistrarAsync(
            TipoEventoLogActividad.Login,
            query: usuario.Email,
            usuarioId: usuario.Id,
            ip: HttpContext.Connection.RemoteIpAddress?.ToString(),
            userAgent: Request.Headers.UserAgent.ToString());

        return Ok(new LoginResponse
        {
            Token = token,
            Email = usuario.Email,
            Rol = usuario.Rol.ToString(),
            PrimerLogin = usuario.PrimerLogin,
            SocioId = usuario.SocioId
        });
    }

    /// <summary>
    /// Cambiar contraseña (obligatorio en primer login). Devuelve LoginResponse
    /// completa para que el frontend pueda mantener el contexto de sesión.
    /// </summary>
    [Authorize]
    [HttpPost("cambiar-password")]
    public async Task<IActionResult> CambiarPassword([FromBody] CambiarPasswordRequest req)
    {
        if (!ModelState.IsValid) return ValidationProblem(ModelState);

        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userId) || !Guid.TryParse(userId, out var userGuid))
            return Unauthorized();

        var usuario = await _usuarios.GetByIdAsync(userGuid);
        if (usuario == null) return NotFound();

        if (!PasswordRegex.IsMatch(req.NuevaPassword))
            return BadRequest(new { message = "La contraseña debe tener al menos 8 caracteres, una mayúscula, un número y un carácter especial." });

        usuario.PasswordHash = BCrypt.Net.BCrypt.HashPassword(req.NuevaPassword);
        usuario.PrimerLogin = false;
        await _usuarios.UpdateAsync(usuario);

        await _logService.RegistrarAsync(
            TipoEventoLogActividad.CambioPassword,
            usuarioId: usuario.Id,
            ip: HttpContext.Connection.RemoteIpAddress?.ToString());

        var token = _jwt.GenerateToken(usuario);

        return Ok(new LoginResponse
        {
            Token = token,
            Email = usuario.Email,
            Rol = usuario.Rol.ToString(),
            PrimerLogin = false,
            SocioId = usuario.SocioId
        });
    }

    /// <summary>
    /// Perfil del usuario autenticado.
    /// </summary>
    [Authorize]
    [HttpGet("me")]
    public async Task<IActionResult> Me()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userId) || !Guid.TryParse(userId, out var userGuid))
            return Unauthorized();

        var usuario = await _usuarios.GetByIdAsync(userGuid);
        if (usuario == null) return NotFound();

        return Ok(new
        {
            usuario.Id,
            usuario.Email,
            Rol = usuario.Rol.ToString(),
            usuario.PrimerLogin,
            usuario.SocioId
        });
    }

    /// <summary>
    /// Solicitar token de recuperación de contraseña.
    /// IMPORTANTE: en el flujo original el token se generaba pero nunca se
    /// devolvía ni se enviaba por email → la recuperación quedaba rota.
    /// Hasta que se integre un servicio de email real, en Development
    /// devolvemos el token en la respuesta y lo logueamos para QA. En
    /// producción, sólo se loguea (no se devuelve) y se mantiene la
    /// respuesta uniforme para no permitir enumeración de emails.
    /// </summary>
    [HttpPost("recuperar-password")]
    [EnableRateLimiting("auth")]
    public async Task<IActionResult> RecuperarPassword([FromBody] RecuperarPasswordRequest req)
    {
        if (!ModelState.IsValid) return ValidationProblem(ModelState);

        const string genericMessage = "Si el correo existe, recibirá un enlace de recuperación.";

        var usuario = await _usuarios.GetByEmailAsync(req.Email);

        // Generamos un token "fantasma" cuando el usuario no existe para
        // mantener tiempo de respuesta similar.
        var rawToken = Convert.ToBase64String(RandomNumberGenerator.GetBytes(32))
            .Replace("/", "_").Replace("+", "-").TrimEnd('=');

        if (usuario == null || !usuario.Activo)
        {
            // Hacemos un hash dummy para igualar tiempo (BCrypt es caro).
            _ = BCrypt.Net.BCrypt.HashPassword(rawToken);
            return Ok(new { message = genericMessage });
        }

        usuario.TokenRecuperacion = BCrypt.Net.BCrypt.HashPassword(rawToken);
        usuario.FechaExpiracionToken = DateTime.UtcNow.AddHours(1); // antes 24h - bajado a 1h por seguridad
        await _usuarios.UpdateAsync(usuario);

        _logger.LogInformation(
            "Token de recuperación generado para {Email}. Expira: {Exp}",
            usuario.Email, usuario.FechaExpiracionToken);

        await _logService.RegistrarAsync(
            TipoEventoLogActividad.CambioPassword,
            query: $"Recuperación solicitada: {usuario.Email}",
            usuarioId: usuario.Id,
            ip: HttpContext.Connection.RemoteIpAddress?.ToString());

        var recoveryUrl = $"{Request.Scheme}://{Request.Host}/admin/forgot-password";
        var emailBody = $@"<p>Se solicitó recuperación de contraseña para esta cuenta.</p>
<p>Usa el siguiente código en la pantalla de recuperación:</p>
<pre style=""font-size:16px;font-weight:bold;"">{rawToken}</pre>
<p>La URL de recuperación es: <a href=""{recoveryUrl}"">{recoveryUrl}</a></p>
<p>El código expira en 1 hora.</p>";

        await _emailService.SendEmailAsync(
            usuario.Email,
            "Recuperación de contraseña CASATIC",
            emailBody);

        if (_env.IsDevelopment())
        {
            return Ok(new
            {
                message = genericMessage,
                devOnly_token = rawToken,
                devOnly_warning = "Este campo SÓLO existe en Development. En Production se elimina."
            });
        }

        return Ok(new { message = genericMessage });
    }

    /// <summary>
    /// Validar un token de recuperación.
    /// </summary>
    [HttpPost("validar-token-recuperacion")]
    [EnableRateLimiting("auth")]
    public async Task<IActionResult> ValidarTokenRecuperacion([FromBody] ValidarTokenRecuperacionRequest req)
    {
        if (!ModelState.IsValid) return ValidationProblem(ModelState);

        var (ok, _) = await VerifyRecoveryTokenAsync(req.Email, req.Token);
        if (!ok) return BadRequest(new { message = "Token inválido o expirado." });
        return Ok(new { message = "Token válido" });
    }

    /// <summary>
    /// Restablecer contraseña usando un token válido.
    /// </summary>
    [HttpPost("restablecer-password")]
    [EnableRateLimiting("auth")]
    public async Task<IActionResult> RestablecerPassword([FromBody] RestablecerPasswordRequest req)
    {
        if (!ModelState.IsValid) return ValidationProblem(ModelState);

        if (!PasswordRegex.IsMatch(req.NuevaPassword))
            return BadRequest(new { message = "La contraseña no cumple los requisitos de seguridad." });

        var (ok, usuario) = await VerifyRecoveryTokenAsync(req.Email, req.Token);
        if (!ok || usuario == null)
            return BadRequest(new { message = "Token inválido o expirado." });

        usuario.PasswordHash = BCrypt.Net.BCrypt.HashPassword(req.NuevaPassword);
        usuario.TokenRecuperacion = null;
        usuario.FechaExpiracionToken = null;
        usuario.PrimerLogin = false;
        await _usuarios.UpdateAsync(usuario);

        await _logService.RegistrarAsync(
            TipoEventoLogActividad.CambioPassword,
            query: "Contraseña restablecida con token de recuperación",
            usuarioId: usuario.Id,
            ip: HttpContext.Connection.RemoteIpAddress?.ToString());

        return Ok(new { message = "Contraseña restablecida exitosamente" });
    }

    /// <summary>
    /// Historial de accesos del usuario autenticado (últimos 50 logins exitosos).
    /// </summary>
    [Authorize]
    [HttpGet("mis-accesos")]
    public async Task<IActionResult> MisAccesos([FromQuery] int top = 50)
    {
        top = Math.Clamp(top, 1, 200);

        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userId) || !Guid.TryParse(userId, out var userGuid))
            return Unauthorized();

        var logs = await _logRepo.GetAccesosByUsuarioAsync(userGuid, top);

        var result = logs.Select(l => new AccesoDto(
            Fecha: l.Fecha,
            Tipo: l.TipoEvento.ToString(),
            Exitoso: l.TipoEvento == TipoEventoLogActividad.Login,
            Ip: l.Ip,
            UserAgent: l.UserAgent
        )).ToList();

        return Ok(result);
    }

    /// <summary>
    /// Historial completo de accesos (éxitos e intentos fallidos). Solo Admin.
    /// </summary>
    [Authorize(Roles = "Admin")]
    [HttpGet("todos-los-accesos")]
    public async Task<IActionResult> TodosLosAccesos(
        [FromQuery] DateTime? desde,
        [FromQuery] DateTime? hasta,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 50)
    {
        pageSize = Math.Clamp(pageSize, 1, 200);
        page = Math.Max(1, page);

        var desdeUtc = (desde ?? DateTime.UtcNow.AddDays(-30)).ToUniversalTime();
        var hastaUtc = (hasta ?? DateTime.UtcNow).ToUniversalTime();

        var skip = (page - 1) * pageSize;
        var total = await _logRepo.CountTodosAccesosAsync(desdeUtc, hastaUtc);
        var logs = await _logRepo.GetTodosAccesosAsync(desdeUtc, hastaUtc, skip, pageSize);

        var items = logs.Select(l => new AccesoAdminDto(
            Fecha: l.Fecha,
            Email: l.Query ?? "Desconocido",
            Tipo: l.TipoEvento.ToString(),
            Exitoso: l.TipoEvento == TipoEventoLogActividad.Login,
            Ip: l.Ip,
            UserAgent: l.UserAgent
        )).ToList();

        return Ok(new AccesosPagedResult(total, page, pageSize, items));
    }

    // ── Helpers ─────────────────────────────────────────────

    /// <summary>
    /// Verifica un token de recuperación. Si está expirado, lo limpia.
    /// </summary>
    private async Task<(bool ok, Usuario? usuario)> VerifyRecoveryTokenAsync(string email, string token)
    {
        var usuario = await _usuarios.GetByEmailAsync(email);
        if (usuario == null || string.IsNullOrEmpty(usuario.TokenRecuperacion))
            return (false, null);

        if (usuario.FechaExpiracionToken == null || usuario.FechaExpiracionToken < DateTime.UtcNow)
        {
            usuario.TokenRecuperacion = null;
            usuario.FechaExpiracionToken = null;
            await _usuarios.UpdateAsync(usuario);
            return (false, null);
        }

        if (!BCrypt.Net.BCrypt.Verify(token, usuario.TokenRecuperacion))
            return (false, null);

        return (true, usuario);
    }
}
