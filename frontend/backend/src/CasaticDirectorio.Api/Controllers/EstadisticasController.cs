using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using CasaticDirectorio.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace CasaticDirectorio.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Admin")]
    public class EstadisticasController : ControllerBase
    {
        private readonly AppDbContext _context;

        public EstadisticasController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetEstadisticas()
        {
            var totalEmpresas = await _context.Socios.CountAsync();
            var totalUsuarios = await _context.Usuarios.CountAsync();
            var empresasNuevas = await _context.Socios.CountAsync(s => s.CreatedAt >= DateTime.UtcNow.AddMonths(-1));
            var formulariosRecibidos = await _context.FormulariosContacto.CountAsync();
            // Puedes agregar más métricas aquí

            return Ok(new
            {
                totalEmpresas,
                totalUsuarios,
                empresasNuevas,
                formulariosRecibidos
            });
        }
    }
}
