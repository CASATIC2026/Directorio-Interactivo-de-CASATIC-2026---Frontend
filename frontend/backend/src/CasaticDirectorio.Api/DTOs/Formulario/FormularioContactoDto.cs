using System.ComponentModel.DataAnnotations;

namespace CasaticDirectorio.Api.DTOs.Formulario;

public class FormularioContactoDto
{
    [Required, MaxLength(200)]
    public string Nombre { get; set; } = string.Empty;

    [Required, EmailAddress, MaxLength(256)]
    public string Correo { get; set; } = string.Empty;

    [MaxLength(200)]
    public string? Asunto { get; set; }

    [Required]
    public string Mensaje { get; set; } = string.Empty;
}
