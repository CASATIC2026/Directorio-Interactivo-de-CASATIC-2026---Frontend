using CasaticDirectorio.Domain.Entities;
using CasaticDirectorio.Domain.Interfaces;
using CasaticDirectorio.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace CasaticDirectorio.Infrastructure.Repositories;

public class UsuarioRepository : IUsuarioRepository
{
    private readonly AppDbContext _db;
    public UsuarioRepository(AppDbContext db) => _db = db;

    public async Task<Usuario?> GetByIdAsync(Guid id) =>
        await _db.Usuarios.Include(u => u.Socio).FirstOrDefaultAsync(u => u.Id == id);

    public async Task<Usuario?> GetByEmailAsync(string email) =>
        await _db.Usuarios.Include(u => u.Socio)
            .FirstOrDefaultAsync(u => u.Email.ToLower() == email.ToLower());

    public async Task<List<Usuario>> GetAllAsync() =>
        await _db.Usuarios.Include(u => u.Socio).OrderBy(u => u.Email).ToListAsync();

    public async Task AddAsync(Usuario usuario)
    {
        _db.Usuarios.Add(usuario);
        await _db.SaveChangesAsync();
    }

    public async Task UpdateAsync(Usuario usuario)
    {
        _db.Usuarios.Update(usuario);
        await _db.SaveChangesAsync();
    }

    public async Task DeleteAsync(Guid id)
    {
        var usuario = await _db.Usuarios.FindAsync(id);
        if (usuario != null)
        {
            _db.Usuarios.Remove(usuario);
            await _db.SaveChangesAsync();
        }
    }
}
