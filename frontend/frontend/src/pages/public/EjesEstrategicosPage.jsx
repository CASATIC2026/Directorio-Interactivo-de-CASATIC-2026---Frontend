import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Zap,
  BookOpen,
  TrendingUp,
  Lightbulb,
  ArrowRight,
  Target,
  ChevronDown,
} from 'lucide-react';

import casaticLogo from '../../img/Reverse - v4@4x.png';

const ejesEstrategicos = [
  {
    id: 1,
    icon: Zap,
    title: 'Políticas Públicas',
    summary: 'Impulsamos iniciativas para velar por el clima legal, normativo y de políticas públicas del sector TIC en El Salvador.',
    description: `CASATIC impulsa iniciativas para velar por el clima legal, normativo y de políticas públicas relacionadas al buen desarrollo del sector TIC en el país, propiciando el diálogo gobierno-empresa articulando con otros actores para la generación de propuestas y conocimiento para la toma de decisiones.

El Comité de Políticas Públicas trabaja en el análisis y aporte de insumos a la discusión de proyectos de ley, así como con aliados del Órgano Ejecutivo: Ministerio de Economía, FOMILENIO II, y la Secretaría Técnica de la Presidencia.

CASATIC impulsa desde el Comité de Políticas Públicas la creación de una propuesta que contribuye a fortalecer las bases de una sociedad basada en la información y el conocimiento.`,
    gradient: 'from-casatic-500 to-casatic-600',
    bgGradient: 'from-casatic-500/10 to-casatic-600/5',
    base: 'bg-casatic-50 text-casatic-600',
    ring: 'ring-casatic-500',
    objectives: [
      'Diálogo permanente con el gobierno',
      'Análisis de políticas públicas',
      'Generación de propuestas TIC',
      'Fortalecimiento del sector',
    ],
  },
  {
    id: 2,
    icon: BookOpen,
    title: 'Exportación y Negocios',
    summary: 'Buscamos el acercamiento de oportunidades comerciales que favorezcan el crecimiento y posicionamiento del sector TIC.',
    description: `El Comité de Promoción de Negocios trabaja buscando el acercamiento de oportunidades comerciales que favorezcan el crecimiento del sector y el posicionamiento de las TIC como factor clave para el desarrollo del país.

Se impulsan herramientas, eventos, acercamientos entre empresas del sector TIC y multisectoriales, así como alianzas regionales para propiciar la internacionalización. También se fomenta la participación en actividades de promoción comercial y la difusión de estudios de mercado internacional.

CASATIC busca que los negocios generen riqueza, oportunidades y valor para los ciudadanos.`,
    gradient: 'from-accent-500 to-accent-600',
    bgGradient: 'from-accent-500/10 to-accent-600/5',
    base: 'bg-accent-50 text-accent-600',
    ring: 'ring-accent-500',
    objectives: [
      'Expansión internacional del sector TIC',
      'Generación de oportunidades comerciales',
      'Alianzas estratégicas regionales',
      'Promoción del sector tecnológico',
    ],
  },
  {
    id: 3,
    icon: Lightbulb,
    title: 'Talento Humano',
    summary: 'Creamos y propiciamos el entorno para el desarrollo, innovación y creatividad del talento humano mediante las TIC.',
    description: `El área de Fortalecimiento del Talento Humano de CASATIC tiene como eje central crear y propiciar el entorno para el desarrollo, innovación y creatividad del talento humano mediante el uso de herramientas tecnológicas.

Se enfoca en mejorar la eficiencia de las empresas del sector TIC mediante el fortalecimiento de su capital humano como clave del crecimiento del sector.

Este proceso se realiza semestralmente para fortalecer la productividad del sector TIC mediante la identificación y categorización de necesidades de formación de los agremiados.`,
    gradient: 'from-purple-500 to-purple-600',
    bgGradient: 'from-purple-500/10 to-purple-600/5',
    base: 'bg-purple-50 text-purple-600',
    ring: 'ring-purple-500',
    objectives: [
      'Desarrollo de talento TIC',
      'Capacitación continua',
      'Innovación en habilidades digitales',
      'Fortalecimiento del capital humano',
    ],
  },
  {
    id: 4,
    icon: TrendingUp,
    title: 'Innovación',
    summary: 'Acompañamos y realizamos iniciativas que fortalecen la capacidad de innovación en el uso y desarrollo de las TIC.',
    description: `El Comité de Innovación y Tecnología de CASATIC tiene como finalidad el acompañamiento y la realización de iniciativas transversales a los ejes estratégicos, que fortalezcan la capacidad de innovación en el uso, apropiación y desarrollo de las TIC para impulsar el desarrollo económico, social y cultural de nuestro país.

Trabajamos articulando actores del ecosistema tecnológico nacional para co-crear soluciones que respondan a los desafíos de la transformación digital, impulsando la competitividad empresarial y el bienestar ciudadano.`,
    gradient: 'from-indigo-500 to-indigo-600',
    bgGradient: 'from-indigo-500/10 to-indigo-600/5',
    base: 'bg-indigo-50 text-indigo-600',
    ring: 'ring-indigo-500',
    objectives: [
      'Impulso a la innovación tecnológica',
      'Apropiación de las TIC',
      'Transformación digital del país',
      'Desarrollo económico y social',
    ],
  },
];

