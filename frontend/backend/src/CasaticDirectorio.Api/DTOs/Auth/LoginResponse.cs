namespace CasaticDirectorio.Api.DTOs.Auth;

public class LoginResponse
{
    public string Token { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Rol { get; set; } = string.Empty;
    public bool PrimerLogin { get; set; }
    public Guid? SocioId { get; set; }
}
