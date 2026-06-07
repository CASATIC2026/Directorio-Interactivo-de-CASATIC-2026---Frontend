using CasaticDirectorio.Domain.Entities;

namespace CasaticDirectorio.Api.Services;

public interface IJwtService
{
    /// <summary>
    /// Genera un JWT firmado para el usuario indicado.
    /// </summary>
    string GenerateToken(Usuario usuario);
}
