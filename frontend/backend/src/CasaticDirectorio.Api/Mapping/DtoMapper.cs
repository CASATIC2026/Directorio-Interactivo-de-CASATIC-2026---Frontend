using CasaticDirectorio.Api.DTOs.Socios;
using CasaticDirectorio.Api.DTOs.Usuarios;
using CasaticDirectorio.Domain.Entities;

namespace CasaticDirectorio.Api.Mapping;

public static class DtoMapper
{
    public static SocioDto ToDto(this Socio socio) => new()
    {
        Id = socio.Id,
        NombreEmpresa = socio.NombreEmpresa,
        Slug = socio.Slug,
        Descripcion = socio.Descripcion,
        Especialidades = socio.Especialidades,
        Servicios = socio.Servicios,
        RsWebsite = socio.RsWebsite,
        RsFacebook = socio.RsFacebook,
        RsLinkedin = socio.RsLinkedin,
        RsTwitter = socio.RsTwitter,
        RsInstagram = socio.RsInstagram,
        RsYoutube = socio.RsYoutube,
        Telefono = socio.Telefono,
        Direccion = socio.Direccion,
        LogoUrl = socio.LogoUrl,
        MarcasRepresenta = socio.MarcasRepresenta,
        EmailContacto = socio.EmailContacto,
        MapaUrl = socio.MapaUrl,
        EstadoFinanciero = socio.EstadoFinanciero.ToString(),
        Habilitado = socio.Habilitado,
        CreatedAt = socio.CreatedAt,
        UpdatedAt = socio.UpdatedAt
    };

    public static SocioListDto ToListDto(this Socio socio) => new()
    {
        Id = socio.Id,
        NombreEmpresa = socio.NombreEmpresa,
        Slug = socio.Slug,
        Descripcion = socio.Descripcion,
        Especialidades = socio.Especialidades,
        Servicios = socio.Servicios,
        LogoUrl = socio.LogoUrl,
        Telefono = socio.Telefono,
        Direccion = socio.Direccion
    };

    public static Socio ToEntity(this SocioCreateDto dto) => new()
    {
        NombreEmpresa = dto.NombreEmpresa,
        Slug = dto.Slug,
        Descripcion = dto.Descripcion,
        Especialidades = dto.Especialidades,
        Servicios = dto.Servicios,
        RsWebsite = dto.RsWebsite,
        RsFacebook = dto.RsFacebook,
        RsLinkedin = dto.RsLinkedin,
        RsTwitter = dto.RsTwitter,
        RsInstagram = dto.RsInstagram,
        RsYoutube = dto.RsYoutube,
        Telefono = dto.Telefono,
        Direccion = dto.Direccion,
        LogoUrl = dto.LogoUrl,
        MarcasRepresenta = dto.MarcasRepresenta,
        EmailContacto = dto.EmailContacto,
        MapaUrl = dto.MapaUrl
    };

    public static UsuarioDto ToDto(this Usuario usuario) => new()
    {
        Id = usuario.Id,
        Email = usuario.Email,
        Rol = usuario.Rol.ToString(),
        PrimerLogin = usuario.PrimerLogin,
        Activo = usuario.Activo,
        SocioId = usuario.SocioId,
        NombreEmpresa = usuario.Socio?.NombreEmpresa,
        CreatedAt = usuario.CreatedAt
    };
}
