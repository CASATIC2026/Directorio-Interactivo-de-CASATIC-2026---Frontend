using CasaticDirectorio.Domain.Enums;

namespace CasaticDirectorio.Domain.Entities;

public class Factura
{
    public Guid Id { get; set; }
    public Guid SocioId { get; set; }
    public Socio Socio { get; set; } = null!;

    public string Numero { get; set; } = string.Empty;
    public string TipoDocumento { get; set; } = "Factura interna";
    public string CodigoGeneracion { get; set; } = string.Empty;
    public string NumeroControl { get; set; } = string.Empty;
    public string SelloRecepcion { get; set; } = string.Empty;
    public string Ambiente { get; set; } = "Produccion";
    public string CondicionOperacion { get; set; } = "Credito";
    public string FormaPago { get; set; } = "Transferencia";
    public string ReferenciaPago { get; set; } = string.Empty;
    public string PlanNombre { get; set; } = string.Empty;
    public string PlanPeriodo { get; set; } = string.Empty;
    public string Descripcion { get; set; } = string.Empty;

    public decimal Subtotal { get; set; }
    public decimal Iva { get; set; }
    public decimal Total { get; set; }

    // JSON bruto del DTE importado (opcional)
    public string? DteJson { get; set; }

    public EstadoFactura Estado { get; set; } = EstadoFactura.Pendiente;
    public DateTime FechaEmision { get; set; } = DateTime.UtcNow;
    public DateTime FechaVencimiento { get; set; } = DateTime.UtcNow.AddDays(30);
    public DateTime? FechaPago { get; set; }
    public string Notas { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}
