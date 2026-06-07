namespace CasaticDirectorio.Api.DTOs.Directorio;

public class DirectorioFilterDto
{
    /// <summary>
    /// Texto de búsqueda (Full-Text Search).
    /// </summary>
    public string? Query { get; set; }

    /// <summary>
    /// Filtrar por especialidad.
    /// </summary>
    public string? Especialidad { get; set; }

    /// <summary>
    /// Filtrar por varias especialidades. Tambien se acepta Especialidad con valores separados por coma.
    /// </summary>
    public List<string> Especialidades { get; set; } = new();

    /// <summary>
    /// Filtrar por inicial del nombre de empresa.
    /// </summary>
    public string? Inicial { get; set; }

    /// <summary>
    /// Filtrar por servicio.
    /// </summary>
    public string? Servicio { get; set; }

    /// <summary>
    /// Filtrar por producto/marca representada.
    /// </summary>
    public string? Producto { get; set; }

    /// <summary>
    /// Filtrar por sector.
    /// </summary>
    public string? Sector { get; set; }

    /// <summary>
    /// Filtrar por estado financiero.
    /// </summary>
    public string? Estado { get; set; }

    /// <summary>
    /// Filtrar por fecha de creación (desde).
    /// </summary>
    public DateTime? FechaDesde { get; set; }

    /// <summary>
    /// Filtrar por fecha de creación (hasta).
    /// </summary>
    public DateTime? FechaHasta { get; set; }

    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 12;
}
