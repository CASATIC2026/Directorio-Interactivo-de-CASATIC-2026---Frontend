using CasaticDirectorio.Domain.Entities;

namespace CasaticDirectorio.Domain.Interfaces;

public interface ISocioRepository
{
    Task<Socio?> GetByIdAsync(Guid id);
    Task<Socio?> GetBySlugAsync(string slug);
    Task<Socio?> GetByEmailContactoAsync(string email);
    Task<(List<Socio> Items, int Total)> SearchAsync(
        string? query,
        IEnumerable<string>? especialidades,
        string? inicial,
        string? servicio,
        string? producto,
        string? sector,
        string? estado,
        DateTime? fechaDesde,
        DateTime? fechaHasta,
        int page,
        int pageSize);
    Task<List<Socio>> GetAllAsync();
    Task AddAsync(Socio socio);
    Task UpdateAsync(Socio socio);
    Task DeleteAsync(Guid id);
}
