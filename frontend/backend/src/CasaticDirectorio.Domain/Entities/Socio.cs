using CasaticDirectorio.Domain.Enums;

namespace CasaticDirectorio.Domain.Entities;

/// <summary>
/// Socio de CASATIC: empresa asociada con micro-sitio en el directorio.
/// </summary>
public class Socio
{
    public Guid Id { get; set; }
    public string NombreEmpresa { get; set; } = string.Empty;

    /// <summary>
    /// Slug único para la URL del micro-sitio: /socio/{slug}
    /// </summary>
    public string Slug { get; set; } = string.Empty;

    public string Descripcion { get; set; } = string.Empty;

    /// <summary>
    /// Lista de especialidades (almacenado como array en PostgreSQL).
    /// </summary>
    public List<string> Especialidades { get; set; } = new();

    /// <summary>
    /// Lista de servicios ofrecidos.
    /// </summary>
    public List<string> Servicios { get; set; } = new();

    /// <summary>
    /// Redes sociales - campos individuales para mejor indexación y queries.
    /// </summary>
    public string RsWebsite { get; set; } = string.Empty;
    public string RsFacebook { get; set; } = string.Empty;
    public string RsLinkedin { get; set; } = string.Empty;
    public string RsTwitter { get; set; } = string.Empty;
    public string RsInstagram { get; set; } = string.Empty;
    public string RsYoutube { get; set; } = string.Empty;

    public string Telefono { get; set; } = string.Empty;
    public string Direccion { get; set; } = string.Empty;
    public string LogoUrl { get; set; } = string.Empty;

    /// <summary>
    /// Correo electrónico de contacto de la empresa.
    /// Se usa para enviar notificaciones de formularios de contacto.
    /// </summary>
    public string EmailContacto { get; set; } = string.Empty;

    /// <summary>
    /// URL de Google Maps u otro servicio de mapas.
    /// </summary>
    public string MapaUrl { get; set; } = string.Empty;

    /// <summary>

    /// Marcas que representa el socio (máx. 50 palabras).
    /// </summary>
    public string MarcasRepresenta { get; set; } = string.Empty;

    /// <summary>
    /// Estado financiero del socio. Determina visibilidad del micro-sitio.
    /// </summary>
    public EstadoFinanciero EstadoFinanciero { get; set; } = EstadoFinanciero.AlDia;

    /// <summary>
    /// Si es false, el micro-sitio no se muestra en el portal público.
    /// </summary>
    public bool Habilitado { get; set; } = true;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    /// <summary>
    /// Vector de búsqueda full-text para PostgreSQL (columna tsvector).
    /// </summary>
    public NpgsqlTypes.NpgsqlTsVector? SearchVector { get; set; }

    // Navegación
    public List<FormularioContacto> Formularios { get; set; } = new();
    public List<LogActividad> Logs { get; set; } = new();
    public List<Evento> Eventos { get; set; } = new();
    public List<Factura> Facturas { get; set; } = new();
}
