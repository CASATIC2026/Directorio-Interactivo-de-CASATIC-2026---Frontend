using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using CasaticDirectorio.Domain.Entities;
using Microsoft.IdentityModel.Tokens;

namespace CasaticDirectorio.Api.Services;

/// <summary>
/// Servicio de generación de tokens JWT.
/// Lee la configuración validada por Program.cs (fail-fast en arranque).
/// </summary>
public class JwtService : IJwtService
{
    private readonly string _key;
    private readonly string _issuer;
    private readonly string _audience;
    private readonly int _expireMinutes;

    public JwtService(IConfiguration config)
    {
        _key = config["Jwt:Key"]
            ?? throw new InvalidOperationException("Jwt:Key no configurado");
        _issuer = config["Jwt:Issuer"]
            ?? throw new InvalidOperationException("Jwt:Issuer no configurado");
        _audience = config["Jwt:Audience"]
            ?? throw new InvalidOperationException("Jwt:Audience no configurado");

        // Default 60 min (era 480 min = 8h en el original).
        _expireMinutes = int.TryParse(config["Jwt:ExpireMinutes"], out var m) && m > 0
            ? m
            : 60;
    }

    public string GenerateToken(Usuario usuario)
    {
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_key));
        var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var claims = new List<Claim>
        {
            new(ClaimTypes.NameIdentifier, usuario.Id.ToString()),
            new(ClaimTypes.Email, usuario.Email),
            new(ClaimTypes.Role, usuario.Rol.ToString()),
            new("primer_login", usuario.PrimerLogin.ToString().ToLowerInvariant())
        };

        if (usuario.SocioId.HasValue)
        {
            claims.Add(new Claim("SocioId", usuario.SocioId.Value.ToString()));
        }

        var token = new JwtSecurityToken(
            issuer: _issuer,
            audience: _audience,
            claims: claims,
            notBefore: DateTime.UtcNow,
            expires: DateTime.UtcNow.AddMinutes(_expireMinutes),
            signingCredentials: credentials);

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}
