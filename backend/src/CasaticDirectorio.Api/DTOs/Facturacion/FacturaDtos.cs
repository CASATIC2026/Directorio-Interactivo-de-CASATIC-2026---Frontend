namespace CasaticDirectorio.Api.DTOs.Facturacion;

public record PlanMembresiaDto(
    string Nombre,
    string RangoPublicado,
    string Periodo,
    decimal MontoSugerido,
    string Descripcion);

public class FacturaDto
{
    public Guid Id { get; set; }
    public Guid SocioId { get; set; }
    public string SocioNombre { get; set; } = string.Empty;
    public string Numero { get; set; } = string.Empty;
    public string TipoDocumento { get; set; } = string.Empty;
    public string CodigoGeneracion { get; set; } = string.Empty;
    public string NumeroControl { get; set; } = string.Empty;
    public string SelloRecepcion { get; set; } = string.Empty;
    public string Ambiente { get; set; } = string.Empty;
    public string CondicionOperacion { get; set; } = string.Empty;
    public string FormaPago { get; set; } = string.Empty;
    public string ReferenciaPago { get; set; } = string.Empty;
    public string PlanNombre { get; set; } = string.Empty;
    public string PlanPeriodo { get; set; } = string.Empty;
    public string Descripcion { get; set; } = string.Empty;
    public decimal Subtotal { get; set; }
    public decimal Iva { get; set; }
    public decimal Total { get; set; }
    public string Estado { get; set; } = string.Empty;
    public DateTime FechaEmision { get; set; }
    public DateTime FechaVencimiento { get; set; }
    public DateTime? FechaPago { get; set; }
    public string Notas { get; set; } = string.Empty;
    public string? DteJson { get; set; }
}

public class FacturaUpsertDto
{
    public Guid SocioId { get; set; }
    public string TipoDocumento { get; set; } = "Factura interna";
    public string CodigoGeneracion { get; set; } = string.Empty;
    public string NumeroControl { get; set; } = string.Empty;
    public string SelloRecepcion { get; set; } = string.Empty;
    public string Ambiente { get; set; } = "Produccion";
    public string CondicionOperacion { get; set; } = "Credito";
    public string FormaPago { get; set; } = "Transferencia";
    public string ReferenciaPago { get; set; } = string.Empty;
    public string PlanNombre { get; set; } = "Socios Miembros";
    public string PlanPeriodo { get; set; } = "anual";
    public string Descripcion { get; set; } = "Membresia CASATIC";
    public decimal Subtotal { get; set; } = 400m;
    public string Estado { get; set; } = "Pendiente";
    public DateTime? FechaEmision { get; set; }
    public DateTime? FechaVencimiento { get; set; }
    public DateTime? FechaPago { get; set; }
    public string Notas { get; set; } = string.Empty;
}

public class FacturaUpdateDto
{
    public string TipoDocumento { get; set; } = "Factura interna";
    public string CodigoGeneracion { get; set; } = string.Empty;
    public string NumeroControl { get; set; } = string.Empty;
    public string SelloRecepcion { get; set; } = string.Empty;
    public string Ambiente { get; set; } = "Produccion";
    public string CondicionOperacion { get; set; } = "Credito";
    public string FormaPago { get; set; } = "Transferencia";
    public string ReferenciaPago { get; set; } = string.Empty;
    public string PlanNombre { get; set; } = "Socios Miembros";
    public string PlanPeriodo { get; set; } = "anual";
    public string Descripcion { get; set; } = "Membresia CASATIC";
    public decimal Subtotal { get; set; } = 400m;
    public string Estado { get; set; } = "Pendiente";
    public DateTime FechaEmision { get; set; }
    public DateTime FechaVencimiento { get; set; }
    public DateTime? FechaPago { get; set; }
    public string Notas { get; set; } = string.Empty;
}
