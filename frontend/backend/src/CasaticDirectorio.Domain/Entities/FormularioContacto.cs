namespace CasaticDirectorio.Domain.Entities;

/// <summary>
/// Formulario de contacto enviado a un socio desde el portal público.
/// </summary>
public class FormularioContacto
{
    public Guid Id { get; set; }

    /// <summary>
    /// Socio al que se le envía el formulario.
    /// </summary>
    public Guid SocioId { get; set; }
    public Socio? Socio { get; set; }

    public string Nombre { get; set; } = string.Empty;
    public string Correo { get; set; } = string.Empty;
    public string Mensaje { get; set; } = string.Empty;
    public DateTime Fecha { get; set; } = DateTime.UtcNow;

    /// <summary>
    /// Indica si el mensaje ya fue revisado desde el panel admin.
    /// </summary>
    public bool Leido { get; set; } = false;
}
