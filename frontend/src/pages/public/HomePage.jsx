
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import api from '../../api/client';
import busquedaInteligente from './img/busquedainteligente.png';
import gestionSegura from './img/gestionsegura.png';
import conexionEmpresarial from './img/conexionempresarial.png';
import {
  Search, Globe, ShieldCheck, ArrowRight, Check,
  ChevronLeft, ChevronRight, Star, Zap, Users,
} from 'lucide-react';
import casaticLogo from '../../img/Reverse - v3@4x.png';
import { useNavigate } from 'react-router-dom';
import casatic1 from '../../img/imagenes-casatic.png';
import membresia from '../../img/MEMBRESIA CASATIC.png';

const features = [
  {
    icon: Search,
    title: 'Búsqueda Avanzada',
    desc: 'Encuentra socios por especialidad, sector o nombre con filtros potentes.',
    img: busquedaInteligente,
    link: '/categorias',
    accent: 'from-casatic-500 to-casatic-700',
    iconBg: 'bg-casatic-100 text-casatic-600',
  },
  {
    icon: Globe,
    title: 'Información Completa',
    desc: 'Perfiles detallados con sitios web, contactos y descripciones empresariales.',
    img: conexionEmpresarial,
    link: '/directorio',
    accent: 'from-accent-400 to-accent-600',
    iconBg: 'bg-accent-50 text-accent-600',
  },
  {
    icon: ShieldCheck,
    title: 'Datos Verificados',
    desc: 'Información confiable y actualizada de socios registrados en CASATIC.',
    img: gestionSegura,
    accent: 'from-purple-500 to-purple-700',
    iconBg: 'bg-purple-50 text-purple-600',
  },
];

const convenios = [
  {
    route: '/convenio_innovacion',
    title: 'Convenio con la Secretaría de Innovación',
    img: 'https://www.casatic.org/images/FOTOS%20CONVENIOS/CONVENIO%20CON%20SECRETAR%C3%8DA%20DE%20INNOVACI%C3%93N/convenio%204%20secretaria.jpg',
  },
  {
    route: '/convenio_brita',
    title: 'Convenio con la Cámara de Comercio Británica',
    img: 'https://www.casatic.org/images/FOTOS%20CONVENIOS/CONVENIO%20CAMARA%20DE%20COMERCIO%20BRITANICO/convenio%202.jpg',
  },
  {
    route: '/convenio_proyeccion',
    title: 'Convenio con la Universidad de El Salvador',
    img: 'https://www.casatic.org/images/FOTOS%20CONVENIOS/CONVENIO%20CON%20PROYECCI%C3%93N%20SOCIAL/proyeccion%20social%202.jpg',
  },
  {
    route: '/convenio_ugb',
    title: 'Convenio con UGB',
    img: 'https://www.casatic.org/images/FOTOS%20CONVENIOS/CONVENIO%20UNIVERSIDAD%20GERARDO%20BARRIOS/convenio%20ugb%203.jpg',
  },
  {
    route: '/convenio_uo',
    title: 'Convenio con UNIVO',
    img: 'https://www.casatic.org/images/FOTOS%20CONVENIOS/UNIVERSIDAD%20DE%20ORIENTE/convenio%20univo%204.jpg',
  },
];

const memberships = [
  {
    tier: 'Socios Fundadores',
    price: '$1,300',
    period: 'anual',
    desc: 'Empresas que formaron los cimientos de CASATIC en 2010.',
    detail: 'CASATIC fue fundada por más de 20 empresas TIC líderes del país.',
    icon: Star,
    gradient: 'from-amber-400 to-amber-600',
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    badge: 'bg-amber-100 text-amber-700',
    badgeText: 'Fundador',
  },
  {
    tier: 'Socios Miembros',
    price: '$400 – $1,200',
    period: 'anual',
    desc: 'Empresas del sector industrial, comercio, finanzas y servicios.',
    detail: 'Membresía escalonada según el tamaño y giro de la empresa.',
    icon: Zap,
    gradient: 'from-casatic-500 to-casatic-700',
    bg: 'bg-casatic-50',
    border: 'border-casatic-200',
    badge: 'bg-casatic-100 text-casatic-700',
    badgeText: 'Más popular',
    featured: true,
  },
  {
    tier: 'Socios Invitados',
    price: '$25 – $100',
    period: 'trimestral',
    desc: 'Entidades con menos de 10 empleados y multinacionales.',
    detail: 'Pequeñas empresas pagan trimestralmente; multinacionales, pago único.',
    icon: Users,
    gradient: 'from-accent-400 to-accent-600',
    bg: 'bg-accent-50',
    border: 'border-accent-200',
    badge: 'bg-accent-100 text-accent-700',
    badgeText: 'Flexible',
  },
];

