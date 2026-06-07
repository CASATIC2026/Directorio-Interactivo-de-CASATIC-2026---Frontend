namespace CasaticDirectorio.Api.DTOs.Usuarios;

public class UsuarioDto
{
    public Guid Id { get; set; }
    public string Email { get; set; } = string.Empty;
    public string Rol { get; set; } = string.Empty;
    public bool PrimerLogin { get; set; }
    public bool Activo { get; set; }
    public Guid? SocioId { get; set; }
    public string? NombreEmpresa { get; set; }
    public DateTime CreatedAt { get; set; }
}
