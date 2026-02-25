import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/client';
import {
  Search, Building2, Globe, ShieldCheck, ArrowRight,
  Zap, Users, BarChart3, CheckCircle, Star
} from 'lucide-react';

function AnimatedCounter({ target, suffix = '' }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let current = 0;
    const step = Math.max(1, Math.ceil(target / 40));
    const timer = setInterval(() => {
      current += step;
      if (current >= target) { setCount(target); clearInterval(timer); }
      else setCount(current);
    }, 30);
    return () => clearInterval(timer);
  }, [target]);
  return <>{count}{suffix}</>;
}

export default function HomePage() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api.get('/reportes/dashboard')
      .then((res) => setStats(res.data))
      .catch(() => {});
  }, []);

  const features = [
    { icon: Search, title: 'Búsqueda Inteligente', desc: 'Full-Text Search avanzado para encontrar socios por nombre, especialidad, servicio o tecnología.', color: 'from-blue-500 to-cyan-500' },
    { icon: Building2, title: 'Micro-sitios', desc: 'Cada socio cuenta con un perfil profesional detallado con información corporativa y de contacto.', color: 'from-violet-500 to-purple-500' },
    { icon: Globe, title: 'Visibilidad Global', desc: 'Directorio público integrado a casatic.org para máxima exposición de nuestros socios.', color: 'from-emerald-500 to-teal-500' },
    { icon: ShieldCheck, title: 'Gestión Segura', desc: 'Panel administrativo protegido con JWT, roles y auditoría de actividad en tiempo real.', color: 'from-orange-500 to-amber-500' },
  ];

  const statsCards = [
    { label: 'Socios Activos', value: stats?.sociosActivos || 0, icon: Building2, suffix: '+' },
    { label: 'Especialidades', value: stats?.totalSocios ? 12 : 0, icon: Star, suffix: '+' },
    { label: 'Visitas este Mes', value: stats?.visitasMes || 0, icon: BarChart3, suffix: '' },
  ];

  return (
    <div className="overflow-hidden">
      {/* ── Hero Section ────────────────────────────────── */}
      <section className="relative min-h-[85vh] flex items-center bg-surface-950 overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-casatic-950 via-surface-950 to-casatic-900" />
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-casatic-600/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 animate-pulse-soft" />
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-accent-500/8 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4 animate-pulse-soft" style={{ animationDelay: '1s' }} />
          <div className="absolute inset-0 bg-grid opacity-20" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-casatic-500/10 border border-casatic-500/20 text-casatic-300 px-4 py-1.5 rounded-full text-sm font-medium mb-6 animate-fade-in">
              <Zap size={14} className="text-casatic-400" />
              Plataforma Oficial CASATIC 2026
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-[1.1] tracking-tight mb-6 animate-fade-in-up">
              Directorio
              <span className="block text-gradient-accent">
                Interactivo
              </span>
              de Socios
            </h1>

            <p className="text-lg sm:text-xl text-surface-400 max-w-xl mb-10 leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.15s' }}>
              Conecta con las empresas líderes en tecnología de Honduras.
              Explora, filtra y contacta socios certificados de CASATIC.
            </p>

            <div className="flex flex-col sm:flex-row items-start gap-4 animate-fade-in-up" style={{ animationDelay: '0.25s' }}>
              <Link
                to="/directorio"
                className="group inline-flex items-center gap-2.5 bg-casatic-600 text-white px-7 py-3.5 rounded-xl font-semibold hover:bg-casatic-500 transition-all duration-300 hover:shadow-xl hover:shadow-casatic-600/25 hover:-translate-y-0.5 text-lg"
              >
                <Search size={20} />
                Explorar Directorio
                <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                to="/admin/login"
                className="inline-flex items-center gap-2 text-surface-400 hover:text-white px-6 py-3.5 rounded-xl font-medium border border-surface-700 hover:border-surface-500 transition-all duration-200"
              >
                Acceso Socios
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>

          {/* Stats floating cards */}
          {stats && (
            <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl stagger-children">
              {statsCards.map((s, i) => (
                <div key={i} className="bg-white/[0.04] backdrop-blur-sm border border-white/[0.08] rounded-2xl p-4 flex items-center gap-3">
                  <div className="w-10 h-10 bg-casatic-500/15 rounded-xl flex items-center justify-center">
                    <s.icon size={18} className="text-casatic-400" />
                  </div>
                  <div>
                    <p className="text-xl font-bold text-white">
                      <AnimatedCounter target={s.value} suffix={s.suffix} />
                    </p>
                    <p className="text-xs text-surface-500">{s.label}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── Trusted By Section ──────────────────────────── */}
      <section className="py-12 bg-white border-b border-surface-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm font-medium text-surface-400 uppercase tracking-wider mb-8">
            Respaldado por la industria tecnológica hondureña
          </p>
          <div className="flex items-center justify-center gap-12 flex-wrap opacity-40">
            {['Cloud Computing', 'DevOps', 'IA & Machine Learning', 'Desarrollo Web', 'Infraestructura'].map((t) => (
              <span key={t} className="text-surface-800 font-semibold text-lg whitespace-nowrap">{t}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features Grid ───────────────────────────────── */}
      <section className="py-20 bg-surface-50 bg-mesh">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-surface-900 tracking-tight mb-4">
              Todo lo que necesitas en un
              <span className="text-gradient"> solo lugar</span>
            </h2>
            <p className="text-lg text-surface-500">
              Una plataforma moderna para conectar empresas de tecnología con quienes necesitan sus servicios.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 stagger-children">
            {features.map((f, i) => (
              <div key={i} className="group card-interactive p-6 text-center">
                <div className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-5 bg-gradient-to-br ${f.color} shadow-lg`}>
                  <f.icon size={24} className="text-white" />
                </div>
                <h3 className="font-semibold text-lg text-surface-900 mb-2 group-hover:text-casatic-600 transition-colors">
                  {f.title}
                </h3>
                <p className="text-sm text-surface-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-surface-900 tracking-tight mb-4">
              ¿Cómo funciona?
            </h2>
            <p className="text-lg text-surface-500">
              Tres sencillos pasos para encontrar al socio tecnológico ideal.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            <div className="hidden md:block absolute top-12 left-1/4 right-1/4 h-px bg-gradient-to-r from-casatic-200 via-casatic-300 to-casatic-200" />
            {[
              { step: '01', title: 'Busca', desc: 'Usa el buscador avanzado para filtrar por especialidad, servicio o tecnología.', icon: Search },
              { step: '02', title: 'Explora', desc: 'Revisa los perfiles detallados de cada empresa con toda su información.', icon: Building2 },
              { step: '03', title: 'Conecta', desc: 'Envía un formulario de contacto directamente al socio de tu interés.', icon: Users },
            ].map((item, i) => (
              <div key={i} className="relative text-center">
                <div className="w-12 h-12 bg-casatic-600 text-white rounded-2xl flex items-center justify-center mx-auto mb-4 font-bold text-sm shadow-lg shadow-casatic-600/25 relative z-10">
                  {item.step}
                </div>
                <h3 className="text-xl font-bold text-surface-900 mb-2">{item.title}</h3>
                <p className="text-surface-500 text-sm max-w-xs mx-auto">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────────── */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-casatic-700 via-casatic-800 to-surface-950" />
        <div className="absolute inset-0 bg-grid opacity-10" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-casatic-500/20 rounded-full blur-3xl" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/10 text-casatic-200 px-4 py-1.5 rounded-full text-sm font-medium mb-6">
            <CheckCircle size={14} /> Para socios de CASATIC
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 tracking-tight">
            Gestiona tu presencia digital
          </h2>
          <p className="text-lg text-casatic-200 mb-10 max-w-xl mx-auto">
            Accede al panel de administración para actualizar tu perfil,
            ver métricas de visitas y gestionar tus datos empresariales.
          </p>
          <Link
            to="/admin/login"
            className="group inline-flex items-center gap-2.5 bg-white text-casatic-800 px-8 py-4 rounded-xl font-semibold hover:bg-casatic-50 transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5 text-lg"
          >
            Acceder al Panel
            <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </section>
    </div>
  );
}
