using CasaticDirectorio.Domain.Entities;
using CasaticDirectorio.Domain.Interfaces;
using CasaticDirectorio.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace CasaticDirectorio.Infrastructure.Repositories;

public class FormularioContactoRepository : IFormularioContactoRepository
{
    private readonly AppDbContext _db;
    public FormularioContactoRepository(AppDbContext db) => _db = db;

    public async Task AddAsync(FormularioContacto formulario)
    {
        _db.FormulariosContacto.Add(formulario);
        await _db.SaveChangesAsync();
    }

    public async Task<List<FormularioContacto>> GetBySocioAsync(Guid socioId) =>
        await _db.FormulariosContacto
            .Where(f => f.SocioId == socioId)
            .OrderByDescending(f => f.Fecha)
            .ToListAsync();

    public async Task<int> CountAsync(DateTime desde, DateTime hasta) =>
        await _db.FormulariosContacto
            .CountAsync(f => f.Fecha >= desde && f.Fecha <= hasta);

    public async Task<List<FormularioContacto>> GetAllAsync(DateTime desde, DateTime hasta) =>
        await _db.FormulariosContacto
            .Include(f => f.Socio)
            .Where(f => f.Fecha >= desde && f.Fecha <= hasta)
            .OrderByDescending(f => f.Fecha)
            .ToListAsync();

    public async Task MarcarLeidoAsync(Guid id, bool leido)
    {
        var formulario = await _db.FormulariosContacto.FindAsync(id);
        if (formulario != null)
        {
            formulario.Leido = leido;
            await _db.SaveChangesAsync();
        }
    }
}
