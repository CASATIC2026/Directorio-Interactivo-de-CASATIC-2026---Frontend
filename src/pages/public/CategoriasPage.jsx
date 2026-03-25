import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/client';
import {
  Grid3X3, ArrowRight, Search, Loader2,
  Monitor, Globe, Shield, Database, Cloud, Code2,
  Cpu, Wifi, Smartphone, Settings, BarChart2, Lock,
} from 'lucide-react';

// Íconos sugeridos por palabra clave en el nombre de la especialidad
const ICON_MAP = [
  { keywords: ['segur', 'ciber', 'prot'], icon: Shield },
  { keywords: ['cloud', 'nube'], icon: Cloud },
  { keywords: ['datos', 'data', 'base'], icon: Database },
  { keywords: ['web', 'portal', 'internet'], icon: Globe },
  { keywords: ['móvil', 'movil', 'app', 'android', 'ios'], icon: Smartphone },
  { keywords: ['software', 'desarrollo', 'program'], icon: Code2 },
  { keywords: ['hardware', 'infra', 'servidor'], icon: Cpu },
  { keywords: ['red', 'network', 'comunic', 'wifi'], icon: Wifi },
  { keywords: ['analít', 'analítica', 'bi', 'inteli', 'report'], icon: BarChart2 },
  { keywords: ['consult', 'asesor'], icon: Settings },
  { keywords: ['acceso', 'identidad', 'autent'], icon: Lock },
  { keywords: ['digit', 'transform'], icon: Monitor },
];

const GRADIENT_CLASSES = [
  'from-casatic-500 to-casatic-700',
  'from-emerald-500 to-emerald-700',
  'from-violet-500 to-violet-700',
  'from-amber-500 to-amber-700',
  'from-rose-500 to-rose-700',
  'from-sky-500 to-sky-700',
  'from-teal-500 to-teal-700',
  'from-orange-500 to-orange-700',
];

function pickIcon(name) {
  const lower = name.toLowerCase();
  for (const { keywords, icon } of ICON_MAP) {
    if (keywords.some((k) => lower.includes(k))) return icon;
  }
  return Monitor;
}

function CategoryCard({ name, index, count }) {
  const Icon = pickIcon(name);
  const gradient = GRADIENT_CLASSES[index % GRADIENT_CLASSES.length];

  return (
    <Link
      to={`/directorio?especialidad=${encodeURIComponent(name)}`}
      className="group card-interactive text-left p-0 overflow-hidden"
    >
      {/* Color bar */}
      <div className={`h-1.5 bg-gradient-to-r ${gradient} transition-all duration-300 group-hover:h-2`} />
      <div className="p-5">
        <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center mb-4 shadow-sm`}>
          <Icon size={20} className="text-white" />
        </div>
        <h3 className="font-semibold text-surface-900 group-hover:text-casatic-600 transition-colors leading-snug mb-1">
          {name}
        </h3>
        {count !== undefined && (
          <p className="text-xs text-surface-400">
            {count} empresa{count !== 1 ? 's' : ''}
          </p>
        )}
        <div className="flex items-center gap-1 mt-3 text-casatic-500 text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity -translate-x-1 group-hover:translate-x-0 duration-200">
          <span>Ver empresas</span>
          <ArrowRight size={12} />
        </div>
      </div>
    </Link>
  );
}

function CardSkeleton() {
  return (
    <div className="card-base p-5">
      <div className="h-1.5 skeleton rounded mb-5" />
      <div className="w-11 h-11 skeleton rounded-xl mb-4" />
      <div className="h-4 skeleton w-3/4 mb-1" />
      <div className="h-3 skeleton w-1/4" />
    </div>
  );
}

export default function CategoriasPage() {
  const [especialidades, setEspecialidades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');

  useEffect(() => {
    api
      .get('/directorio/especialidades')
      .then((res) => setEspecialidades(res.data ?? []))
      .catch(() => setEspecialidades([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = query.trim().length > 0
    ? especialidades.filter((e) => e.toLowerCase().includes(query.toLowerCase()))
    : especialidades;

  return (
    <div className="bg-mesh min-h-screen pb-16">
      {/* ── Banner ──────────────────────────────────────── */}
      <div className="bg-gradient-to-br from-casatic-700 via-casatic-800 to-surface-900 text-white py-14 sm:py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-10 pointer-events-none" />
        <div className="absolute top-0 right-0 w-80 h-80 bg-casatic-500/20 rounded-full blur-3xl" />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-white/10 rounded-2xl mb-4">
            <Grid3X3 size={28} className="text-casatic-200" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-3">
            Categorías del Sector TIC
          </h1>
          <p className="text-casatic-200 text-base sm:text-lg max-w-xl mx-auto">
            Seleccione una categoría para explorar las empresas socias correspondientes.
          </p>
        </div>
      </div>
<br/>
<br/>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-10">
        {/* ── Buscador ────────────────────────────────── */}
        <div className="card-base p-4 mb-8 flex items-center gap-3">
          <Search size={18} className="text-surface-400 flex-shrink-0" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Filtrar categorías…"
            className="flex-1 text-sm bg-transparent border-none outline-none text-surface-900 placeholder-surface-400"
          />
        </div>

        {/* ── Grid ─────────────────────────────────── */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {Array.from({ length: 10 }).map((_, i) => <CardSkeleton key={i} />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-surface-500 text-sm">
            {query ? (
              <>No se encontraron categorías para "<strong>{query}</strong>".</>
            ) : (
              <>No hay categorías disponibles.</>
            )}
          </div>
        ) : (
          <>
            <p className="text-xs text-surface-400 mb-4 px-1">
              {filtered.length} categoría{filtered.length !== 1 ? 's' : ''}
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 stagger-children">
              {filtered.map((esp, i) => (
                <CategoryCard key={esp} name={esp} index={i} />
              ))}
            </div>
          </>
        )}

        {/* ── CTA ─────────────────────────────────────── */}
        {!loading && (
          <div className="mt-12 card-base p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-5 bg-gradient-to-br from-casatic-600 to-casatic-800 text-white">
            <div className="flex-1 text-center sm:text-left">
              <p className="font-bold text-base mb-1">¿Su empresa no aparece?</p>
              <p className="text-casatic-200 text-sm">
                Afíliese a CASATIC y forme parte del directorio más completo de tecnología de El Salvador.
              </p>
            </div>
            <Link to="/contacto" className="btn-primary bg-white text-casatic-700 hover:bg-casatic-50 flex-shrink-0 whitespace-nowrap">
              Contáctenos
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
