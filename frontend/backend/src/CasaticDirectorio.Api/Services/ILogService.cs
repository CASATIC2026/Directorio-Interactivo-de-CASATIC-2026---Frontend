using CasaticDirectorio.Domain.Enums;

namespace CasaticDirectorio.Api.Services;

/// <summary>
/// Servicio centralizado de auditoría: registra eventos del sistema.
/// </summary>
public interface ILogService
{
    Task RegistrarAsync(
        TipoEventoLogActividad tipo,
        string? query = null,
        Guid? socioId = null,
        Guid? usuarioId = null,
        string? ip = null,
        string? userAgent = null);
}
