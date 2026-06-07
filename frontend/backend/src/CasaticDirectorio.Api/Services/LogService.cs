using CasaticDirectorio.Domain.Entities;
using CasaticDirectorio.Domain.Enums;
using CasaticDirectorio.Domain.Interfaces;

namespace CasaticDirectorio.Api.Services;

/// <summary>
/// Servicio centralizado para registrar actividad en la BD.
/// Cualquier error al persistir el log se loguea pero NO se propaga,
/// para no romper el flujo principal (login, búsqueda, etc.).
/// </summary>
public class LogService : ILogService
{
    private readonly ILogActividadRepository _repo;
    private readonly ILogger<LogService> _logger;

    public LogService(ILogActividadRepository repo, ILogger<LogService> logger)
    {
        _repo = repo;
        _logger = logger;
    }

    public async Task RegistrarAsync(
        TipoEventoLogActividad tipo,
        string? query = null,
        Guid? socioId = null,
        Guid? usuarioId = null,
        string? ip = null,
        string? userAgent = null)
    {
        try
        {
            var log = new LogActividad
            {
                TipoEvento = tipo,
                Fecha = DateTime.UtcNow,
                Query = Truncate(query, 500),
                SocioId = socioId,
                UsuarioId = usuarioId,
                Ip = Truncate(ip, 45),
                UserAgent = Truncate(userAgent, 500)
            };

            await _repo.AddAsync(log);
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex,
                "No se pudo registrar log de actividad ({Tipo}). Se ignora para no romper el flujo.",
                tipo);
        }
    }

    private static string? Truncate(string? value, int max) =>
        string.IsNullOrEmpty(value) || value.Length <= max
            ? value
            : value[..max];
}
