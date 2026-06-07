using CasaticDirectorio.Domain.Enums;

namespace CasaticDirectorio.Api.DTOs.Eventos;

public class EventoCreateDto
{
    public Guid SocioId { get; set; }

    public string Titulo { get; set; } = string.Empty;

    public string Descripcion { get; set; } = string.Empty;

    public TipoEvento Tipo { get; set; }

    public ModalidadEvento Modalidad { get; set; }

    public DateTime FechaInicio { get; set; }

    public DateTime? FechaFin { get; set; }

    public string? Lugar { get; set; } 

    public string? ImagenUrl { get; set; } 
}