const legalNotes = [
  'Precios no incluyen IVA.',
  '10% de descuento para socios que cancelen cuotas anuales por adelantado.',
  'Enviar copia de NIT y tarjeta de IVA al momento de remitir el formulario de forma de pago.',
  'Al afiliarse a CASATIC y designar una forma de pago, autoriza la emisión de CCD o factura para el cobro de la cuota mensual, trimestral y/o anual.',
];

export default function HomePage() {
  const [total, setTotal] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/directorio?page=1&pageSize=1')
      .then((res) => setTotal(res.data.total))
      .catch(() => {});
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % convenios.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const prevSlide = () =>
    setCurrentIndex((prev) => (prev === 0 ? convenios.length - 1 : prev - 1));
  const nextSlide = () =>
    setCurrentIndex((prev) => (prev === convenios.length - 1 ? 0 : prev + 1));

  return (
    <div className="bg-white overflow-x-hidden">

      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-casatic-700 via-casatic-800 to-surface-900 py-16 sm:py-24 lg:py-32">
        <div className="absolute inset-0 bg-grid opacity-10 pointer-events-none" />
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-casatic-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-accent-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">

            <div className="text-center lg:text-left animate-fade-in-up">
              <img
                src={casaticLogo}
                alt="CASATIC"
                className="h-12 w-auto object-contain mb-5 mx-auto lg:mx-0"
              />
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
                  className="btn-primary btn-lg shadow-xl shadow-casatic-700/40 hover:shadow-casatic-600/50 hover:scale-105 transition-all duration-300"
                >
                  Explorar Directorio <ArrowRight size={18} />
                </Link>
                <Link
                  to="/login"
                  className="btn btn-lg bg-white/10 text-white border border-white/20 hover:bg-white/20 backdrop-blur-sm hover:scale-105 transition-all duration-300"
                >
                  Iniciar Sesión
                </Link>
              </div>
            </div>

            <div className="hidden lg:flex justify-center items-center animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <div className="relative w-full max-w-sm">
                <div className="absolute inset-0 bg-casatic-500/30 rounded-3xl blur-2xl" />
                <div className="relative bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-8 shadow-glass-lg">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center shadow-lg p-1.5">
                      <img src={casaticLogo} alt="CASATIC" className="h-full w-auto object-contain" />
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
          <div className="grid grid-cols-3 gap-6 sm:gap-10 text-center">
            <div>
              <p className="text-2xl sm:text-3xl font-extrabold text-white">{total || '—'}+</p>
              <p className="text-casatic-200 text-sm mt-0.5">Socios registrados</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-extrabold text-white">25+</p>
              <p className="text-casatic-200 text-sm mt-0.5">Especialidades</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-extrabold text-white">100%</p>
              <p className="text-casatic-200 text-sm mt-0.5">Verificado</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Features ────────────────────────────────────── */}
      <section className="py-20 bg-gradient-to-b from-white to-casatic-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-surface-900 tracking-tight mb-4">
              Todo lo que necesitas en{' '}
              <span className="text-gradient">un solo lugar</span>
            </h2>
            <p className="text-lg text-surface-500">
              Una plataforma moderna para conectar empresas de tecnología con quienes necesitan sus servicios.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {features.map((f, i) => (
              <div
                key={i}
                className="group card-base overflow-hidden hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300"
              >
                <div className={`h-1.5 w-full bg-gradient-to-r ${f.accent}`} />
                <div className="p-8 text-center">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5 ${f.iconBg}`}>
                    <f.icon size={26} />
                  </div>
                  {f.img && (
                    <img
                      src={f.img}
                      alt={f.title}
                      className="w-36 mx-auto mb-5 object-contain"
                    />
                  )}
                  <h3 className="font-bold text-lg text-surface-900 mb-2">{f.title}</h3>
                  <p className="text-sm text-surface-500 leading-relaxed mb-5">{f.desc}</p>
                  {f.link && (
                    <Link
                      to={f.link}
                      className="inline-flex items-center gap-1 text-sm font-semibold text-casatic-600 hover:text-casatic-700 group-hover:gap-2 transition-all"
                    >
                      Ver más <ArrowRight size={14} />
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Ejes Estratégicos ───────────────────────────── */}
      <section className="py-20 bg-gradient-to-br from-white via-casatic-50 to-casatic-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold text-casatic-900 tracking-tight mb-4">
              Ejes Estratégicos de{' '}
              <span className="text-gradient-accent">CASATIC</span>
            </h2>
            <p className="text-lg text-surface-600 mb-8">
              Conoce los pilares sobre los que CASATIC construye su visión para fortalecer
              el ecosistema tecnológico de El Salvador.
            </p>
            <Link
              to="/ejes-estrategicos"
              className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-casatic-600 to-casatic-700 text-white rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300"
            >
              Explorar Ejes Estratégicos <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Convenios ───────────────────────────────────── */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <h2 className="text-3xl sm:text-4xl font-bold text-surface-900 tracking-tight mb-2">
              Convenios de{' '}
              <span className="text-gradient">CASATIC</span>
            </h2>
            <p className="text-surface-500">Alianzas estratégicas que fortalecen el ecosistema TIC</p>
          </div>

          <div className="relative rounded-2xl overflow-hidden shadow-elevated group">
            <div
              className="w-full h-[420px] sm:h-[480px] cursor-pointer"
              onClick={() => navigate(convenios[currentIndex].route)}
            >
              <img
                src={convenios[currentIndex].img}
                alt={convenios[currentIndex].title}
                className="w-full h-full object-cover transition-opacity duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
                <h3 className="text-white text-xl sm:text-2xl font-bold leading-snug">
                  {convenios[currentIndex].title}
                </h3>
                <span className="inline-flex items-center gap-1 mt-2 text-sm text-white/70 font-medium">
                  Ver más <ArrowRight size={14} />
                </span>
              </div>
            </div>

            <button
              onClick={(e) => { e.stopPropagation(); prevSlide(); }}
              className="absolute top-1/2 left-4 -translate-y-1/2 w-10 h-10 bg-white/90 hover:bg-white rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110"
              aria-label="Anterior"
            >
              <ChevronLeft size={20} className="text-surface-700" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); nextSlide(); }}
              className="absolute top-1/2 right-4 -translate-y-1/2 w-10 h-10 bg-white/90 hover:bg-white rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110"
              aria-label="Siguiente"
            >
              <ChevronRight size={20} className="text-surface-700" />
            </button>

            <div className="absolute bottom-4 right-6 flex gap-1.5">
              {convenios.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentIndex(i)}
                  className={`rounded-full transition-all duration-300 ${
                    i === currentIndex ? 'w-5 h-2 bg-white' : 'w-2 h-2 bg-white/50 hover:bg-white/80'
                  }`}
                  aria-label={`Slide ${i + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Imagen Principal ─────────────────────────────── */}
      <section className="py-12 bg-surface-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <img
            src={casatic1}
            alt="CASATIC"
            className="w-full h-[300px] md:h-[500px] object-cover rounded-3xl shadow-elevated"
          />
        </div>
      </section>

      {/* ── Membresías ──────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-surface-900 tracking-tight mb-4">
              Tipos de{' '}
              <span className="text-gradient">Membresía</span>
            </h2>
            <p className="text-lg text-surface-500">
              Únete a CASATIC y forma parte de la red tecnológica más importante de El Salvador.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {memberships.map((m, i) => (
              <div
                key={i}
                className={`relative rounded-2xl border-2 ${m.border} ${m.bg} overflow-hidden
                  transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover
                  ${m.featured ? 'ring-2 ring-casatic-500 ring-offset-2' : ''}`}
              >
                {m.featured && (
                  <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-casatic-500 to-casatic-600" />
                )}
                <div className="p-8">
                  <span className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full mb-4 ${m.badge}`}>
                    <m.icon size={11} />
                    {m.badgeText}
                  </span>
                  <img src={membresia} alt="Membresía CASATIC" className="w-20 h-24 object-contain mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-surface-900 text-center mb-2">{m.tier}</h3>
                  <div className="text-center mb-4">
                    <span className="text-2xl font-extrabold text-surface-900">{m.price}</span>
                    <span className="text-sm text-surface-400 ml-1">/ {m.period}</span>
                  </div>
                  <p className="text-sm text-surface-600 text-center leading-relaxed mb-2">{m.desc}</p>
                  <p className="text-xs text-surface-400 text-center leading-relaxed">{m.detail}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Notas legales */}
          <div className="mt-10 max-w-3xl mx-auto bg-surface-50 border border-surface-200 rounded-2xl p-6">
            <h4 className="text-sm font-bold text-surface-700 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Check size={16} className="text-casatic-500" />
              Condiciones de membresía
            </h4>
            <ul className="space-y-2.5">
              {legalNotes.map((note, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-surface-600">
                  <Check size={14} className="text-casatic-500 flex-shrink-0 mt-0.5" />
                  {note}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────────── */}
      <section className="py-16 sm:py-20 bg-surface-50 border-t border-surface-100">
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
                  to="/login"
                  className="btn btn-lg bg-white/10 text-white border border-white/30 hover:bg-white/20"
                >
                  Iniciar Sesión
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
