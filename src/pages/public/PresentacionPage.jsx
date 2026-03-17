import { Code2, Cpu, Database, Eye, Server, Smartphone, Target, Trophy } from 'lucide-react';

export default function PresentacionPage() {
  const sections = [
    {
      id: 'vision',
      title: 'Nuestra Visión',
      icon: Eye,
      description:
        'Ser el referente necesario y reconocido en el sector de las tecnologías de la información y las comunicaciones a nivel nacional e internacional.',
    },
    {
      id: 'mision',
      title: 'Nuestra Misión',
      icon: Target,
      description:
        'Somos una organización sin fines de lucro, que representa y promueve al sector de las Tecnologías de la información y las Comunicaciones (TIC), como motor de desarrollo de El Salvador.',
      details:
        'Quien busca ampliar y acercar las oportunidades que proporcionen la competitividad y el crecimiento del sector de la tecnología.',
    },
    {
      id: 'objetivos',
      title: 'Nuestros Objetivos',
      icon: Trophy,
      description:
        'Fomentar la excelencia profesional, promover la innovación tecnológica y fortalecer los lazos entre nuestros miembros.',
      details: [
        'Desarrollar programas de formación continua para nuestros socios',
        'Facilitar el networking y la colaboración entre empresas tecnológicas',
        'Promover la adopción de tecnologías emergentes en el mercado local',
        'Contribuir al desarrollo económico a través de la innovación tecnológica',
      ],
    },
  ];

  const programmingIcons = [
    { name: 'Programación', icon: Code2 },
    { name: 'Infraestructura', icon: Server },
    { name: 'Base de datos', icon: Database },
    { name: 'Hardware', icon: Cpu },
    { name: 'Móvil', icon: Smartphone },
  ];

  return (
    <div className="bg-mesh min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-br from-casatic-700 via-casatic-800 to-surface-900 text-white py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 animate-fade-in-up">
            Presentación CASATIC
          </h1>
          <p
            className="text-lg text-white/90 max-w-2xl mx-auto animate-fade-in-up"
            style={{ animationDelay: '0.1s' }}
          >
            Conoce nuestra visión, misión y objetivos para el futuro de la tecnología
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
        {sections.map((sec) => {
          const Icon = sec.icon;
          return (
            <div
              key={sec.id}
              className="bg-white rounded-2xl shadow-elevated p-8 flex flex-col md:flex-row items-center gap-6"
            >
              <Icon size={48} className="text-casatic-600" />
              <div>
                <h2 className="text-2xl font-bold text-surface-900 mb-4">
                  {sec.title}
                </h2>
                <p className="text-lg text-surface-600 mb-4 leading-relaxed">
                  {sec.description}
                </p>
                {Array.isArray(sec.details) ? (
                  <ul className="list-disc pl-5 space-y-2 text-surface-700">
                    {sec.details.map((d, i) => (
                      <li key={i}>{d}</li>
                    ))}
                  </ul>
                ) : sec.details ? (
                  <p className="text-surface-700 leading-relaxed">
                    {sec.details}
                  </p>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>

      <section className="bg-surface-100 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-bold text-surface-900 mb-6 text-center">
            Stack de programación
          </h2>
          <div className="overflow-x-auto">
            <div className="inline-flex gap-4 min-w-max">
              {programmingIcons.map((tech) => {
                const Icon = tech.icon;
                return (
                  <div
                    key={tech.name}
                    className="min-w-[12rem] bg-white border border-surface-200 rounded-2xl p-5 flex flex-col items-center gap-2 shadow-sm hover:shadow-md transition-shadow duration-300"
                  >
                    <Icon size={36} className="text-casatic-600 animate-float" />
                    <span className="text-sm font-medium text-surface-700">{tech.name}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
