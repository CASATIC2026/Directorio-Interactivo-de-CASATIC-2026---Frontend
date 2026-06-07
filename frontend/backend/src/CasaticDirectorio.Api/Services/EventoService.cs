using System.Globalization;
using System.Text;
using System.Text.RegularExpressions;
using CasaticDirectorio.Api.DTOs.Eventos;
using CasaticDirectorio.Domain.Entities;
using CasaticDirectorio.Domain.Enums;
using CasaticDirectorio.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace CasaticDirectorio.Api.Services;

public class EventoService
{
    private readonly AppDbContext _db;

    public EventoService(AppDbContext db)
    {
        _db = db;
    }

    /// <summary>
    /// Crea un evento. Si el rol es Admin → queda Aprobado; si no → Pendiente.
    /// </summary>
    public async Task<Guid> CreateAsync(EventoCreateDto dto, Guid usuarioId, Rol rol)
    {
        var socio = await _db.Socios.FirstOrDefaultAsync(x => x.Id == dto.SocioId);
        if (socio == null)
            throw new KeyNotFoundException("Socio no encontrado.");

        var evento = new Evento
        {
            Id = Guid.NewGuid(),
            SocioId = dto.SocioId,
            UsuarioId = usuarioId,
            Titulo = dto.Titulo,
            Slug = GenerarSlug(dto.Titulo) + "-" + Guid.NewGuid().ToString("N")[..8],
            Descripcion = dto.Descripcion,
            Tipo = dto.Tipo,
            Modalidad = dto.Modalidad,
            FechaInicio = EnsureUtc(dto.FechaInicio),
            FechaFin = dto.FechaFin.HasValue ? EnsureUtc(dto.FechaFin.Value) : null,
            Lugar = dto.Lugar ?? string.Empty,
            ImageUrl = dto.ImagenUrl ?? string.Empty,
            Estado = rol == Rol.Admin ? EstadoEvento.Aprobado : EstadoEvento.Pendiente,
            PublicadoAt = rol == Rol.Admin ? DateTime.UtcNow : null,
            Habilitado = true,
            Destacado = false,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        _db.Eventos.Add(evento);
        await _db.SaveChangesAsync();

        return evento.Id;
    }

    /// <summary>
    /// Lista todos los eventos para el panel admin/socio.
    /// Admin ve todos; Socio ve solo los de su empresa.
    /// </summary>
    public async Task<List<EventoResponseDto>> GetAllAsync(Guid usuarioId, Rol rol)
    {
        var query = _db.Eventos.AsNoTracking().AsQueryable();

        if (rol != Rol.Admin)
        {
            var usuario = await _db.Usuarios.AsNoTracking()
                .FirstOrDefaultAsync(u => u.Id == usuarioId);
            if (usuario?.SocioId != null)
                query = query.Where(e => e.SocioId == usuario.SocioId);
            else
                return [];
        }

        return await query
            .OrderByDescending(e => e.CreatedAt)
            .Select(e => new EventoResponseDto
            {
                Id = e.Id,
                Slug = e.Slug,
                SocioId = e.SocioId,
                SocioNombre = e.Socio.NombreEmpresa,
                Titulo = e.Titulo,
                Descripcion = e.Descripcion,
                Tipo = e.Tipo.ToString(),
                Modalidad = e.Modalidad.ToString(),
                Estado = e.Estado.ToString(),
                FechaInicio = e.FechaInicio,
                FechaFin = e.FechaFin,
                Lugar = e.Lugar,
                ImagenUrl = e.ImageUrl,
                Destacado = e.Destacado
            })
            .ToListAsync();
    }

    /// <summary>
    /// Lista próximos eventos publicados (visibles al público).
    /// </summary>
    public async Task<List<EventoResponseDto>> GetProximosEventosAsync()
    {
        var now = DateTime.UtcNow;

        return await _db.Eventos
            .AsNoTracking()
            .Where(e =>
                e.Habilitado &&
                e.Estado == EstadoEvento.Aprobado &&
                e.FechaInicio >= now)
            .OrderBy(e => e.FechaInicio)
            .Select(e => new EventoResponseDto
            {
                Id = e.Id,
                Slug = e.Slug,
                SocioId = e.SocioId,
                SocioNombre = e.Socio.NombreEmpresa,
                Titulo = e.Titulo,
                Descripcion = e.Descripcion,
                Tipo = e.Tipo.ToString(),
                Modalidad = e.Modalidad.ToString(),
                Estado = e.Estado.ToString(),
                FechaInicio = e.FechaInicio,
                FechaFin = e.FechaFin,
                Lugar = e.Lugar,
                ImagenUrl = e.ImageUrl,
                Destacado = e.Destacado
            })
            .ToListAsync();
    }

    /// <summary>
    /// Obtiene un evento por ID (para CreatedAtAction).
    /// </summary>
    public async Task<EventoResponseDto?> GetByIdAsync(Guid id)
    {
        return await _db.Eventos
            .AsNoTracking()
            .Where(e => e.Id == id)
            .Select(e => new EventoResponseDto
            {
                Id = e.Id,
                Slug = e.Slug,
                SocioId = e.SocioId,
                SocioNombre = e.Socio.NombreEmpresa,
                Titulo = e.Titulo,
                Descripcion = e.Descripcion,
                Tipo = e.Tipo.ToString(),
                Modalidad = e.Modalidad.ToString(),
                Estado = e.Estado.ToString(),
                FechaInicio = e.FechaInicio,
                FechaFin = e.FechaFin,
                Lugar = e.Lugar,
                ImagenUrl = e.ImageUrl,
                Destacado = e.Destacado
            })
            .FirstOrDefaultAsync();
    }

    /// <summary>
    /// Aprueba un evento (admin).
    /// </summary>
    public async Task AprobarEventoAsync(Guid eventoId)
    {
        var evento = await _db.Eventos.FirstOrDefaultAsync(x => x.Id == eventoId);
        if (evento == null)
            throw new KeyNotFoundException("Evento no encontrado.");

        evento.Estado = EstadoEvento.Aprobado;
        evento.Habilitado = true;
        evento.PublicadoAt = DateTime.UtcNow;
        evento.UpdatedAt = DateTime.UtcNow;

        await _db.SaveChangesAsync();
    }

    /// <summary>
    /// Rechaza un evento (admin).
    /// </summary>
    public async Task RechazarEventoAsync(Guid eventoId)
    {
        var evento = await _db.Eventos.FirstOrDefaultAsync(x => x.Id == eventoId);
        if (evento == null)
            throw new KeyNotFoundException("Evento no encontrado.");

        evento.Estado = EstadoEvento.Rechazado;
        evento.Habilitado = false;
        evento.PublicadoAt = null;
        evento.UpdatedAt = DateTime.UtcNow;

        await _db.SaveChangesAsync();
    }

    /// <summary>
    /// Elimina un evento (admin).
    /// </summary>
    public async Task DeleteAsync(Guid eventoId)
    {
        var evento = await _db.Eventos.FirstOrDefaultAsync(x => x.Id == eventoId);
        if (evento == null)
            throw new KeyNotFoundException("Evento no encontrado.");

        _db.Eventos.Remove(evento);
        await _db.SaveChangesAsync();
    }

    // ── Helpers ─────────────────────────────────────────────

    private static DateTime EnsureUtc(DateTime dt) =>
        dt.Kind switch
        {
            DateTimeKind.Utc => dt,
            DateTimeKind.Local => dt.ToUniversalTime(),
            _ => DateTime.SpecifyKind(dt, DateTimeKind.Utc)
        };

    private static string GenerarSlug(string texto)
    {
        if (string.IsNullOrWhiteSpace(texto)) return "evento";

        var normalizado = texto.Normalize(NormalizationForm.FormD);
        var sb = new StringBuilder();
        foreach (var c in normalizado)
        {
            if (CharUnicodeInfo.GetUnicodeCategory(c) != UnicodeCategory.NonSpacingMark)
                sb.Append(c);
        }

        var slug = sb.ToString().Normalize(NormalizationForm.FormC).ToLowerInvariant();
        slug = Regex.Replace(slug, @"[\s_]+", "-");
        slug = Regex.Replace(slug, @"[^a-z0-9\-]", "");
        slug = Regex.Replace(slug, @"-+", "-").Trim('-');
        return string.IsNullOrEmpty(slug) ? "evento" : slug;
    }
}
