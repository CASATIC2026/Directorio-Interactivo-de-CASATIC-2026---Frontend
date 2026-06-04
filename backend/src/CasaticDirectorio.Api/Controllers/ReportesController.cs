using CasaticDirectorio.Api.DTOs.Reportes;
using CasaticDirectorio.Domain.Enums;
using CasaticDirectorio.Domain.Interfaces;
using CasaticDirectorio.Infrastructure.Data;
using ClosedXML.Excel;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CasaticDirectorio.Api.Controllers;

/// <summary>
/// Dashboard de métricas y reportería — Solo Admin.
/// </summary>
[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Admin")]
public class ReportesController : ControllerBase
{
    private readonly ILogActividadRepository _logs;
    private readonly IFormularioContactoRepository _formularios;
    private readonly AppDbContext _db;

    public ReportesController(
        ILogActividadRepository logs,
        IFormularioContactoRepository formularios,
        AppDbContext db)
    {
        _logs = logs;
        _formularios = formularios;
        _db = db;
    }

    [HttpGet("dashboard")]
    public async Task<IActionResult> GetDashboard()
    {
        var ahora = DateTime.UtcNow;
        var inicioSemana = ahora.AddDays(-7);
        var inicioMes = ahora.AddDays(-30);

        var visitasSemana = await _logs.CountByTipoAsync(
            TipoEventoLogActividad.VisitaMicroSitio, inicioSemana, ahora);
        var visitasMes = await _logs.CountByTipoAsync(
            TipoEventoLogActividad.VisitaMicroSitio, inicioMes, ahora);
        var busquedasMes = await _logs.CountByTipoAsync(
            TipoEventoLogActividad.Busqueda, inicioMes, ahora);
        var formulariosMes = await _formularios.CountAsync(inicioMes, ahora);

        var totalSocios = await _db.Socios.CountAsync();
        var sociosActivos = await _db.Socios.CountAsync(s =>
            s.Habilitado && s.EstadoFinanciero == EstadoFinanciero.AlDia);
        var sociosEnMora = await _db.Socios.CountAsync(s =>
            s.EstadoFinanciero == EstadoFinanciero.EnMora);

        var inicioMesAnterior = inicioMes.AddMonths(-1);
        var sociosMesAnterior = await _db.Socios.CountAsync(s =>
            s.CreatedAt >= inicioMesAnterior && s.CreatedAt < inicioMes);

        var loginsPorUsuario = await _logs.GetLoginsPorUsuarioAsync(inicioMes, ahora);

        // Visitas diarias en SQL puro (antes traía a memoria con .ToListAsync()).
        var visitasDiariasRaw = await _db.LogsActividad
            .Where(l => l.TipoEvento == TipoEventoLogActividad.VisitaMicroSitio && l.Fecha >= inicioMes)
            .GroupBy(l => l.Fecha.Date)
            .Select(g => new { Fecha = g.Key, Cantidad = g.Count() })
            .OrderBy(x => x.Fecha)
            .ToListAsync();

        var visitasDiarias = visitasDiariasRaw
            .Select(x => new VisitaDiariaDto
            {
                Fecha = x.Fecha.ToString("yyyy-MM-dd"),
                Cantidad = x.Cantidad
            })
            .ToList();

        return Ok(new DashboardDto
        {
            VisitasSemana = visitasSemana,
            VisitasMes = visitasMes,
            BusquedasMes = busquedasMes,
            FormulariosMes = formulariosMes,
            TotalSocios = totalSocios,
            SociosActivos = sociosActivos,
            SociosEnMora = sociosEnMora,
            SociosMesAnterior = sociosMesAnterior,
            LoginsPorUsuario = loginsPorUsuario,
            VisitasDiarias = visitasDiarias
        });
    }

    [HttpGet("busquedas")]
    public async Task<IActionResult> GetBusquedas([FromQuery] DateTime? desde, [FromQuery] DateTime? hasta)
    {
        var d = EnsureUtc(desde ?? DateTime.UtcNow.AddDays(-30));
        var h = EnsureUtc(hasta ?? DateTime.UtcNow);
        var logs = await _logs.GetByTipoAsync(TipoEventoLogActividad.Busqueda, d, h);
        return Ok(logs.Select(l => new { l.Fecha, l.Query, l.Ip }));
    }

    [HttpGet("formularios")]
    public async Task<IActionResult> GetFormularios([FromQuery] DateTime? desde, [FromQuery] DateTime? hasta)
    {
        var d = EnsureUtc(desde ?? DateTime.UtcNow.AddDays(-30));
        var h = EnsureUtc(hasta ?? DateTime.UtcNow);
        var formularios = await _formularios.GetAllAsync(d, h);
        return Ok(formularios.Select(f => new
        {
            f.Id,
            f.Nombre,
            f.Correo,
            f.Mensaje,
            f.Fecha,
            Socio = f.Socio?.NombreEmpresa
        }));
    }

    /// <summary>
    /// Exportar socios a Excel.
    /// FIX: la versión original tenía un bug donde escribía FechaCreacion
    /// en la columna 15 (sobreescribía RsFacebook), y los headers (15) no
    /// coincidían con las columnas usadas (19).
    /// </summary>
    [HttpGet("exportar-socios")]
    public async Task<IActionResult> ExportarSocios()
    {
        var socios = await _db.Socios
            .OrderBy(s => s.NombreEmpresa)
            .Select(s => new
            {
                s.NombreEmpresa,
                s.Slug,
                s.EmailContacto,
                s.Telefono,
                s.Direccion,
                s.Descripcion,
                Especialidades = string.Join(", ", s.Especialidades),
                Servicios = string.Join(", ", s.Servicios),
                s.MarcasRepresenta,
                EstadoFinanciero = s.EstadoFinanciero.ToString(),
                Habilitado = s.Habilitado ? "Sí" : "No",
                s.MapaUrl,
                s.LogoUrl,
                s.RsWebsite,
                s.RsFacebook,
                s.RsLinkedin,
                s.RsTwitter,
                s.RsInstagram,
                s.RsYoutube,
                FechaCreacion = s.CreatedAt
            })
            .ToListAsync();

        using var workbook = new XLWorkbook();
        var ws = workbook.Worksheets.Add("Socios");

        var headers = new[]
        {
            "Nombre Empresa", "Slug", "Email Contacto", "Teléfono", "Dirección",
            "Descripción", "Especialidades", "Servicios", "Marcas Representa",
            "Estado Financiero", "Habilitado", "Mapa URL", "Logo URL",
            "Website", "Facebook", "LinkedIn", "Twitter", "Instagram", "YouTube",
            "Fecha Creación"
        };

        for (var c = 0; c < headers.Length; c++)
        {
            var cell = ws.Cell(1, c + 1);
            cell.Value = headers[c];
            cell.Style.Font.Bold = true;
            cell.Style.Fill.BackgroundColor = XLColor.FromHtml("#0e3877");
            cell.Style.Font.FontColor = XLColor.White;
            cell.Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;
        }

        for (var r = 0; r < socios.Count; r++)
        {
            var s = socios[r];
            var row = r + 2;
            ws.Cell(row, 1).Value = s.NombreEmpresa;
            ws.Cell(row, 2).Value = s.Slug;
            ws.Cell(row, 3).Value = s.EmailContacto;
            ws.Cell(row, 4).Value = s.Telefono;
            ws.Cell(row, 5).Value = s.Direccion;
            ws.Cell(row, 6).Value = s.Descripcion;
            ws.Cell(row, 7).Value = s.Especialidades;
            ws.Cell(row, 8).Value = s.Servicios;
            ws.Cell(row, 9).Value = s.MarcasRepresenta;
            ws.Cell(row, 10).Value = s.EstadoFinanciero;
            ws.Cell(row, 11).Value = s.Habilitado;
            ws.Cell(row, 12).Value = s.MapaUrl;
            ws.Cell(row, 13).Value = s.LogoUrl;
            ws.Cell(row, 14).Value = s.RsWebsite;
            ws.Cell(row, 15).Value = s.RsFacebook;
            ws.Cell(row, 16).Value = s.RsLinkedin;
            ws.Cell(row, 17).Value = s.RsTwitter;
            ws.Cell(row, 18).Value = s.RsInstagram;
            ws.Cell(row, 19).Value = s.RsYoutube;
            ws.Cell(row, 20).Value = s.FechaCreacion.ToString("yyyy-MM-dd HH:mm");

            if (r % 2 == 0)
            {
                ws.Range(row, 1, row, headers.Length)
                  .Style.Fill.BackgroundColor = XLColor.FromHtml("#f0f4ff");
            }
        }

        ws.Columns().AdjustToContents(1, 80);
        ws.SheetView.FreezeRows(1);

        using var stream = new MemoryStream();
        workbook.SaveAs(stream);
        stream.Position = 0;

        var fileName = $"CASATIC_Socios_{DateTime.UtcNow:yyyyMMdd_HHmm}.xlsx";
        return File(
            stream.ToArray(),
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            fileName);
    }

    /// <summary>
    /// Importar socios desde Excel (.xlsx).
    /// </summary>
    [HttpPost("importar-socios")]
    [RequestSizeLimit(10 * 1024 * 1024)]
    public async Task<IActionResult> ImportarSocios(IFormFile archivo)
    {
        if (archivo == null || archivo.Length == 0)
            return BadRequest(new { message = "Debe enviar un archivo Excel." });

        var ext = Path.GetExtension(archivo.FileName).ToLowerInvariant();
        if (ext != ".xlsx")
            return BadRequest(new { message = "Solo se aceptan archivos .xlsx" });

        if (archivo.Length > 10 * 1024 * 1024)
            return BadRequest(new { message = "El archivo no puede superar 10 MB." });

        var creados = 0;
        var actualizados = 0;
        var errores = new List<string>();

        using var stream = new MemoryStream();
        await archivo.CopyToAsync(stream);
        stream.Position = 0;

        using var workbook = new XLWorkbook(stream);
        var ws = workbook.Worksheets.First();

        var headerRow = ws.Row(1);
        var colMap = new Dictionary<string, int>(StringComparer.OrdinalIgnoreCase);
        var lastCol = ws.LastColumnUsed()?.ColumnNumber() ?? 0;
        for (var c = 1; c <= lastCol; c++)
        {
            var val = headerRow.Cell(c).GetString().Trim();
            if (!string.IsNullOrEmpty(val))
                colMap[val] = c;
        }

        int Col(params string[] names)
        {
            foreach (var n in names)
                if (colMap.TryGetValue(n, out var c)) return c;
            return -1;
        }

        var colNombre      = Col("NombreEmpresa", "Nombre Empresa", "Nombre");
        var colEmail       = Col("EmailContacto", "Email Contacto", "Email", "Correo");
        var colTelefono    = Col("Telefono", "Teléfono");
        var colDireccion   = Col("Direccion", "Dirección");
        var colDescripcion = Col("Descripcion", "Descripción");
        var colEsp         = Col("Especialidades");
        var colServ        = Col("Servicios");
        var colMarcas      = Col("MarcasRepresenta", "Marcas Representa", "Marcas");
        var colEstado      = Col("EstadoFinanciero", "Estado Financiero", "Estado");
        var colHabilitado  = Col("Habilitado");
        var colMapa        = Col("MapaUrl", "Mapa URL", "Mapa");

        if (colNombre < 0)
            return BadRequest(new { message = "El archivo debe tener una columna 'NombreEmpresa' o 'Nombre Empresa'." });

        var lastRow = ws.LastRowUsed()?.RowNumber() ?? 1;

        for (var r = 2; r <= lastRow; r++)
        {
            try
            {
                var nombre = ws.Cell(r, colNombre).GetString().Trim();
                if (string.IsNullOrEmpty(nombre)) continue;

                string CellStr(int col) => col > 0 ? ws.Cell(r, col).GetString().Trim() : "";

                var slug = nombre.ToLowerInvariant()
                    .Replace(" ", "-")
                    .Replace("á", "a").Replace("é", "e").Replace("í", "i")
                    .Replace("ó", "o").Replace("ú", "u").Replace("ñ", "n");

                var existente = await _db.Socios
                    .FirstOrDefaultAsync(s => s.NombreEmpresa == nombre || s.Slug == slug);

                if (existente != null)
                {
                    if (colEmail > 0) existente.EmailContacto = CellStr(colEmail);
                    if (colTelefono > 0) existente.Telefono = CellStr(colTelefono);
                    if (colDireccion > 0) existente.Direccion = CellStr(colDireccion);
                    if (colDescripcion > 0) existente.Descripcion = CellStr(colDescripcion);
                    if (colEsp > 0) existente.Especialidades = CellStr(colEsp).Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries).ToList();
                    if (colServ > 0) existente.Servicios = CellStr(colServ).Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries).ToList();
                    if (colMarcas > 0) existente.MarcasRepresenta = CellStr(colMarcas);
                    if (colMapa > 0) existente.MapaUrl = CellStr(colMapa);
                    if (colEstado > 0)
                    {
                        var estadoStr = CellStr(colEstado);
                        if (Enum.TryParse<EstadoFinanciero>(estadoStr, true, out var ef))
                            existente.EstadoFinanciero = ef;
                    }
                    if (colHabilitado > 0)
                    {
                        var hab = CellStr(colHabilitado).ToLowerInvariant();
                        existente.Habilitado = hab is "sí" or "si" or "true" or "1" or "yes";
                    }
                    existente.UpdatedAt = DateTime.UtcNow;
                    actualizados++;
                }
                else
                {
                    var nuevo = new Domain.Entities.Socio
                    {
                        Id = Guid.NewGuid(),
                        NombreEmpresa = nombre,
                        Slug = slug,
                        EmailContacto = CellStr(colEmail),
                        Telefono = CellStr(colTelefono),
                        Direccion = CellStr(colDireccion),
                        Descripcion = CellStr(colDescripcion),
                        Especialidades = CellStr(colEsp).Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries).ToList(),
                        Servicios = CellStr(colServ).Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries).ToList(),
                        MarcasRepresenta = CellStr(colMarcas),
                        MapaUrl = CellStr(colMapa),
                        Habilitado = true,
                        CreatedAt = DateTime.UtcNow,
                        UpdatedAt = DateTime.UtcNow
                    };

                    if (colEstado > 0 && Enum.TryParse<EstadoFinanciero>(CellStr(colEstado), true, out var ef2))
                        nuevo.EstadoFinanciero = ef2;
                    if (colHabilitado > 0)
                    {
                        var hab = CellStr(colHabilitado).ToLowerInvariant();
                        nuevo.Habilitado = hab is "sí" or "si" or "true" or "1" or "yes";
                    }

                    _db.Socios.Add(nuevo);
                    creados++;
                }
            }
            catch (Exception ex)
            {
                errores.Add($"Fila {r}: {ex.Message}");
            }
        }

        await _db.SaveChangesAsync();

        return Ok(new
        {
            message = $"Importación completada: {creados} creados, {actualizados} actualizados.",
            creados,
            actualizados,
            errores
        });
    }

    private static DateTime EnsureUtc(DateTime value) =>
        value.Kind switch
        {
            DateTimeKind.Utc => value,
            DateTimeKind.Local => value.ToUniversalTime(),
            _ => DateTime.SpecifyKind(value, DateTimeKind.Utc)
        };
}
