using System.Security.Claims;
using CasaticDirectorio.Api.Mapping;
using CasaticDirectorio.Api.DTOs.Socios;
using CasaticDirectorio.Api.Services;
using CasaticDirectorio.Domain.Entities;
using CasaticDirectorio.Domain.Enums;
using CasaticDirectorio.Domain.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CasaticDirectorio.Api.Controllers;

/// <summary>
/// Endpoints para que un socio gestione su propia empresa.
/// Solo accesible por usuarios con rol Usuario (o Socio legado).
/// </summary>
[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Usuario,Socio")]
public class MiEmpresaController : ControllerBase
{
    private readonly ISocioRepository _socios;
    private readonly IUsuarioRepository _usuarios;
    private readonly ILogService _logService;

    public MiEmpresaController(
        ISocioRepository socios,
        IUsuarioRepository usuarios,
        ILogService logService)
    {
        _socios = socios;
        _usuarios = usuarios;
        _logService = logService;
    }

    /// <summary>
    /// Obtener la información de mi empresa (socio autenticado).
    /// </summary>
    [HttpGet]
    public async Task<IActionResult> GetMiEmpresa()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId == null) return Unauthorized();

        var usuario = await _usuarios.GetByIdAsync(Guid.Parse(userId));
        if (usuario == null) return Unauthorized();

        Socio? socio;
        if (usuario.SocioId.HasValue)
        {
            socio = await _socios.GetByIdAsync(usuario.SocioId.Value);
        }
        else
        {
            socio = await _socios.GetByEmailContactoAsync(usuario.Email);
            if (socio != null)
            {
                usuario.SocioId = socio.Id;
                await _usuarios.UpdateAsync(usuario);
            }
        }

        if (socio == null)
            return NotFound(new { message = "No tiene una empresa asociada" });

        return Ok(socio.ToDto());
    }

    /// <summary>
    /// Actualizar la información de mi empresa (socio autenticado).
    /// El socio puede editar: descripción, especialidades, servicios,
    /// redes sociales, teléfono, dirección, logo y marcas que representa.
    /// No puede cambiar: nombre de empresa, slug, estado financiero ni habilitado.
    /// </summary>
    [HttpPut]
    public async Task<IActionResult> UpdateMiEmpresa([FromBody] SocioUpdateDto dto)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId == null) return Unauthorized();

        var usuario = await _usuarios.GetByIdAsync(Guid.Parse(userId));
        if (usuario == null) return Unauthorized();

        Socio? socio;
        if (usuario.SocioId.HasValue)
        {
            socio = await _socios.GetByIdAsync(usuario.SocioId.Value);
        }
        else
        {
            socio = await _socios.GetByEmailContactoAsync(usuario.Email);
            if (socio != null)
            {
                usuario.SocioId = socio.Id;
                await _usuarios.UpdateAsync(usuario);
            }
        }

        if (socio == null)
            return NotFound(new { message = "No tiene una empresa asociada" });

        // Actualizar solo campos permitidos para el socio
        if (dto.Descripcion != null) socio.Descripcion = dto.Descripcion;
        if (dto.Especialidades != null) socio.Especialidades = dto.Especialidades;
        if (dto.Servicios != null) socio.Servicios = dto.Servicios;
        if (dto.RsWebsite != null) socio.RsWebsite = dto.RsWebsite;
        if (dto.RsFacebook != null) socio.RsFacebook = dto.RsFacebook;
        if (dto.RsLinkedin != null) socio.RsLinkedin = dto.RsLinkedin;
        if (dto.RsTwitter != null) socio.RsTwitter = dto.RsTwitter;
        if (dto.RsInstagram != null) socio.RsInstagram = dto.RsInstagram;
        if (dto.RsYoutube != null) socio.RsYoutube = dto.RsYoutube;
        if (dto.Telefono != null) socio.Telefono = dto.Telefono;
        if (dto.Direccion != null) socio.Direccion = dto.Direccion;
        if (dto.LogoUrl != null) socio.LogoUrl = dto.LogoUrl;
        if (dto.MarcasRepresenta != null) socio.MarcasRepresenta = dto.MarcasRepresenta;

        await _socios.UpdateAsync(socio);

        await _logService.RegistrarAsync(
            TipoEventoLogActividad.CrudSocio,
            query: $"Socio editó su empresa: {socio.NombreEmpresa}",
            usuarioId: usuario.Id);

        return Ok(socio.ToDto());
    }
}
