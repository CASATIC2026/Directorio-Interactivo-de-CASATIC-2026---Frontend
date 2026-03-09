import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/client';
import {
  Building2, Plus, Edit, Trash2, ToggleLeft, ToggleRight,
  AlertTriangle, Search, Filter, RefreshCw
} from 'lucide-react';

function TableSkeleton() {
  return (
    <div className="bg-white rounded-3xl p-6 animate-pulse shadow-sm">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex gap-4 mb-4">
          <div className="h-12 bg-gray-100 rounded-xl flex-1" />
          <div className="h-12 bg-gray-100 rounded-xl w-32" />
          <div className="h-12 bg-gray-100 rounded-xl w-20" />
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
    <div className="min-h-screen bg-[#0E3877] p-4 sm:p-8 font-['Roboto'] font-normal text-white">
      <style>
        {`@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap');`}
      </style>

      {/* ── Header ────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3 tracking-tight text-white">
            <Building2 size={32} className="text-[#0C9EC6]" />
            Gestión de Socios
          </h1>
          <p className="text-white/60 text-sm mt-1 font-normal">{socios.length} empresas registradas</p>
        </div>
        <Link 
          to="/admin/socios/nuevo" 
          className="flex items-center gap-2 px-6 py-3 bg-[#0C9EC6] hover:bg-white hover:text-[#0E3877] text-white rounded-xl font-bold transition-all duration-300 shadow-lg active:scale-95"
        >
          <Plus size={20} /> Nuevo Socio
        </Link>
      </div>

      {/* ── Search Bar ────────────────────────────────── */}
      <div className="bg-white rounded-2xl p-2 mb-6 flex items-center gap-3 shadow-xl border border-white/10">
        <div className="flex items-center flex-1 px-4">
          <Search size={20} className="text-[#0C9EC6]" />
          <input
            type="text"
            placeholder="Buscar por nombre de empresa..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full p-3 bg-transparent text-[#0A0A0A] placeholder-gray-400 outline-none text-base"
          />
        </div>
        <div className="hidden sm:flex items-center gap-2 px-6 border-l border-gray-100 text-gray-400 text-xs font-bold uppercase tracking-widest">
          {filtered.length} Resultados
        </div>
      </div>

      {/* ── Table Container ───────────────────────────── */}
      {loading ? (
        <TableSkeleton />
      ) : filtered.length === 0 ? (
        <div className="bg-white/5 border border-white/10 rounded-3xl py-20 text-center">
          <Building2 size={48} className="mx-auto mb-4 text-white/20" />
          <h3 className="text-xl font-bold">Sin coincidencias</h3>
        </div>
      ) : (
        <div className="bg-white rounded-3xl overflow-hidden shadow-2xl border border-gray-100">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-[#0E3877] uppercase text-[11px] tracking-[0.2em] font-bold border-b border-gray-100">
                  <th className="px-6 py-5">Empresa</th>
                  <th className="px-6 py-5 text-center">Slug</th>
                  <th className="px-6 py-5 text-center">Situación</th>
                  <th className="px-6 py-5 text-center">Estado</th>
                  <th className="px-6 py-5 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((socio) => (
                  <tr key={socio.id} className="hover:bg-blue-50/30 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-white border border-gray-100 rounded-xl flex items-center justify-center overflow-hidden shadow-sm shrink-0">
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
                          <div className={socio.logoUrl ? "hidden" : "flex"} style={{ display: socio.logoUrl ? 'none' : 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%', fontWeight: 'bold', color: '#0C9EC6', fontSize: '1.25rem' }}>
                            {socio.nombreEmpresa?.charAt(0)?.toUpperCase()}
                          </div>
                        </div>
                        <span className="font-normal text-[#0C9EC6] tracking-tight">
                          {socio.nombreEmpresa}
                        </span>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 text-center">
                      <span className="font-mono text-xs text-gray-400 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                        /{socio.slug}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-center">
                      {socio.estadoFinanciero === 'AlDia' ? (
                        <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase bg-emerald-100 text-emerald-700 border border-emerald-200">
                          Al Día
                        </span>
                      ) : (
                        <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase bg-amber-100 text-amber-700 border border-amber-200 inline-flex items-center gap-1">
                          <AlertTriangle size={10} /> En Mora
                        </span>
                      )}
                    </td>

                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => toggleHabilitado(socio.id)}
                          className="transition-transform active:scale-90"
                        >
                          {socio.habilitado ? (
                            <ToggleRight size={32} className="text-[#0C9EC6]" />
                          ) : (
                            <ToggleLeft size={32} className="text-gray-300" />
                          )}
                        </button>
                        <button
                          onClick={() => cambiarEstado(socio.id, socio.estadoFinanciero === 'AlDia' ? 'EnMora' : 'AlDia')}
                          className="p-2 rounded-xl text-[#0C9EC6] hover:bg-[#0C9EC6]/10 transition-all"
                          title="Cambiar estado financiero"
                        >
                          <RefreshCw size={14} />
                        </button>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <Link
                          to={`/admin/socios/${socio.id}`}
                          className="p-2.5 rounded-xl text-[#0E3877] hover:bg-[#0E3877] hover:text-white transition-all border border-gray-100 shadow-sm bg-white"
                        >
                          <Edit size={18} />
                        </Link>
                        <button
                          onClick={() => eliminar(socio.id)}
                          className="p-2.5 rounded-xl text-red-400 hover:bg-red-50 hover:text-red-500 transition-all"
                        >
                          <Trash2 size={18} />
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

      {/* ── Footer ────────────────────────────────────── */}
      <p className="mt-10 text-center text-white/30 text-[10px] uppercase tracking-[0.4em] font-bold">
        CASATIC • Panel Administrativo © 2026
      </p>
    </div>
  );
}