using CasaticDirectorio.Domain.Entities;

namespace CasaticDirectorio.Domain.Interfaces;

public interface IFormularioContactoRepository
{
    Task AddAsync(FormularioContacto formulario);
    Task<List<FormularioContacto>> GetBySocioAsync(Guid socioId);
    Task<int> CountAsync(DateTime desde, DateTime hasta);
    Task<List<FormularioContacto>> GetAllAsync(DateTime desde, DateTime hasta);
    Task MarcarLeidoAsync(Guid id, bool leido);
}
