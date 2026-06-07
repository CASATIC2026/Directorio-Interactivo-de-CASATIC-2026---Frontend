using System.ComponentModel.DataAnnotations;

namespace CasaticDirectorio.Api.DTOs.Auth;

public class CambiarPasswordRequest
{
    [Required, MinLength(8)]
    [RegularExpression(@"^(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).{8,}$",
        ErrorMessage = "La contraseña debe tener al menos 8 caracteres, una mayúscula, un número y un carácter especial.")]
    public string NuevaPassword { get; set; } = string.Empty;
}
