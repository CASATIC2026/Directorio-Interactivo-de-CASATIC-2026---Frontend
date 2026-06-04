using System.ComponentModel.DataAnnotations;

namespace CasaticDirectorio.Api.DTOs.Socios;

public class SocioCreateDto
{
    [Required, MaxLength(300)]
    public string NombreEmpresa { get; set; } = string.Empty;

    [MaxLength(300)]
    public string Slug { get; set; } = string.Empty;

    public string Descripcion { get; set; } = string.Empty;
    public List<string> Especialidades { get; set; } = new();
    public List<string> Servicios { get; set; } = new();
    public string RsWebsite { get; set; } = string.Empty;
    public string RsFacebook { get; set; } = string.Empty;
    public string RsLinkedin { get; set; } = string.Empty;
    public string RsTwitter { get; set; } = string.Empty;
    public string RsInstagram { get; set; } = string.Empty;
    public string RsYoutube { get; set; } = string.Empty;
    public string Telefono { get; set; } = string.Empty;
    public string Direccion { get; set; } = string.Empty;
    public string LogoUrl { get; set; } = string.Empty;
    public string MarcasRepresenta { get; set; } = string.Empty;

    [EmailAddress]
    [MaxLength(200)]
    public string EmailContacto { get; set; } = string.Empty;
    public string MapaUrl { get; set; } = string.Empty;
}
