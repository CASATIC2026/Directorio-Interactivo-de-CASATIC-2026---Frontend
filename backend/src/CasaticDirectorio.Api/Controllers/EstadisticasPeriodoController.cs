using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Linq;
using System.Threading.Tasks;
using CasaticDirectorio.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace CasaticDirectorio.Api.Controllers
{
    [ApiController]
    [Route("api/estadisticas/periodo")]
    [Authorize(Roles = "Admin")]
    public class EstadisticasPeriodoController : ControllerBase
    {
        private readonly AppDbContext _context;

        public EstadisticasPeriodoController(AppDbContext context)
        {
            _context = context;
        }

        // Devuelve empresas nuevas por mes del último año
        [HttpGet("empresas-nuevas-mes")]
        public async Task<IActionResult> GetEmpresasNuevasPorMes()
        {
            var desde = DateTime.UtcNow.AddMonths(-11);
            var datos = await _context.Socios
                .Where(s => s.CreatedAt >= desde)
                .GroupBy(s => new { s.CreatedAt.Year, s.CreatedAt.Month })
                .Select(g => new {
                    Periodo = $"{g.Key.Year}-{g.Key.Month:D2}",
                    Total = g.Count()
                })
                .OrderBy(x => x.Periodo)
                .ToListAsync();

            return Ok(datos);
        }
    }
}
