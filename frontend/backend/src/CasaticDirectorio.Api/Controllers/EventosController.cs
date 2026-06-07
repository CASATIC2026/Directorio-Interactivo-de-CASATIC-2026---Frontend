using System.Security.Claims;
using CasaticDirectorio.Api.DTOs.Eventos;
using CasaticDirectorio.Api.Services;
using CasaticDirectorio.Domain.Enums;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CasaticDirectorio.Api.Controllers;

/// <summary>
/// Eventos: creación (autenticada), listado público y aprobación (admin).
/// </summary>
[ApiController]
[Route("api/eventos")]
public class EventosController : ControllerBase
{
    private readonly EventoService _service;

    public EventosController(EventoService service)
    {
        _service = service;
    }

    /// <summary>
    /// Crear un evento. Si el rol es Admin → se aprueba automáticamente;
    /// si es Socio/Usuario → queda Pendiente de aprobación.
    /// </summary>
    [HttpPost]
    [Authorize(Roles = "Admin,Socio,Usuario")]
    public async Task<IActionResult> Create([FromBody] EventoCreateDto dto)
    {
        var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out var userId))
            return Unauthorized();

        var rolClaim = User.FindFirstValue(ClaimTypes.Role) ?? "Usuario";
        if (!Enum.TryParse<Rol>(rolClaim, true, out var rol))
            rol = Rol.Usuario;

        var id = await _service.CreateAsync(dto, userId, rol);
        return CreatedAtAction(nameof(GetById), new { id }, new { id });
    }

    /// <summary>
    /// Todos los eventos para el panel admin/socio.
    /// Admin ve todos; Socio ve solo los de su empresa.
    /// </summary>
    [HttpGet]
    [Authorize(Roles = "Admin,Socio")]
    public async Task<IActionResult> GetAll()
    {
        var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
        var rolClaim = User.FindFirstValue(ClaimTypes.Role) ?? "Socio";
        Guid.TryParse(userIdClaim, out var userId);
        Enum.TryParse<Rol>(rolClaim, true, out var rol);

        var eventos = await _service.GetAllAsync(userId, rol);
        return Ok(eventos);
    }

    /// <summary>
    /// Próximos eventos publicados (público).
    /// </summary>
    [HttpGet("proximos")]
    [AllowAnonymous]
    public async Task<IActionResult> GetProximos()
    {
        var eventos = await _service.GetProximosEventosAsync();
        return Ok(eventos);
    }

    /// <summary>
    /// Detalle de un evento por ID.
    /// </summary>
    [HttpGet("{id:guid}")]
    [AllowAnonymous]
    public async Task<IActionResult> GetById(Guid id)
    {
        var evento = await _service.GetByIdAsync(id);
        if (evento == null) return NotFound();
        return Ok(evento);
    }

    /// <summary>
    /// Aprobar un evento (admin).
    /// </summary>
    [HttpPut("{id:guid}/aprobar")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Aprobar(Guid id)
    {
        await _service.AprobarEventoAsync(id);
        return Ok(new { message = "Evento aprobado exitosamente" });
    }

    /// <summary>
    /// Rechazar un evento (admin).
    /// </summary>
    [HttpPut("{id:guid}/rechazar")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Rechazar(Guid id)
    {
        await _service.RechazarEventoAsync(id);
        return Ok(new { message = "Evento rechazado exitosamente" });
    }

    /// <summary>
    /// Eliminar un evento (admin).
    /// </summary>
    [HttpDelete("{id:guid}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Delete(Guid id)
    {
        await _service.DeleteAsync(id);
        return Ok(new { message = "Evento eliminado exitosamente" });
    }
}
