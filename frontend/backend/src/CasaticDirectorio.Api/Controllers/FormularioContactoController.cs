using CasaticDirectorio.Api.DTOs.Formulario;
using CasaticDirectorio.Api.Services;
using CasaticDirectorio.Domain.Entities;
using CasaticDirectorio.Domain.Enums;
using CasaticDirectorio.Domain.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;

namespace CasaticDirectorio.Api.Controllers;

/// <summary>
/// Formulario de contacto público — enviar mensaje a un socio.
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class FormularioContactoController : ControllerBase
{
    private readonly IFormularioContactoRepository _formularios;
    private readonly ISocioRepository _socios;
    private readonly ILogService _logService;

    public FormularioContactoController(
        IFormularioContactoRepository formularios,
        ISocioRepository socios,
        ILogService logService)
    {
        _formularios = formularios;
        _socios = socios;
        _logService = logService;
    }

    /// <summary>
    /// Enviar formulario de contacto a un socio.
    /// POST /api/formulariocontacto/{socioId}
    /// </summary>
    private async Task<IActionResult> EnviarFormularioAsync(Guid socioId, FormularioContactoDto dto)
    {
        var formulario = new FormularioContacto
        {
            Id = Guid.NewGuid(),
            SocioId = socioId,
            Nombre = dto.Nombre,
            Correo = dto.Correo,
            Mensaje = dto.Mensaje,
            Fecha = DateTime.UtcNow
        };

        await _formularios.AddAsync(formulario);

        // Registrar envío de formulario
        await _logService.RegistrarAsync(
            TipoEventoLogActividad.EnvioFormulario,
            socioId: socioId,
            ip: HttpContext.Connection.RemoteIpAddress?.ToString(),
            userAgent: Request.Headers.UserAgent.ToString());

        return Ok(new { message = "Formulario enviado con éxito", id = formulario.Id });
    }

    [HttpPost("{socioId:guid}")]
    [EnableRateLimiting("contacto")]
    public async Task<IActionResult> Enviar(Guid socioId, [FromBody] FormularioContactoDto dto)
    {
        var socio = await _socios.GetByIdAsync(socioId);
        if (socio == null || !socio.Habilitado)
            return NotFound(new { message = "Socio no encontrado o deshabilitado" });

        return await EnviarFormularioAsync(socioId, dto);
    }

    [HttpPost("slug/{slug}")]
    [EnableRateLimiting("contacto")]
    public async Task<IActionResult> EnviarPorSlug(string slug, [FromBody] FormularioContactoDto dto)
    {
        var socio = await _socios.GetBySlugAsync(slug);
        if (socio == null || !socio.Habilitado)
            return NotFound(new { message = "Socio no encontrado o deshabilitado" });

        return await EnviarFormularioAsync(socio.Id, dto);
    }

    /// <summary>
    /// Enviar formulario de contacto general desde /contacto.
    /// POST /api/formulariocontacto/general
    /// </summary>
    [HttpPost("general")]
    [EnableRateLimiting("contacto")]
    public async Task<IActionResult> EnviarGeneral([FromBody] FormularioContactoDto dto)
    {
        var socioReceptor = (await _socios.GetAllAsync())
            .FirstOrDefault(s => s.Habilitado);

        if (socioReceptor == null)
            return BadRequest(new { message = "No hay un socio habilitado para recibir mensajes generales" });

        var asunto = string.IsNullOrWhiteSpace(dto.Asunto)
            ? "Sin asunto"
            : dto.Asunto.Trim();

        var dtoGeneral = new FormularioContactoDto
        {
            Nombre = dto.Nombre,
            Correo = dto.Correo,
            Mensaje = $"[Contacto general]\nAsunto: {asunto}\n\n{dto.Mensaje}"
        };

        return await EnviarFormularioAsync(socioReceptor.Id, dtoGeneral);
    }

    /// <summary>
    /// Listar TODOS los formularios de contacto recibidos (admin).
    /// GET /api/formulariocontacto?desde=...&amp;hasta=...
    /// </summary>
    [Authorize(Roles = "Admin")]
    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] DateTime? desde, [FromQuery] DateTime? hasta)
    {
        var ahora = DateTime.UtcNow;
        var formularios = await _formularios.GetAllAsync(
            EnsureUtc(desde ?? ahora.AddMonths(-1)),
            EnsureUtc(hasta ?? ahora.AddDays(1)));

        return Ok(formularios.Select(f => new
        {
            f.Id,
            f.SocioId,
            NombreEmpresa = f.Socio != null ? f.Socio.NombreEmpresa : string.Empty,
            f.Nombre,
            f.Correo,
            f.Mensaje,
            f.Fecha,
            f.Leido
        }));
    }

    /// <summary>
    /// Marcar formulario como leído / no leído (admin).
    /// PATCH /api/formulariocontacto/{id}/leido
    /// </summary>
    [Authorize(Roles = "Admin")]
    [HttpPatch("{id:guid}/leido")]
    public async Task<IActionResult> MarcarLeido(Guid id, [FromBody] bool leido)
    {
        await _formularios.MarcarLeidoAsync(id, leido);
        return NoContent();
    }

    /// <summary>
    /// Listar formularios recibidos de mi empresa (solo para Socios de su propio socio).
    /// GET /api/formulariocontacto/mi-socio?desde=...&hasta=...
    /// </summary>
    [Authorize(Roles = "Socio")]
    [HttpGet("mi-socio")]
    public async Task<IActionResult> GetMiSocio([FromQuery] DateTime? desde, [FromQuery] DateTime? hasta)
    {
        // Obtener socioId del JWT token
        var socioIdClaim = User.FindFirst("SocioId")?.Value;
        if (!Guid.TryParse(socioIdClaim, out var socioId))
            return BadRequest(new { message = "No se pudo obtener el ID de tu empresa del token" });

        var ahora = DateTime.UtcNow;
        var fechaDesde = EnsureUtc(desde ?? ahora.AddMonths(-1));
        var fechaHasta = EnsureUtc(hasta ?? ahora.AddDays(1));
        var formularios = await _formularios.GetBySocioAsync(socioId);
        
        // Filtrar por rango de fechas si se proporciona
        var filtrados = formularios
            .Where(f => f.Fecha >= fechaDesde)
            .Where(f => f.Fecha <= fechaHasta)
            .ToList();

        return Ok(filtrados.Select(f => new
        {
            f.Id,
            f.SocioId,
            f.Nombre,
            f.Correo,
            f.Mensaje,
            f.Fecha,
            f.Leido
        }));
    }

    /// <summary>
    /// Listar formularios recibidos por un socio (admin).
    /// </summary>
    [Authorize(Roles = "Admin")]
    [HttpGet("socio/{socioId:guid}")]
    public async Task<IActionResult> GetBySocio(Guid socioId)
    {
        var formularios = await _formularios.GetBySocioAsync(socioId);
        return Ok(formularios.Select(f => new
        {
            f.Id,
            f.Nombre,
            f.Correo,
            f.Mensaje,
            f.Fecha
        }));
    }

    private static DateTime EnsureUtc(DateTime value) =>
        value.Kind switch
        {
            DateTimeKind.Utc => value,
            DateTimeKind.Local => value.ToUniversalTime(),
            _ => DateTime.SpecifyKind(value, DateTimeKind.Utc)
        };
}
