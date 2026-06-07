namespace CasaticDirectorio.Domain.Enums;

/// <summary>
/// Tipos de evento registrados en el log de actividad.
/// </summary>
public enum TipoEventoLogActividad
{
    Busqueda = 0,
    VisitaMicroSitio = 1,
    Login = 2,
    EnvioFormulario = 3,
    CambioPassword = 4,
    CrudSocio = 5,
    LoginFallido = 6
}
