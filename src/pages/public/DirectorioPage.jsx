import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/client';
import {
  Search, SlidersHorizontal, Building2, ChevronLeft, ChevronRight,
  ArrowRight, MapPin, X
} from 'lucide-react';

function CardSkeleton() {
  return (
    <div className="card-base p-6">
      <div className="flex items-start gap-4">
        <div className="w-14 h-14 skeleton rounded-xl flex-shrink-0" />
        <div className="flex-1 space-y-3">
          <div className="h-5 skeleton w-3/4" />
          <div className="h-3 skeleton w-full" />
          <div className="h-3 skeleton w-2/3" />
          <div className="flex gap-2 mt-2">
            <div className="h-5 skeleton w-16 rounded-full" />
            <div className="h-5 skeleton w-20 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DirectorioPage() {
  const [socios, setSocios] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [query, setQuery] = useState('');
  const [especialidad, setEspecialidad] = useState('');
  const [especialidades, setEspecialidades] = useState([]);
  const [loading, setLoading] = useState(true);
  const pageSize = 12;

  useEffect(() => {
    api.get('/directorio/especialidades').then((res) => setEspecialidades(res.data)).catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = { page, pageSize };
    if (query) params.query = query;
    if (especialidad) params.especialidad = especialidad;
    api.get('/directorio', { params })
      .then((res) => { setSocios(res.data.items); setTotal(res.data.total); setTotalPages(res.data.totalPages); })
      .catch(() => setSocios([]))
      .finally(() => setLoading(false));
  }, [page, query, especialidad]);

  const handleSearch = (e) => { e.preventDefault(); setPage(1); };
  const clearFilters = () => { setQuery(''); setEspecialidad(''); setPage(1); };
  const hasFilters = query || especialidad;

  return (
    <div className="bg-mesh min-h-screen">
      {/* ── Header ───────────────────────────────────────── */}
      <div className="bg-gradient-to-br from-casatic-700 via-casatic-800 to-surface-900 text-white py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-10" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-casatic-500/15 rounded-full blur-3xl" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3 animate-fade-in-up">
            Directorio de Socios
          </h1>
          <p className="text-casatic-200 text-lg max-w-xl animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            Encuentra empresas de tecnología por especialidad, servicio o nombre
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-10 pb-16">
        {/* ── Search Bar ─────────────────────────────────── */}
        <form
          onSubmit={handleSearch}
          className="bg-white rounded-2xl shadow-elevated p-4 mb-8 flex flex-col md:flex-row gap-3 animate-fade-in-up"
          style={{ animationDelay: '0.15s' }}
        >
          <div className="flex-1 relative">
            <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-surface-400" />
            <input
              type="text"
              placeholder="Buscar por nombre, descripción, tecnología... etc"
              value={query}
              onChange={(e) => { setQuery(e.target.value); setPage(1); }}
              className="input-field pl-10"
            />
          </div>
          <div className="relative min-w-[220px]">
            <SlidersHorizontal size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-surface-400" />
            <select
              value={especialidad}
              onChange={(e) => { setEspecialidad(e.target.value); setPage(1); }}
              className="input-field pl-10 pr-8 appearance-none cursor-pointer"
            >
              <option value="">Todas las especialidades</option>
              {especialidades.map((esp) => (
                <option key={esp} value={esp}>{esp}</option>
              ))}
            </select>
          </div>
          {hasFilters && (
            <button type="button" onClick={clearFilters} className="btn-ghost btn-sm text-surface-500">
              <X size={16} /> Limpiar
            </button>
          )}
        </form>

        {/* ── Results Info ────────────────────────────────── */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-surface-500">
            {loading ? (
              <span className="inline-block h-4 w-32 skeleton rounded" />
            ) : (
              <>{total} socio{total !== 1 ? 's' : ''} encontrado{total !== 1 ? 's' : ''}</>
            )}
          </p>
          {hasFilters && !loading && (
            <div className="flex items-center gap-2">
              {query && <span className="badge-primary">&ldquo;{query}&rdquo;</span>}
              {especialidad && <span className="badge-primary">{especialidad}</span>}
            </div>
          )}
        </div>

        {/* ── Cards Grid ─────────────────────────────────── */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} />)}
          </div>
        ) : socios.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-surface-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Search size={28} className="text-surface-400" />
            </div>
            <h3 className="text-lg font-semibold text-surface-700 mb-2">Sin resultados</h3>
            <p className="text-surface-500 text-sm max-w-sm mx-auto">
              No se encontraron socios con los filtros seleccionados. Intenta con otros términos.
            </p>
            {hasFilters && (
              <button onClick={clearFilters} className="btn-secondary btn-sm mt-4">
                <X size={14} /> Limpiar filtros
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 stagger-children">
            {socios.map((socio) => (
              <Link
                key={socio.id}
                to={`/socio/${socio.slug}`}
                className="group card-interactive p-5"
              >
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-casatic-100 to-casatic-50 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:from-casatic-200 group-hover:to-casatic-100 transition-all duration-300">
                    {socio.logoUrl ? (
                      <img src={socio.logoUrl} alt="" className="w-10 h-10 object-contain rounded-lg" />
                    ) : (
                      <Building2 size={22} className="text-casatic-600" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-surface-900 truncate group-hover:text-casatic-600 transition-colors">
                        {socio.nombreEmpresa}
                      </h3>
                      <ArrowRight size={14} className="text-surface-400 opacity-0 group-hover:opacity-100 transition-all -translate-x-1 group-hover:translate-x-0 flex-shrink-0" />
                    </div>
                    <p className="text-sm text-surface-500 mt-1 line-clamp-2 leading-relaxed">
                      {socio.descripcion}
                    </p>
                    {socio.direccion && (
                      <p className="text-xs text-surface-400 mt-2 flex items-center gap-1">
                        <MapPin size={12} /> {socio.direccion}
                      </p>
                    )}
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {socio.especialidades?.slice(0, 3).map((esp) => (
                        <span key={esp} className="badge-primary text-[10px] px-2 py-0.5">{esp}</span>
                      ))}
                      {socio.especialidades?.length > 3 && (
                        <span className="badge-neutral text-[10px] px-2 py-0.5">+{socio.especialidades.length - 3}</span>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* ── Pagination ─────────────────────────────────── */}
        {totalPages > 1 && !loading && (
          <div className="flex justify-center items-center gap-2 mt-10">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="btn-icon btn-secondary disabled:opacity-30"
            >
              <ChevronLeft size={18} />
            </button>
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              const pageNum = i + 1;
              return (
                <button
                  key={pageNum}
                  onClick={() => setPage(pageNum)}
                  className={`btn-icon text-sm font-medium w-10 h-10 rounded-xl transition-all ${
                    page === pageNum
                      ? 'bg-casatic-600 text-white shadow-lg shadow-casatic-600/25'
                      : 'btn-secondary'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="btn-icon btn-secondary disabled:opacity-30"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
