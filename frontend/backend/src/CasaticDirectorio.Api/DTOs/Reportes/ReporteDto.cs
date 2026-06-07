namespace CasaticDirectorio.Api.DTOs.Reportes;

/// <summary>
/// DTO para el dashboard de métricas administrativas.
/// </summary>
public class DashboardDto
{
    public int VisitasSemana { get; set; }
    public int VisitasMes { get; set; }
    public int BusquedasMes { get; set; }
    public int FormulariosMes { get; set; }
    public int TotalSocios { get; set; }
    public int SociosActivos { get; set; }
    public int SociosEnMora { get; set; }
    public int SociosMesAnterior { get; set; }
    public Dictionary<string, int> LoginsPorUsuario { get; set; } = new();
    public List<VisitaDiariaDto> VisitasDiarias { get; set; } = new();
}

public class VisitaDiariaDto
{
    public string Fecha { get; set; } = string.Empty;
    public int Cantidad { get; set; }
}
