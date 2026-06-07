using CasaticDirectorio.Domain.Enums;

namespace CasaticDirectorio.Domain.Entities;

/// <summary>
/// Entidad de usuario del sistema (admin o usuario de empresa).
/// El primer login fuerza cambio de contraseña.
/// </summary>
public class Usuario
{
    public Guid Id { get; set; }
    public string Email { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public Rol Rol { get; set; }

    /// <summary>
    /// Indica si el usuario aún no ha cambiado su contraseña genérica.
    /// </summary>
    public bool PrimerLogin { get; set; } = true;

    public bool Activo { get; set; } = true;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    /// <summary>
    /// Token para recuperación de contraseña olvidada.
    /// </summary>
    public string? TokenRecuperacion { get; set; }

    /// <summary>
    /// Fecha de expiración del token de recuperación (24 horas).
    /// </summary>
    public DateTime? FechaExpiracionToken { get; set; }

    /// <summary>
    /// Relación opcional con Socio (solo para rol Usuario/Socio legado).
    /// </summary>
    public Guid? SocioId { get; set; }
    public Socio? Socio { get; set; }
}
