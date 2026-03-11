import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/client';
import icono1 from '../public/img/busquedainteligente.png'
import icono2 from '../public/img/gestionsegura.png'
import icono3 from '../public/img/visibili.png'
import {
  Search, Building2, Globe, ShieldCheck, ArrowRight, Users, BarChart3
} from 'lucide-react';

const features = [
  {
    icon: Search,
    title: 'Búsqueda Avanzada',
    desc: 'Encuentra socios por especialidad, sector o nombre con filtros potentes.',
    color: 'bg-casatic-50 text-casatic-600',
    img2:icono1,
    link:"/categorias"
  },
  {
    icon: Globe,
    title: 'Información Completa',
    desc: 'Perfiles detallados con sitios web, contactos y descripciones.',
    color: 'bg-accent-50 text-accent-600',
    img2:icono3,
    link:"/directorio"
  },
  {
    icon: ShieldCheck,
    title: 'Datos Verificados',
    desc: 'Información confiable y actualizada de socios registrados.',
    color: 'bg-purple-50 text-purple-600',
    img2:icono2,
  },
];

export default function HomePage() {
  const [total, setTotal] = useState(0);

  useEffect(() => {
    api.get('/directorio?page=1&pageSize=1')
      .then((res) => setTotal(res.data.total))
      .catch(() => {});
  }, []);

  return (
    <div className="bg-white overflow-x-hidden">

      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-casatic-700 via-casatic-800 to-surface-900 py-16 sm:py-24 lg:py-32">
        {/* Decorative blobs */}
        <div className="absolute inset-0 bg-grid opacity-10 pointer-events-none" />
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-casatic-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-accent-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">

            {/* Copy */}
            <div className="text-center lg:text-left animate-fade-in-up">
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-casatic-300 bg-white/10 px-3 py-1.5 rounded-full mb-5">
                <span className="w-1.5 h-1.5 rounded-full bg-accent-400 animate-pulse-soft" />
                Directorio Interactivo 2026
              </span>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] font-extrabold text-white leading-tight tracking-tight mb-5">
                Ecosistema Tecnológico{' '}
                <span className="text-gradient-accent">CASATIC</span>
              </h1>
              <p className="text-base sm:text-lg text-casatic-200 leading-relaxed mb-8 max-w-lg mx-auto lg:mx-0">
                Conecta con los socios tecnológicos y empresas asociadas más relevantes de El Salvador.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
                <Link
                  to="/directorio"
                  className="btn-primary btn-lg shadow-xl shadow-casatic-700/40 hover:shadow-casatic-600/50"
                >
                  Explorar Directorio <ArrowRight size={18} />
                </Link>
                <Link
                  to="/login-socios"
                  className="btn btn-lg bg-white/10 text-white border border-white/20 hover:bg-white/20 backdrop-blur-sm"
                >
                  Acceso Socios
                </Link>
              </div>
            </div>

            {/* Visual card */}
            <div className="hidden lg:flex justify-center items-center animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <div className="relative w-full max-w-sm">
                <div className="absolute inset-0 bg-casatic-500/30 rounded-3xl blur-2xl" />
                <div className="relative bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-8 shadow-glass-lg">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-casatic-600 rounded-2xl flex items-center justify-center shadow-lg">
                      <Building2 size={24} className="text-white" />
                    </div>
                    <div>
                      <p className="font-bold text-white text-sm">CASATIC</p>
                      <p className="text-casatic-300 text-xs">Directorio de Socios</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    {['Tecnología', 'Telecomunicaciones', 'Ciberseguridad', 'Software'].map((cat) => (
                      <div key={cat} className="flex items-center gap-3 bg-white/[0.06] rounded-xl px-4 py-2.5">
                        <span className="w-2 h-2 rounded-full bg-accent-400 flex-shrink-0" />
                        <span className="text-sm text-white/80">{cat}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats Banner ────────────────────────────────── */}
      <section className="bg-casatic-600 py-8 sm:py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 sm:gap-10 text-center">
            <div>
              <p className="text-2xl sm:text-3xl font-extrabold text-white">{total}+</p>
              <p className="text-casatic-200 text-sm mt-0.5">Socios registrados</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-extrabold text-white">25+</p>
              <p className="text-casatic-200 text-sm mt-0.5">Especialidades</p>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <p className="text-2xl sm:text-3xl font-extrabold text-white">100%</p>
              <p className="text-casatic-200 text-sm mt-0.5">Verificado</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Features ────────────────────────────────────── */}
      {/* ── cuadricula de caracteristicas ───────────────────────────────── */}
      <section className="py-20 bg-gradient-to-br from-[rgb(254, 255, 255)] to-[#1e3a8a] ">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-surface-900 tracking-tight mb-4">
              Todo lo que necesitas en un
              <span className="text-#1e3a8a text-gradient"> solo lugar</span>
            </h2>
            <p className="bg-black/2 inline-block text-lg text-surface-0 px-4 py-2 rounded-lg">
              Una plataforma moderna para conectar empresas de tecnología con quienes necesitan sus servicios.
            </p>
          </div>
          {/*--------------------cuadro de menus de casatic --------------*/}
     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 stagger-children">

      {/* Imagen si existe */}
     {features.map((f, i) => (
  <div key={i} className="group card-interactive p-6 text-center">

    {f.img && (
      <img
        src={f.img}
        alt={f.title}
        className="w-40 mx-auto mb-4"
      />
    )}

    {f.img2 && (
      <img
        src={f.img2}
        alt={f.title}
        className="w-40 mx-auto mb-4"
      />
    )}

    <h3 className="font-bold text-lg mb-2">
      {f.title}
    </h3>

    <p className="text-sm text-surface-600 mb-4">
      {f.desc}
    </p>

    {f.link && (
      <a
     href={f.link}
     target="_black"
     rel="noopener noreferrer"
     className="text-blue-600 font-semibold"
      >
        Ver más
      </a>
    )}

  </div>
))}
  </div>
  </div>
  </section>

      {/* ── CTA ─────────────────────────────────────────── */}
      <section className="py-16 sm:py-20 bg-white border-t border-surface-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-casatic-600 to-casatic-800 rounded-3xl p-8 sm:p-12 lg:p-16 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-grid opacity-10 pointer-events-none" />
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />
            <div className="relative">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4 tracking-tight">
                ¿Listo para conectar?
              </h2>
              <p className="text-casatic-200 text-base sm:text-lg mb-8 max-w-xl mx-auto">
                Accede al directorio completo y descubre oportunidades de colaboración con la red CASATIC.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  to="/directorio"
                  className="btn btn-lg bg-white text-casatic-700 hover:bg-casatic-50 font-bold shadow-xl"
                >
                  Ver Directorio <ArrowRight size={18} />
                </Link>
                <Link
                  to="/login-socios"
                  className="btn btn-lg bg-white/10 text-white border border-white/30 hover:bg-white/20"
                >
                  Soy Socio
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
