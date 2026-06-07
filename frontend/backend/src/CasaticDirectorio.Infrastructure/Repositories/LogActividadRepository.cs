using CasaticDirectorio.Domain.Entities;
using CasaticDirectorio.Domain.Enums;
using CasaticDirectorio.Domain.Interfaces;
using CasaticDirectorio.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace CasaticDirectorio.Infrastructure.Repositories;

public class LogActividadRepository : ILogActividadRepository
{
    private readonly AppDbContext _db;
    public LogActividadRepository(AppDbContext db) => _db = db;

    public async Task AddAsync(LogActividad log)
    {
        _db.LogsActividad.Add(log);
        await _db.SaveChangesAsync();
    }

    public async Task<List<LogActividad>> GetByTipoAsync(
        TipoEventoLogActividad tipo, DateTime desde, DateTime hasta) =>
        await _db.LogsActividad
            .Where(l => l.TipoEvento == tipo && l.Fecha >= desde && l.Fecha <= hasta)
            .OrderByDescending(l => l.Fecha)
            .ToListAsync();

    public async Task<int> CountByTipoAsync(
        TipoEventoLogActividad tipo, DateTime desde, DateTime hasta) =>
        await _db.LogsActividad
            .CountAsync(l => l.TipoEvento == tipo && l.Fecha >= desde && l.Fecha <= hasta);

    public async Task<List<LogActividad>> GetBySocioAsync(
        Guid socioId, DateTime desde, DateTime hasta) =>
        await _db.LogsActividad
            .Where(l => l.SocioId == socioId && l.Fecha >= desde && l.Fecha <= hasta)
            .OrderByDescending(l => l.Fecha)
            .ToListAsync();

    public async Task<Dictionary<string, int>> GetLoginsPorUsuarioAsync(
        DateTime desde, DateTime hasta)
    {
        var logins = await _db.LogsActividad
            .Where(l => l.TipoEvento == TipoEventoLogActividad.Login && l.Fecha >= desde && l.Fecha <= hasta)
            .GroupBy(l => l.UsuarioId)
            .Select(g => new { UsuarioId = g.Key, Count = g.Count() })
            .ToListAsync();

        // Obtener emails
        var userIds = logins.Where(l => l.UsuarioId.HasValue).Select(l => l.UsuarioId!.Value).ToList();
        var users = await _db.Usuarios
            .Where(u => userIds.Contains(u.Id))
            .ToDictionaryAsync(u => u.Id, u => u.Email);

        return logins
            .GroupBy(l => l.UsuarioId.HasValue && users.ContainsKey(l.UsuarioId.Value)
                ? users[l.UsuarioId.Value]
                : "Anónimo")
            .ToDictionary(g => g.Key, g => g.Sum(x => x.Count));
    }

    public async Task<List<LogActividad>> GetAccesosByUsuarioAsync(Guid usuarioId, int top) =>
        await _db.LogsActividad
            .Where(l => l.UsuarioId == usuarioId && l.TipoEvento == TipoEventoLogActividad.Login)
            .OrderByDescending(l => l.Fecha)
            .Take(top)
            .ToListAsync();

    public async Task<List<LogActividad>> GetTodosAccesosAsync(DateTime desde, DateTime hasta, int skip, int take) =>
        await _db.LogsActividad
            .Where(l => (l.TipoEvento == TipoEventoLogActividad.Login ||
                         l.TipoEvento == TipoEventoLogActividad.LoginFallido) &&
                         l.Fecha >= desde && l.Fecha <= hasta)
            .OrderByDescending(l => l.Fecha)
            .Skip(skip)
            .Take(take)
            .ToListAsync();

    public async Task<int> CountTodosAccesosAsync(DateTime desde, DateTime hasta) =>
        await _db.LogsActividad
            .CountAsync(l => (l.TipoEvento == TipoEventoLogActividad.Login ||
                              l.TipoEvento == TipoEventoLogActividad.LoginFallido) &&
                              l.Fecha >= desde && l.Fecha <= hasta);
}
