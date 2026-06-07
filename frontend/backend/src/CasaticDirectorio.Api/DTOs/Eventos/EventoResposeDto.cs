namespace CasaticDirectorio.Api.DTOs.Eventos;

public class EventoResponseDto
{
    public Guid Id { get; set; }

    public string Slug { get; set; } = string.Empty;

    public Guid SocioId { get; set; }

    public string SocioNombre { get; set; } = string.Empty;

    public string Titulo { get; set; } = string.Empty;

    public string Descripcion { get; set; } = string.Empty;

    public string Tipo { get; set; } = string.Empty;

    public string Modalidad { get; set; } = string.Empty;

    public string Estado { get; set; } = string.Empty;

    public DateTime FechaInicio { get; set; }

    public DateTime? FechaFin { get; set; }

    public string? Lugar { get; set; }

    public string? ImagenUrl { get; set; }

    public bool Destacado { get; set; }
}