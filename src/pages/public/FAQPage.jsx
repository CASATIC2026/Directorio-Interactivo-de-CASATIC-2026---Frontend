import { useState } from 'react';
import { ChevronDown, HelpCircle, Search } from 'lucide-react';

const FAQS = [
  {
    categoria: 'Información General',
    items: [
      {
        q: '¿Qué es CASATIC?',
        a: 'CASATIC (Cámara Salvadoreña de Tecnologías de la Información y Comunicación) Es una asociacion sin fines de lucro del sector privado especializada en las tecnologìas de informacìon y comunicaciones cuyo fin principal es promover el uso de las tecnologías para la mejora de la calidad de vida de los salvadoreños ',
      },
      {
        q: '¿Qué es el Directorio de Empresas CASATIC?',
        a: 'Es una plataforma que permite a sus socios darse a conocer, promover sus productos y servicios, a cualquier persona o insitución del mercado nacional o internacional.',
      },
      {
        q: '¿Es gratuito utilizar el directorio?',
        a: 'Sí, para los socios es gratis, otras empresas del sector TIC pueden ser parte del directorio pagando una membresía, para los usuarios el acceso es publico y libre.',
      },
    ],
  },
  {
    categoria: 'Empresas Socias',
    items: [
      {
        q: '¿Cómo puedo asociarme a CASATIC?',
        a: 'Solicitar a tráves de redes sociales, correo institucional. página web.',
      },
      {
        q: '¿Qué beneficios tiene ser socio de CASATIC?',
        a: 'Principalmente la representación ante el sector empresarial, el aparato gubernamental, organismos internacinales y la sociedad. También, oportunidades de networking y participacion en proyectos que generen oportunidad de negocios.',
      },
      {
        q: '¿Cómo actualizo la información de mi empresa en el directorio?',
        a: 'Como socio, cada uno puede tener aceso a actualizar su micro sitio, solicitando su acceso, o solicitando a la administración de CASATIC.',
      },
      {
        q: '¿Qué pasa si no recuerdo mi contraseña?',
        a: 'Puede solicitar a la adminitración de CASATIC que restablesca su contraseña.',
      },
    ],
  },
  {
    categoria: 'Búsqueda y Directorio',
    items: [
      {
        q: '¿Cómo busco una empresa en el directorio?',
        a: 'A traves de navegación en el sitio o por busqueda con o sin filtro.',
      },
      {
        q: '¿Qué significan los estados de membresía?',
        a: 'En el directorio se visualizan solo socios activos con membresía vigente, socios en mora o que ya no  pertenecen son puestos en pausa o dados de baja por la administración de CASATIC.',
      },
      {
        q: '¿Puedo contactar directamente a una empresa desde el directorio?',
        a: 'En el directorio está la información de contacto y los enlaces a los sitios de los socios, la plataforma es solo informativa.',
      },
    ],
  },
  {
    categoria: 'Soporte Técnico',
    items: [
      {
        q: '¿En qué navegadores funciona mejor el directorio?',
        a: 'Debe ser principalmente comtatible con Edge, Chrome, Firefox, Safari.',
      },
      {
        q: '¿La información de las empresas está verificada?',
        a: 'Debe ser validada y verificada por la administración de CASATIC.',
      },
      {
        q: '¿Detecté un error en el perfil de una empresa. ¿Qué hago?',
        a: 'Los socios pueden actualizar la información de sus empresas si tienen usuarios o solicitarlo a la administración de CASATIC.',
      },
    ],
  },
];

function AccordionItem({ q, a, isOpen, onToggle }) {
  return (
    <div className={`border border-surface-200 rounded-xl overflow-hidden transition-all ${isOpen ? 'shadow-sm' : ''}`}>
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-4 p-5 text-left bg-white hover:bg-casatic-50 transition-colors"
      >
        <span className="text-sm sm:text-base font-semibold text-surface-900">{q}</span>
        <ChevronDown
          size={18}
          className={`flex-shrink-0 text-casatic-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>
      {isOpen && (
        <div className="px-5 pb-5 bg-white">
          <p className="text-sm sm:text-base text-surface-600 leading-relaxed">{a}</p>
        </div>
      )}
    </div>
  );
}

export default function FAQPage() {
  const [openKey, setOpenKey] = useState(null);
  const [query, setQuery] = useState('');

  const toggleKey = (key) => setOpenKey((prev) => (prev === key ? null : key));

  const filtered = query.trim().length > 1
    ? FAQS.map((cat) => ({
        ...cat,
        items: cat.items.filter(
          ({ q, a }) =>
            q.toLowerCase().includes(query.toLowerCase()) ||
            a.toLowerCase().includes(query.toLowerCase()),
        ),
      })).filter((cat) => cat.items.length > 0)
    : FAQS;

  return (
    <div className="bg-mesh min-h-screen pb-16">
      {/* ── Banner ──────────────────────────────────────── */}
      <div className="bg-gradient-to-br from-casatic-700 via-casatic-800 to-surface-900 text-white py-14 sm:py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-10 pointer-events-none" />
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-white/10 rounded-2xl mb-4">
            <HelpCircle size={28} className="text-casatic-200" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-3">
            Preguntas Frecuentes
          </h1>
          <p className="text-casatic-200 text-base sm:text-lg">
            Encuentre respuestas a las dudas más comunes sobre CASATIC y el directorio.
          </p>
        </div>
      </div>
      <br/>
      <br/>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-10">
        {/* ── Buscador ────────────────────────────────── */}
        <div className="card-base p-4 mb-8 flex items-center gap-3">
          <Search size={18} className="text-surface-400 flex-shrink-0" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar en las preguntas…"
            className="flex-1 text-sm bg-transparent border-none outline-none text-surface-900 placeholder-surface-400"
          />
        </div>

        {/* ── Acordeón por categoría ──────────────────── */}
        {filtered.length === 0 && (
          <div className="text-center text-surface-500 py-16 text-sm">
            No se encontraron resultados para "<strong>{query}</strong>".
          </div>
        )}

        {filtered.map((cat) => (
          <div key={cat.categoria} className="mb-8">
            <h2 className="text-xs font-bold uppercase tracking-widest text-casatic-600 mb-3 px-1">
              {cat.categoria}
            </h2>
            <div className="space-y-2">
              {cat.items.map((item, i) => {
                const key = `${cat.categoria}-${i}`;
                return (
                  <AccordionItem
                    key={key}
                    q={item.q}
                    a={item.a}
                    isOpen={openKey === key}
                    onToggle={() => toggleKey(key)}
                  />
                );
              })}
            </div>
          </div>
        ))}

        {/* ── CTA ─────────────────────────────────────── */}
        <div className="mt-10 card-base p-6 sm:p-8 text-center bg-gradient-to-br from-casatic-600 to-casatic-800 text-white">
          <p className="text-base font-semibold mb-1">¿No encontró lo que buscaba?</p>
          <p className="text-casatic-200 text-sm mb-4">
            Nuestro equipo estará encantado de resolver sus dudas.
          </p>
          <a href="/contacto" className="btn-primary bg-white text-casatic-700 hover:bg-casatic-50 inline-flex items-center">
            Contáctenos
          </a>
        </div>
      </div>
    </div>
  );
}
