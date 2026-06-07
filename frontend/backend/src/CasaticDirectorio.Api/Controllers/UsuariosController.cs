using System.Security.Cryptography;
using CasaticDirectorio.Api.Mapping;
using CasaticDirectorio.Api.DTOs.Usuarios;
using CasaticDirectorio.Domain.Entities;
using CasaticDirectorio.Domain.Enums;
using CasaticDirectorio.Domain.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CasaticDirectorio.Api.Controllers;

/// <summary>
/// Gestión de usuarios — Solo Admin.
/// Genera contraseñas temporales seguras para todos los usuarios.
/// </summary>
[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Admin")]
public class UsuariosController : ControllerBase
{
    private readonly IUsuarioRepository _usuarios;
    private readonly ILogger<UsuariosController> _logger;

    public UsuariosController(IUsuarioRepository usuarios, ILogger<UsuariosController> logger)
    {
        _usuarios = usuarios;
        _logger = logger;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var usuarios = await _usuarios.GetAllAsync();
        return Ok(usuarios.Select(u => u.ToDto()).ToList());
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var usuario = await _usuarios.GetByIdAsync(id);
        if (usuario == null) return NotFound();
        return Ok(usuario.ToDto());
    }

    /// <summary>
    /// Crear usuario con contraseña temporal aleatoria.
    /// La contraseña se devuelve UNA SOLA VEZ en la respuesta y debe ser
    /// entregada al usuario por canal seguro. El usuario debe cambiarla
    /// en su primer login (PrimerLogin = true).
    /// </summary>
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] UsuarioCreateDto dto)
    {
        var existing = await _usuarios.GetByEmailAsync(dto.Email);
        if (existing != null)
            return Conflict(new { message = "Ya existe un usuario con ese email" });

        if (!Enum.TryParse<Rol>(dto.Rol, true, out var rol))
            return BadRequest(new { message = "Rol inválido. Use Admin, Usuario o Socio." });

        if (rol == Rol.Socio && dto.SocioId == null)
            return BadRequest(new { message = "Para rol Socio debe indicar SocioId." });

        if (rol == Rol.Admin)
            dto.SocioId = null;

        var initialPassword = GenerarPasswordTemporal();

        var usuario = new Usuario
        {
            Id = Guid.NewGuid(),
            Email = dto.Email,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(initialPassword),
            Rol = rol,
            PrimerLogin = true,
            Activo = true,
            SocioId = dto.SocioId
        };

        await _usuarios.AddAsync(usuario);
        _logger.LogInformation("Usuario creado: {Email} con rol {Rol}", usuario.Email, rol);

        var dtoResponse = usuario.ToDto();

        // ÚNICA respuesta donde se devuelve la contraseña en texto plano.
        return CreatedAtAction(nameof(GetById), new { id = usuario.Id }, new
        {
            usuario = dtoResponse,
            passwordTemporal = initialPassword,
            mensaje = "Entregá esta contraseña al usuario por un canal seguro. " +
                      "Deberá cambiarla en su primer login."
        });
    }

    [HttpPatch("{id:guid}/toggle-activo")]
    public async Task<IActionResult> ToggleActivo(Guid id)
    {
        var usuario = await _usuarios.GetByIdAsync(id);
        if (usuario == null) return NotFound();

        usuario.Activo = !usuario.Activo;
        await _usuarios.UpdateAsync(usuario);

        return Ok(new { usuario.Activo });
    }

    /// <summary>
    /// Resetea la contraseña de un usuario a una nueva temporal y devuelve
    /// el valor en texto plano (sólo en esta respuesta). El usuario debe
    /// cambiarla en su próximo login.
    /// </summary>
    [HttpPost("{id:guid}/reset-password")]
    public async Task<IActionResult> ResetPassword(Guid id)
    {
        var usuario = await _usuarios.GetByIdAsync(id);
        if (usuario == null) return NotFound();

        var nueva = GenerarPasswordTemporal();
        usuario.PasswordHash = BCrypt.Net.BCrypt.HashPassword(nueva);
        usuario.PrimerLogin = true;
        await _usuarios.UpdateAsync(usuario);

        _logger.LogInformation("Password reseteada por admin para {Email}", usuario.Email);
        return Ok(new
        {
            passwordTemporal = nueva,
            mensaje = "Entregá esta contraseña al usuario por un canal seguro."
        });
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var usuario = await _usuarios.GetByIdAsync(id);
        if (usuario == null) return NotFound(new { message = "Usuario no encontrado" });

        await _usuarios.DeleteAsync(id);
        return NoContent();
    }

    // ── Helpers ─────────────────────────────────────────────

    /// <summary>
    /// Genera una contraseña temporal de 12 caracteres que cumple el regex
    /// del sistema (mayúscula, número, símbolo). Usa RandomNumberGenerator
    /// (criptográficamente seguro), no Random.
    /// </summary>
    private static string GenerarPasswordTemporal()
    {
        const string upper = "ABCDEFGHJKLMNPQRSTUVWXYZ"; // sin I/O para evitar confusión
        const string lower = "abcdefghijkmnpqrstuvwxyz";
        const string digits = "23456789";
        const string symbols = "!@#$%^&*?";
        const string all = upper + lower + digits + symbols;

        // Garantizamos al menos 1 de cada categoría requerida.
        var pwd = new char[12];
        pwd[0] = upper[RandomNumberGenerator.GetInt32(upper.Length)];
        pwd[1] = digits[RandomNumberGenerator.GetInt32(digits.Length)];
        pwd[2] = symbols[RandomNumberGenerator.GetInt32(symbols.Length)];

        for (var i = 3; i < pwd.Length; i++)
            pwd[i] = all[RandomNumberGenerator.GetInt32(all.Length)];

        // Fisher-Yates shuffle con random seguro.
        for (var i = pwd.Length - 1; i > 0; i--)
        {
            var j = RandomNumberGenerator.GetInt32(i + 1);
            (pwd[i], pwd[j]) = (pwd[j], pwd[i]);
        }

        return new string(pwd);
    }
}
