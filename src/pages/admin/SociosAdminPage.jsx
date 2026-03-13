import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/client';
import {
  Building2, Plus, Edit, Trash2, ToggleLeft, ToggleRight,
  AlertTriangle, Search, RefreshCw
} from 'lucide-react';

function TableSkeleton() {
  return (
    <div className="card-base p-6">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex gap-4 mb-4">
          <div className="h-12 skeleton flex-1" />
          <div className="h-12 skeleton w-32" />
          <div className="h-12 skeleton w-20" />
        </div>
      ))}
    </div>
  );
}

export default function SociosAdminPage() {
  const [socios, setSocios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const loadSocios = () => {
    setLoading(true);
    api.get('/socios')
      .then((res) => setSocios(res.data))
      .finally(() => setLoading(false));
  };

  useEffect(loadSocios, []);

  const toggleHabilitado = async (id) => {
    await api.patch(`/socios/${id}/toggle-habilitado`);
    loadSocios();
  };

  const cambiarEstado = async (id, estado) => {
    await api.patch(`/socios/${id}/estado-financiero?estado=${estado}`);
    loadSocios();
  };

  const eliminar = async (id) => {
    if (!confirm('¿Está seguro de eliminar este socio?')) return;
    await api.delete(`/socios/${id}`);
    loadSocios();
  };

  const filtered = socios.filter((s) =>
    s.nombreEmpresa.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* ── Header ────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 bg-casatic-100 rounded-2xl flex items-center justify-center">
            <Building2 size={22} className="text-casatic-600" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-surface-900">Gestión de Socios</h1>
            <p className="text-sm text-surface-500">{socios.length} empresas registradas</p>
          </div>
        </div>
        <Link to="/admin/socios/nuevo" className="btn-primary self-start sm:self-auto">
          <Plus size={18} /> Nuevo Socio
        </Link>
      </div>

      {/* ── Search Bar ────────────────────────────────── */}
      <div className="card-base p-3 flex flex-wrap items-center gap-3">
        <div className="flex-1 min-w-[200px] relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400" />
          <input
            type="text"
            placeholder="Buscar por nombre de empresa…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field pl-9 text-sm"
          />
        </div>
        <span className="text-xs text-surface-400 font-medium px-2">
          {filtered.length} resultados
        </span>
      </div>

      {/* ── Table ─────────────────────────────────────── */}
      {loading ? (
        <TableSkeleton />
      ) : filtered.length === 0 ? (
        <div className="card-base py-16 text-center">
          <Building2 size={40} className="mx-auto mb-3 text-surface-300" />
          <h3 className="text-lg font-bold text-surface-700">Sin coincidencias</h3>
          <p className="text-sm text-surface-400 mt-1">Intenta con otro término de búsqueda</p>
        </div>
      ) : (
        <div className="table-container">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-surface-50 border-b border-surface-100">
                  <th className="table-th">Empresa</th>
                  <th className="table-th text-center">Slug</th>
                  <th className="table-th text-center">Situación</th>
                  <th className="table-th text-center">Estado</th>
                  <th className="table-th text-center">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((socio) => (
                  <tr key={socio.id} className="table-row">
                    <td className="table-td">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white border border-surface-200 rounded-xl flex items-center justify-center overflow-hidden flex-shrink-0">
                          {socio.logoUrl ? (
                            <img
                              src={socio.logoUrl}
                              alt={socio.nombreEmpresa}
                              className="w-full h-full object-contain p-1"
                              onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.nextSibling.style.display = 'flex';
                              }}
                            />
                          ) : null}
                          <div
                            className={socio.logoUrl ? 'hidden' : 'flex'}
                            style={{
                              display: socio.logoUrl ? 'none' : 'flex',
                              alignItems: 'center', justifyContent: 'center',
                              width: '100%', height: '100%',
                              fontWeight: 'bold', fontSize: '1rem',
                            }}
                          >
                            <span className="text-casatic-500 font-bold">
                              {socio.nombreEmpresa?.charAt(0)?.toUpperCase()}
                            </span>
                          </div>
                        </div>
                        <span className="font-medium text-surface-800">{socio.nombreEmpresa}</span>
                      </div>
                    </td>

                    <td className="table-td text-center">
                      <span className="font-mono text-xs text-surface-400 bg-surface-50 px-2.5 py-1 rounded-lg border border-surface-100">
                        /{socio.slug}
                      </span>
                    </td>

                    <td className="table-td text-center">
                      {socio.estadoFinanciero === 'AlDia' ? (
                        <span className="badge-success">Al Día</span>
                      ) : (
                        <span className="badge-warning inline-flex items-center gap-1">
                          <AlertTriangle size={10} /> En Mora
                        </span>
                      )}
                    </td>

                    <td className="table-td text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button onClick={() => toggleHabilitado(socio.id)} className="transition-transform active:scale-90">
                          {socio.habilitado ? (
                            <ToggleRight size={28} className="text-casatic-500" />
                          ) : (
                            <ToggleLeft size={28} className="text-surface-300" />
                          )}
                        </button>
                        <button
                          onClick={() => cambiarEstado(socio.id, socio.estadoFinanciero === 'AlDia' ? 'EnMora' : 'AlDia')}
                          className="btn-icon btn-ghost"
                          title="Cambiar estado financiero"
                        >
                          <RefreshCw size={14} />
                        </button>
                      </div>
                    </td>

                    <td className="table-td text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <Link to={`/admin/socios/${socio.id}`} className="btn-icon btn-ghost text-casatic-600 hover:bg-casatic-50">
                          <Edit size={16} />
                        </Link>
                        <button onClick={() => eliminar(socio.id)} className="btn-icon btn-ghost text-red-500 hover:bg-red-50">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
