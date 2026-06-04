using CasaticDirectorio.Api.Mapping;
using CasaticDirectorio.Api.DTOs.Socios;
using CasaticDirectorio.Api.Services;
using CasaticDirectorio.Domain.Entities;
using CasaticDirectorio.Domain.Enums;
using CasaticDirectorio.Domain.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Text;
using System.Text.RegularExpressions;

namespace CasaticDirectorio.Api.Controllers;

/// <summary>
/// CRUD de socios — Solo Admin.
/// </summary>
[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Admin")]
public class SociosController : ControllerBase
{
    private readonly ISocioRepository _socios;
    private readonly ILogService _logService;

    public SociosController(ISocioRepository socios, ILogService logService)
    {
        _socios = socios;
        _logService = logService;
    }

    /// <summary>
    /// Listar todos los socios (admin).
    /// </summary>
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var socios = await _socios.GetAllAsync();
        return Ok(socios.Select(s => s.ToDto()).ToList());
    }

    /// <summary>
    /// Obtener socio por ID (admin).
    /// </summary>
    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var socio = await _socios.GetByIdAsync(id);
        if (socio == null) return NotFound();
        return Ok(socio.ToDto());
    }

    /// <summary>
    /// Crear un nuevo socio.
    /// </summary>
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] SocioCreateDto dto)
    {
        // Validar descripción (máx. 150 palabras)
        if (!string.IsNullOrWhiteSpace(dto.Descripcion) &&
            dto.Descripcion.Trim().Split(' ', StringSplitOptions.RemoveEmptyEntries).Length > 150)
            return BadRequest(new { message = "La descripción no puede exceder 150 palabras" });

        // Validar especialidades (máx. 10 palabras cada una)
        if (dto.Especialidades.Any(e => e.Trim().Split(' ', StringSplitOptions.RemoveEmptyEntries).Length > 10))
            return BadRequest(new { message = "Cada especialidad no puede exceder 10 palabras" });

        // Validar marcas que representa (máx. 50 palabras)
        if (!string.IsNullOrWhiteSpace(dto.MarcasRepresenta) &&
            dto.MarcasRepresenta.Trim().Split(' ', StringSplitOptions.RemoveEmptyEntries).Length > 50)
            return BadRequest(new { message = "Las marcas que representa no pueden exceder 50 palabras" });

        var socio = dto.ToEntity();
        socio.Id = Guid.NewGuid();

        // Auto-generar slug si viene vacío
        if (string.IsNullOrWhiteSpace(socio.Slug))
            socio.Slug = GenerarSlug(dto.NombreEmpresa);

        // Verificar slug duplicado
        var existing = await _socios.GetBySlugAsync(socio.Slug);
        if (existing != null)
            return Conflict(new { message = $"Ya existe un socio con el slug '{socio.Slug}'" });

        await _socios.AddAsync(socio);

        await _logService.RegistrarAsync(TipoEventoLogActividad.CrudSocio, query: $"Crear: {socio.NombreEmpresa}");

        return CreatedAtAction(nameof(GetById), new { id = socio.Id }, socio.ToDto());
    }

    /// <summary>
    /// Actualizar un socio existente (parcial).
    /// </summary>
    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(Guid id, [FromBody] SocioUpdateDto dto)
    {
        var socio = await _socios.GetByIdAsync(id);
        if (socio == null) return NotFound();

        // Actualizar solo campos enviados
        if (dto.NombreEmpresa != null) socio.NombreEmpresa = dto.NombreEmpresa;
        if (dto.Slug != null) socio.Slug = dto.Slug;
        if (dto.Descripcion != null) socio.Descripcion = dto.Descripcion;
        if (dto.Especialidades != null) socio.Especialidades = dto.Especialidades;
        if (dto.Servicios != null) socio.Servicios = dto.Servicios;
        if (dto.RsWebsite != null) socio.RsWebsite = dto.RsWebsite;
        if (dto.RsFacebook != null) socio.RsFacebook = dto.RsFacebook;
        if (dto.RsLinkedin != null) socio.RsLinkedin = dto.RsLinkedin;
        if (dto.RsTwitter != null) socio.RsTwitter = dto.RsTwitter;
        if (dto.RsInstagram != null) socio.RsInstagram = dto.RsInstagram;
        if (dto.RsYoutube != null) socio.RsYoutube = dto.RsYoutube;
        if (dto.Telefono != null) socio.Telefono = dto.Telefono;
        if (dto.Direccion != null) socio.Direccion = dto.Direccion;
        if (dto.LogoUrl != null) socio.LogoUrl = dto.LogoUrl;
        if (dto.MarcasRepresenta != null) socio.MarcasRepresenta = dto.MarcasRepresenta;
        if (dto.EmailContacto != null) socio.EmailContacto = dto.EmailContacto;
        if (dto.MapaUrl != null) socio.MapaUrl = dto.MapaUrl;
        if (dto.EstadoFinanciero != null)
            socio.EstadoFinanciero = Enum.Parse<EstadoFinanciero>(dto.EstadoFinanciero);
        if (dto.Habilitado.HasValue) socio.Habilitado = dto.Habilitado.Value;

        await _socios.UpdateAsync(socio);

        await _logService.RegistrarAsync(TipoEventoLogActividad.CrudSocio, query: $"Editar: {socio.NombreEmpresa}");

        return Ok(socio.ToDto());
    }

    /// <summary>
    /// Eliminar un socio.
    /// </summary>
    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var socio = await _socios.GetByIdAsync(id);
        if (socio == null) return NotFound();

        await _socios.DeleteAsync(id);
        await _logService.RegistrarAsync(TipoEventoLogActividad.CrudSocio, query: $"Eliminar: {socio.NombreEmpresa}");

        return NoContent();
    }

    /// <summary>
    /// Toggle: habilitar/deshabilitar micro-sitio de un socio.
    /// </summary>
    [HttpPatch("{id:guid}/toggle-habilitado")]
    public async Task<IActionResult> ToggleHabilitado(Guid id)
    {
        var socio = await _socios.GetByIdAsync(id);
        if (socio == null) return NotFound();

        socio.Habilitado = !socio.Habilitado;
        await _socios.UpdateAsync(socio);

        return Ok(new { socio.Habilitado });
    }

    /// <summary>
    /// Cambiar estado financiero de un socio (AlDia / EnMora).
    /// Si pasa a EnMora, se deshabilita automáticamente.
    /// </summary>
    [HttpPatch("{id:guid}/estado-financiero")]
    public async Task<IActionResult> CambiarEstadoFinanciero(Guid id, [FromQuery] string estado)
    {
        var socio = await _socios.GetByIdAsync(id);
        if (socio == null) return NotFound();

        if (!Enum.TryParse<EstadoFinanciero>(estado, true, out var nuevoEstado))
            return BadRequest(new { message = "Estado inválido. Use AlDia o EnMora" });

        socio.EstadoFinanciero = nuevoEstado;
        if (socio.EstadoFinanciero == EstadoFinanciero.EnMora)
            socio.Habilitado = false;

        await _socios.UpdateAsync(socio);

        return Ok(new { EstadoFinanciero = socio.EstadoFinanciero.ToString(), socio.Habilitado });
    }

    /// <summary>
    /// Genera un slug URL-seguro eliminando tildes, ñ y caracteres especiales.
    /// Ejemplo: "Técnica & Soluciones S.A." → "tecnica-soluciones-sa"
    /// </summary>
    private static string GenerarSlug(string texto)
    {
        // Normalizar a forma D (separa letras de sus diacríticos)
        var normalizado = texto.Normalize(NormalizationForm.FormD);

        // Eliminar marcas diacríticas (tildes, etc.)
        var sb = new StringBuilder();
        foreach (var c in normalizado)
        {
            var cat = System.Globalization.CharUnicodeInfo.GetUnicodeCategory(c);
            if (cat != System.Globalization.UnicodeCategory.NonSpacingMark)
                sb.Append(c);
        }

        var slug = sb.ToString().Normalize(NormalizationForm.FormC).ToLowerInvariant();

        // Reemplazar ñ (ya normalizada a n + tilde → queda 'n', ok)
        // Reemplazar espacios y separadores por guión
        slug = Regex.Replace(slug, @"[\s\-]+", "-");

        // Eliminar caracteres no alfanuméricos ni guiones
        slug = Regex.Replace(slug, @"[^a-z0-9\-]", "");

        // Eliminar guiones al inicio o fin
        slug = slug.Trim('-');

        return slug;
    }
}
