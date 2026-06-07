using CasaticDirectorio.Domain.Enums;

namespace CasaticDirectorio.Domain.Entities;

/// <summary>
/// Evento organizado por CASATIC: conferencias, talleres, webinars, etc.
/// </summary>
public class Evento
{
    public Guid Id { get; set; }

    /// <summary>
    /// Socio (empresa) que organiza o al que pertenece el evento.
    /// </summary>
    public Guid SocioId { get; set; }
    public Socio Socio { get; set; } = null!;

    /// <summary>
    /// Usuario que creó el evento (admin o socio). Opcional.
    /// </summary>
    public Guid? UsuarioId { get; set; }
    public Usuario? Usuario { get; set; }

    /// <summary>
    /// Título principal del evento.
    /// </summary>
    public string Titulo { get; set; } = string.Empty;

    /// <summary>
    /// Slug único para URL pública: /eventos/{slug}.
    /// </summary>
    public string Slug { get; set; } = string.Empty;

    /// <summary>
    /// Descripción detallada del evento.
    /// </summary>
    public string Descripcion { get; set; } = string.Empty;

    /// <summary>
    /// Tipo de evento (Conferencia, Webinar, Taller, etc.).
    /// </summary>
    public TipoEvento Tipo { get; set; }

    /// <summary>
    /// Modalidad del evento (Presencial, Virtual, Híbrido).
    /// </summary>
    public ModalidadEvento Modalidad { get; set; }

    /// <summary>
    /// Fecha y hora de inicio del evento (UTC).
    /// </summary>
    public DateTime FechaInicio { get; set; }

    /// <summary>
    /// Fecha y hora de finalización del evento (UTC).
    /// </summary>
    public DateTime? FechaFin { get; set; }

    /// <summary>
    /// Lugar físico o enlace virtual del evento.
    /// </summary>
    public string Lugar { get; set; } = string.Empty;

    /// <summary>
    /// Imagen representativa del evento (URL).
    /// </summary>
    public string ImageUrl { get; set; } = string.Empty;

    /// <summary>
    /// Estado del evento (Pendiente, Aprobado, Rechazado, Finalizado).
    /// </summary>
    public EstadoEvento Estado { get; set; } = EstadoEvento.Pendiente;

    /// <summary>
    /// Determina si el evento es visible públicamente.
    /// </summary>
    public bool Habilitado { get; set; } = true;

    /// <summary>
    /// Indica si el evento está destacado.
    /// </summary>
    public bool Destacado { get; set; } = false;

    /// <summary>
    /// Fecha en que fue publicado el evento (al ser aprobado).
    /// </summary>
    public DateTime? PublicadoAt { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}
