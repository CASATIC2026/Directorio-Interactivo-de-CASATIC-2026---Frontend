import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/client';
import { useDebounce } from '../../hooks/useDebounce';
import {
  Search, SlidersHorizontal, Building2, ChevronLeft, ChevronRight,
  ArrowRight, MapPin, X, Users, BarChart3, ShieldCheck, ChevronDown
} from 'lucide-react';
import casaticLogo from '../../img/Reverse - v3@4x.png';

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
  const [servicio, setServicio] = useState('');
  const [especialidades, setEspecialidades] = useState([]);
  const [loading, setLoading] = useState(true);
  const pageSize = 12;

  // 🆕 NUEVOS ESTADOS PARA FILTROS ADICIONALES
  const [ciudad, setCiudad] = useState('');
  const [ordenarPor, setOrdenarPor] = useState('nombre'); // 'nombre' | 'recientes' | 'a-z' | 'z-a'
  const [soloConLogo, setSoloConLogo] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const debouncedQuery = useDebounce(query);
  const debouncedServicio = useDebounce(servicio);
  const debouncedCiudad = useDebounce(ciudad);

  // Cargar especialidades al inicio
  useEffect(() => {
    api.get('/directorio/especialidades')
      .then((res) => setEspecialidades(res.data))
      .catch(() => {});
  }, []);

  // Cargar socios cuando cambian los filtros
  useEffect(() => {
    setLoading(true);
    const params = { page, pageSize };
    if (debouncedQuery) params.query = debouncedQuery;
    if (especialidad) params.especialidad = especialidad;
    if (debouncedServicio) params.servicio = debouncedServicio;
    if (debouncedCiudad) params.ciudad = debouncedCiudad;
    if (ordenarPor && ordenarPor !== 'nombre') params.orden = ordenarPor;
    if (soloConLogo) params.conLogo = true;

    api.get('/directorio', { params })
      .then((res) => { 
        setSocios(res.data.items); 
        setTotal(res.data.total); 
        setTotalPages(res.data.totalPages); 
      })
      .catch(() => setSocios([]))
      .finally(() => setLoading(false));
  }, [page, debouncedQuery, especialidad, debouncedServicio, debouncedCiudad, ordenarPor, soloConLogo]);

  const clearFilters = () => {
    setQuery('');
    setEspecialidad('');
    setServicio('');
    setCiudad('');
    setOrdenarPor('nombre');
    setSoloConLogo(false);
    setPage(1);
  };

  const hasFilters = query || especialidad || servicio || ciudad || soloConLogo || ordenarPor !== 'nombre';

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
  };


  return (
    <div className="bg-white overflow-x-hidden min-h-screen">

      {/* ── Hero Header ──────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-casatic-700 via-casatic-800 to-surface-900 py-16 sm:py-1">
        {/* Decorative blobs */}
        <div className="absolute inset-0 bg-grid opacity-10 pointer-events-none" />
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-casatic-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-accent-500/10 rounded-full blur-3xl pointer-events-none" />

       
                 <div className=" text-center ">
                         <img src={casaticLogo} alt="CASATIC" className="h-20 w-auto object-contain mb-1 mx-1 " />
                         <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-casatic-300 bg-white/10 px-3 py-1.5 rounded-full mb-5 animate-fade-in-up">
                           <span className="w-1.5 h-1.5 rounded-full bg-accent-400 animate-pulse-soft" />
                           Directorio Interactivo CASATIC
                         </span>
                 <h1 className=" text-4xl sm:text-6xl md:text-7xl font-extrabold text-white tracking-tight mb-4 animate-fade-in-up">
                   Directorio de{' '}
                   <span className="text-gradient-accent">Socios</span>
                 </h1>
                 <p className="text-base sm:text-lg text-casatic-200 leading-relaxed max-w-2xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                  Encuentra empresas de tecnología por especialidad, servicios o nombre.
                 </p><br>
                  
                 </br>
               </div>
             </section>
       

      {/* ── Stats Banner ─────────────────────────────────── */}
      <section className="bg-casatic-600 py-6 sm:py-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 sm:gap-10 text-center">
            <div>
              <p className="text-2xl sm:text-3xl font-extrabold text-white">
                <Users size={22} className="inline-block mr-2 -mt-1" />
                {total}+
              </p>
              <p className="text-casatic-200 text-sm mt-0.5">Socios registrados</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-extrabold text-white">
                <BarChart3 size={22} className="inline-block mr-2 -mt-1" />
                {especialidades.length}+
              </p>
              <p className="text-casatic-200 text-sm mt-0.5">Especialidades</p>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <p className="text-2xl sm:text-3xl font-extrabold text-white">
                <ShieldCheck size={22} className="inline-block mr-2 -mt-1" />
                100%
              </p>
              <p className="text-casatic-200 text-sm mt-0.5">Verificado</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Content ──────────────────────────────────────── */}
      <div className="bg-mesh">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pb-16">

          {/* ── Search Bar ───────────────────────────────── */}
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

             {/* ── filtros de TODAS LAS ESPECIALIDADES OPCIONES ──────────────────────────────── / */}

            <div className="relative min-w-[200px]">
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
             <div className="relative min-w-[180px]">
              <input
                type="text"
                placeholder="Filtrar por servicio…"
                value={servicio}
                onChange={(e) => { setServicio(e.target.value); setPage(1); }}
                className="input-field"
              />
            </div>
            {/* 🆕 Filtro por ciudad */}
            <div className="relative min-w-[150px]">
              <input
                type="text"
                placeholder="Ciudad…"
                value={ciudad}
                onChange={(e) => { setCiudad(e.target.value); setPage(1); }}
                className="input-field"
              />
            </div>
            {/* 🆕 Filtro ordenar por */}
            <div className="relative min-w-[140px]">
              <select
                value={ordenarPor}
                onChange={(e) => { setOrdenarPor(e.target.value); setPage(1); }}
                className="input-field appearance-none cursor-pointer"
              >
                <option value="nombre">Ordenar por</option>
                <option value="a-z">A - Z</option>
                <option value="z-a">Z - A</option>
                <option value="recientes">Más recientes</option>
              </select>
            </div>
            {/* 🆕 Solo con logo */}
            <label className="flex items-center gap-2 cursor-pointer whitespace-nowrap">
              <input
                type="checkbox"
                checked={soloConLogo}
                onChange={(e) => { setSoloConLogo(e.target.checked); setPage(1); }}
                className="w-4 h-4 rounded border-surface-300 text-casatic-600 focus:ring-casatic-500"
              />
              <span className="text-sm text-surface-600">Solo con logo</span>
            </label>
            {/* limpieza y borrar los filtros   */}
            {hasFilters && (
              <button type="button" onClick={clearFilters} className="btn-ghost btn-sm text-surface-500">
                <X size={16} /> Limpiar
              </button>
            )}
          </form>

          {/* ── Results Info ──────────────────────────────── */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm text-surface-500">
              {loading ? (
                <span className="inline-block h-4 w-32 skeleton rounded" />
              ) : (
                <>{total} socio{total !== 1 ? 's' : ''} encontrado{total !== 1 ? 's' : ''}</>
              )}
            </p>
            {hasFilters && !loading && (
              <div className="flex flex-wrap items-center gap-2">
                {query && <span className="badge-primary">&ldquo;{query}&rdquo;</span>}
                {especialidad && <span className="badge-primary">{especialidad}</span>}
                {servicio && <span className="badge-primary">Servicio: {servicio}</span>}                {ciudad && <span className="badge-primary">Ciudad: {ciudad}</span>}
                {ordenarPor !== 'nombre' && <span className="badge-primary">Orden: {ordenarPor}</span>}
                {soloConLogo && <span className="badge-primary">Con logo</span>}              </div>
            )}
          </div>

          {/* ── Cards Grid ───────────────────────────────── */}
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

          {/* ── Pagination ───────────────────────────────── */}
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

      {/* ── CTA Section ──────────────────────────────────── */}
      <section className="py-16 sm:py-20 bg-white border-t border-surface-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-casatic-600 to-casatic-800 rounded-3xl p-8 sm:p-12 lg:p-16 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-grid opacity-10 pointer-events-none" />
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />
            <div className="relative">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4 tracking-tight">
                ¿Eres socio de CASATIC?
              </h2>
              <p className="text-casatic-200 text-base sm:text-lg mb-8 max-w-xl mx-auto">
                Accede a tu panel para gestionar la información de tu empresa y mantener tu perfil actualizado.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  to="/login"
                  className="btn btn-lg bg-white text-casatic-700 hover:bg-casatic-50 font-bold shadow-xl"
                >
                  Acceso Socios <ArrowRight size={18} />
                </Link>
                <Link
                  to="/"
                  className="btn btn-lg bg-white/10 text-white border border-white/30 hover:bg-white/20"
                >
                  Volver al Inicio
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
