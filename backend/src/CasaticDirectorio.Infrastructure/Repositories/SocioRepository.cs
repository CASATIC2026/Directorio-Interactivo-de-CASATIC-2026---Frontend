using CasaticDirectorio.Domain.Entities;
using CasaticDirectorio.Domain.Interfaces;
using CasaticDirectorio.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;    
using System.Text.RegularExpressions;

namespace CasaticDirectorio.Infrastructure.Repositories;

public class SocioRepository : ISocioRepository
{
    private readonly AppDbContext _db;
    public SocioRepository(AppDbContext db) => _db = db;

    public async Task<Socio?> GetByIdAsync(Guid id) =>
        await _db.Socios.FindAsync(id);

    public async Task<Socio?> GetBySlugAsync(string slug) =>
        await _db.Socios.FirstOrDefaultAsync(s => s.Slug == slug);

    /// <summary>
    /// Búsqueda paginada con Full-Text Search (PostgreSQL to_tsquery)
    /// y filtro opcional por especialidad.
    /// </summary>
    public async Task<(List<Socio> Items, int Total)> SearchAsync(
        string? query, IEnumerable<string>? especialidades, string? inicial, string? servicio, string? producto, string? sector, string? estado, DateTime? fechaDesde, DateTime? fechaHasta, int page, int pageSize)
    {
        var q = _db.Socios.AsQueryable();

        // Solo mostrar socios habilitados en el portal público
        q = q.Where(s => s.Habilitado);

        // Filtro por estado financiero (por defecto solo AlDia, salvo que se indique otro)
        if (!string.IsNullOrWhiteSpace(estado))
        {
            if (Enum.TryParse<Domain.Enums.EstadoFinanciero>(estado, out var estadoFinanciero))
                q = q.Where(s => s.EstadoFinanciero == estadoFinanciero);
        }
        else
        {
            q = q.Where(s => s.EstadoFinanciero == Domain.Enums.EstadoFinanciero.AlDia);
        }

        // Filtro por sector
        if (!string.IsNullOrWhiteSpace(sector))
        {
            q = q.Where(s => s.Especialidades.Contains(sector));
        }

        // Filtro por fechas
        if (fechaDesde.HasValue)
        {
            q = q.Where(s => s.CreatedAt >= fechaDesde.Value);
        }
        if (fechaHasta.HasValue)
        {
            q = q.Where(s => s.CreatedAt <= fechaHasta.Value);
        }

        // Full-Text Search con índice GIN
        if (!string.IsNullOrWhiteSpace(query))
        {
            var sanitized = query.Trim();
            q = q.Where(s => s.SearchVector!.Matches(EF.Functions.PlainToTsQuery("spanish", sanitized)));
        }

        if (!string.IsNullOrWhiteSpace(inicial))
        {
            var value = inicial.Trim().ToUpperInvariant();
            if (value == "0-9")
            {
                q = q.Where(s => Regex.IsMatch(s.NombreEmpresa, "^[0-9]"));
            }
            else if (value.Length == 1 && value[0] is >= 'A' and <= 'Z')
            {
                q = q.Where(s => EF.Functions.ILike(s.NombreEmpresa, $"{value}%"));
            }
        }

        var especialidadesList = (especialidades ?? [])
            .Where(e => !string.IsNullOrWhiteSpace(e))
            .Select(e => e.Trim())
            .Distinct(StringComparer.OrdinalIgnoreCase)
            .ToList();

        // Filtro por una o varias especialidades (modo OR).
        if (especialidadesList.Count > 0)
        {
            q = q.Where(s => s.Especialidades.Any(e => especialidadesList.Contains(e)));
        }

        // Filtro por servicio (ANY en el array PostgreSQL)
        if (!string.IsNullOrWhiteSpace(servicio))
        {
            q = q.Where(s => s.Servicios.Contains(servicio));
        }

        // Filtro por producto/marca representada (texto libre)
        if (!string.IsNullOrWhiteSpace(producto))
        {
            var pattern = $"%{producto.Trim()}%";
            q = q.Where(s => EF.Functions.ILike(s.MarcasRepresenta, pattern));
        }

        var total = await q.CountAsync();

        var items = await q
            .OrderBy(s => s.NombreEmpresa)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return (items, total);
    }

    public async Task<List<Socio>> GetAllAsync() =>
        await _db.Socios.OrderBy(s => s.NombreEmpresa).ToListAsync();

    public async Task AddAsync(Socio socio)
    {
        _db.Socios.Add(socio);
        await _db.SaveChangesAsync();
    }

    public async Task UpdateAsync(Socio socio)
    {
        socio.UpdatedAt = DateTime.UtcNow;
        _db.Socios.Update(socio);
        await _db.SaveChangesAsync();
    }

    public async Task DeleteAsync(Guid id)
    {
        var socio = await _db.Socios.FindAsync(id);
        if (socio != null)
        {
            _db.Socios.Remove(socio);
            await _db.SaveChangesAsync();
        }
    }
}
