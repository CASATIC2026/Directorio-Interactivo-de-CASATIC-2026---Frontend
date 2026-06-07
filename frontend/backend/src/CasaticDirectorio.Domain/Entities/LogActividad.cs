using CasaticDirectorio.Domain.Enums;

namespace CasaticDirectorio.Domain.Entities;

/// <summary>
/// Log de actividad: registra búsquedas, visitas, logins y envíos de formularios.
/// </summary>
public class LogActividad
{
    public Guid Id { get; set; }

    /// <summary>
    /// Tipo de evento del log (Login, Busqueda, etc.).
    /// </summary>
    public TipoEventoLogActividad TipoEvento { get; set; }

    public DateTime Fecha { get; set; } = DateTime.UtcNow;

    /// <summary>
    /// Texto libre asociado al evento (búsqueda, descripción de operación, etc.).
    /// </summary>
    public string? Query { get; set; }

    /// <summary>
    /// Socio relacionado (si aplica).
    /// </summary>
    public Guid? SocioId { get; set; }
    public Socio? Socio { get; set; }

    /// <summary>
    /// ID del usuario que generó el evento (si aplica).
    /// </summary>
    public Guid? UsuarioId { get; set; }

    public string? Ip { get; set; }
    public string? UserAgent { get; set; }
}
