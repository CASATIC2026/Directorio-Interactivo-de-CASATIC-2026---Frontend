namespace CasaticDirectorio.Api.DTOs.Socios;

/// <summary>
/// DTO resumido para listados del directorio.
/// </summary>
public class SocioListDto
{
    public Guid Id { get; set; }
    public string NombreEmpresa { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string Descripcion { get; set; } = string.Empty;
    public List<string> Especialidades { get; set; } = new();
    public List<string> Servicios { get; set; } = new();
    public string LogoUrl { get; set; } = string.Empty;
    public string Telefono { get; set; } = string.Empty;
    public string Direccion { get; set; } = string.Empty;
}
