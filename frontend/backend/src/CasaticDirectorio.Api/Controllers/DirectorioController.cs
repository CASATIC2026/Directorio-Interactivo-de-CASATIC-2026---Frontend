using CasaticDirectorio.Api.DTOs.Directorio;
using CasaticDirectorio.Api.Mapping;
using CasaticDirectorio.Api.DTOs.Socios;
using CasaticDirectorio.Api.Services;
using CasaticDirectorio.Domain.Enums;
using CasaticDirectorio.Domain.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace CasaticDirectorio.Api.Controllers;

/// <summary>
/// Endpoints públicos del directorio: búsqueda paginada y micro-sitio.
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class DirectorioController : ControllerBase
{
    private readonly ISocioRepository _socios;
    private readonly ILogService _logService;

    public DirectorioController(ISocioRepository socios, ILogService logService)
    {
        _socios = socios;
        _logService = logService;
    }

    /// <summary>
    /// Buscar socios con paginación, Full-Text Search y filtro por especialidad.
    /// </summary>
    [HttpGet]
    public async Task<IActionResult> Search([FromQuery] DirectorioFilterDto filtro)
    {
        var especialidades = filtro.Especialidades.ToList();
        if (!string.IsNullOrWhiteSpace(filtro.Especialidad))
        {
            especialidades.AddRange(filtro.Especialidad
                .Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries));
        }

        var (items, total) = await _socios.SearchAsync(
            filtro.Query,
            especialidades,
            filtro.Inicial,
            filtro.Servicio,
            filtro.Producto,
            filtro.Sector,
            filtro.Estado,
            filtro.FechaDesde,
            filtro.FechaHasta,
            filtro.Page,
            filtro.PageSize);

        // Registrar búsqueda si hay query
        if (!string.IsNullOrWhiteSpace(filtro.Query))
        {
            await _logService.RegistrarAsync(
                TipoEventoLogActividad.Busqueda,
                query: filtro.Query,
                ip: HttpContext.Connection.RemoteIpAddress?.ToString(),
                userAgent: Request.Headers.UserAgent.ToString());
        }

        var result = new PagedResult<SocioListDto>
        {
            Items = items.Select(s => s.ToListDto()).ToList(),
            Total = total,
            Page = filtro.Page,
            PageSize = filtro.PageSize
        };

        return Ok(result);
    }

    /// <summary>
    /// Obtener micro-sitio de un socio por slug.
    /// GET /api/directorio/socio/{slug}
    /// </summary>
    [HttpGet("socio/{slug}")]
    public async Task<IActionResult> GetBySlug(string slug)
    {
        var socio = await _socios.GetBySlugAsync(slug);
        if (socio == null || !socio.Habilitado)
            return NotFound(new { message = "Socio no encontrado o deshabilitado" });

        // Registrar visita al micro-sitio
        await _logService.RegistrarAsync(
            TipoEventoLogActividad.VisitaMicroSitio,
            socioId: socio.Id,
            ip: HttpContext.Connection.RemoteIpAddress?.ToString(),
            userAgent: Request.Headers.UserAgent.ToString());

        return Ok(socio.ToDto());
    }

    /// <summary>
    /// Obtener micro-sitio de un socio por ID.
    /// GET /api/directorio/company/{id}
    /// </summary>
    [HttpGet("company/{id:guid}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var socio = await _socios.GetByIdAsync(id);
        if (socio == null || !socio.Habilitado)
            return NotFound(new { message = "Socio no encontrado o deshabilitado" });

        await _logService.RegistrarAsync(
            TipoEventoLogActividad.VisitaMicroSitio,
            socioId: socio.Id,
            ip: HttpContext.Connection.RemoteIpAddress?.ToString(),
            userAgent: Request.Headers.UserAgent.ToString());

        return Ok(socio.ToDto());
    }

    /// <summary>
    /// Listar todas las especialidades únicas para filtros.
    /// </summary>
    [HttpGet("especialidades")]
    public async Task<IActionResult> GetEspecialidades()
    {
        var socios = await _socios.GetAllAsync();
        var especialidades = socios
            .Where(s => s.Habilitado)
            .SelectMany(s => s.Especialidades)
            .Distinct()
            .OrderBy(e => e)
            .ToList();

        return Ok(especialidades);
    }

    /// <summary>
    /// Listar todos los servicios únicos para filtros.
    /// </summary>
    [HttpGet("servicios")]
    public async Task<IActionResult> GetServicios()
    {
        var socios = await _socios.GetAllAsync();
        var servicios = socios
            .Where(s => s.Habilitado)
            .SelectMany(s => s.Servicios)
            .Distinct()
            .OrderBy(s => s)
            .ToList();

        return Ok(servicios);
    }
}