export default function EjesEstrategicosPage() {
  const [activeEje, setActiveEje] = useState(ejesEstrategicos[0].id);

  const selectedEje = ejesEstrategicos.find((e) => e.id === activeEje);

  return (
    <div className="bg-mesh min-h-screen">

      {/* ── Hero ──────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-casatic-700 via-casatic-800 to-surface-900 py-16 sm:py-20">
        <div className="absolute inset-0 bg-grid opacity-10 pointer-events-none" />
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-casatic-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-accent-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <img
            src={casaticLogo}
            alt="CASATIC Logo"
            className="h-12 mx-auto mb-6 opacity-90"
          />
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-4">
            Ejes <span className="text-gradient-accent">Estratégicos</span>
          </h1>
          <p className="text-base sm:text-lg text-casatic-200 leading-relaxed max-w-xl mx-auto mb-8">
            Los pilares que guían el desarrollo y la competitividad del sector TIC en El Salvador.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/presentacion"
              className="inline-flex items-center gap-2 px-6 py-3 bg-accent-500 hover:bg-accent-600 text-white font-semibold rounded-xl transition-colors"
            >
              Conocer CASATIC <ArrowRight size={16} />
            </Link>
            <Link
              to="/directorio"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white border border-white/20 font-semibold rounded-xl transition-colors"
            >
              Ver Directorio
            </Link>
          </div>
        </div>
      </section>

      {/* ── Stats Banner ─────────────────────────────────── */}
      <section className="bg-casatic-600 py-6 sm:py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
            {ejesEstrategicos.map((eje) => {
              const Icon = eje.icon;
              return (
                <div key={eje.id}>
                  <p className="text-xl sm:text-2xl font-extrabold text-white flex items-center justify-center gap-2">
                    <Icon size={20} />
                    {eje.title}
                  </p>
                  <p className="text-casatic-200 text-xs mt-0.5">Eje estratégico</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Selector de Ejes ─────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* Tab Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {ejesEstrategicos.map((eje) => {
            const Icon = eje.icon;
            const isActive = activeEje === eje.id;
            return (
              <button
                key={eje.id}
                onClick={() => setActiveEje(eje.id)}
                className={`text-left rounded-2xl p-5 cursor-pointer transition-all duration-300 border-2 ${
                  isActive
                    ? `ring-2 ${eje.ring} border-transparent shadow-lg scale-[1.02] bg-white`
                    : 'border-surface-100 bg-white hover:border-casatic-200 hover:shadow-md'
                }`}
              >
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${eje.gradient} flex items-center justify-center mb-3 shadow-sm`}>
                  <Icon size={22} className="text-white" />
                </div>
                <h3 className="font-bold text-surface-900 mb-1.5">{eje.title}</h3>
                <p className="text-xs text-surface-500 leading-relaxed line-clamp-2">{eje.summary}</p>
                <div className={`flex items-center gap-1 mt-3 text-xs font-semibold transition-colors ${isActive ? 'text-casatic-600' : 'text-surface-400'}`}>
                  {isActive ? 'Seleccionado' : 'Ver detalle'}
                  <ArrowRight size={12} className={`transition-transform ${isActive ? 'translate-x-0.5' : ''}`} />
                </div>
              </button>
            );
          })}
        </div>

        {/* Detail Panel */}
        {selectedEje && (
          <div className={`card-base overflow-hidden rounded-2xl animate-fade-in-up`}>
            <div className={`h-1.5 bg-gradient-to-r ${selectedEje.gradient}`} />
            <div className="p-8 sm:p-10">
              <div className="flex items-start gap-4 mb-6">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${selectedEje.gradient} flex items-center justify-center flex-shrink-0 shadow-md`}>
                  <selectedEje.icon size={26} className="text-white" />
                </div>
                <div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-surface-900">{selectedEje.title}</h2>
                  <p className="text-surface-500 text-sm mt-1">{selectedEje.summary}</p>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                <div className="md:col-span-2">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-surface-400 mb-3">Descripción</h3>
                  <div className="space-y-3">
                    {selectedEje.description.split('\n\n').map((para, i) => (
                      <p key={i} className="text-surface-600 leading-relaxed text-sm">{para}</p>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-xs font-bold uppercase tracking-widest text-surface-400 mb-3">Objetivos</h3>
                  <ul className="space-y-2.5">
                    {selectedEje.objectives.map((obj, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-sm text-surface-700">
                        <span className={`w-5 h-5 rounded-full bg-gradient-to-br ${selectedEje.gradient} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                          <Target size={10} className="text-white" />
                        </span>
                        {obj}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
