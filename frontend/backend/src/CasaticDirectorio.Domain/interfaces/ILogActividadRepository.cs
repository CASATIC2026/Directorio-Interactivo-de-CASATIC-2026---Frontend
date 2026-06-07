using CasaticDirectorio.Domain.Entities;
using CasaticDirectorio.Domain.Enums;

namespace CasaticDirectorio.Domain.Interfaces;

public interface ILogActividadRepository
{
    Task AddAsync(LogActividad log);
    Task<List<LogActividad>> GetByTipoAsync(TipoEventoLogActividad tipo, DateTime desde, DateTime hasta);
    Task<int> CountByTipoAsync(TipoEventoLogActividad tipo, DateTime desde, DateTime hasta);
    Task<List<LogActividad>> GetBySocioAsync(Guid socioId, DateTime desde, DateTime hasta);
    Task<Dictionary<string, int>> GetLoginsPorUsuarioAsync(DateTime desde, DateTime hasta);
    Task<List<LogActividad>> GetAccesosByUsuarioAsync(Guid usuarioId, int top);
    Task<List<LogActividad>> GetTodosAccesosAsync(DateTime desde, DateTime hasta, int skip, int take);
    Task<int> CountTodosAccesosAsync(DateTime desde, DateTime hasta);
}
