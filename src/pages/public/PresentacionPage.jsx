import { useState } from 'react';
import { Eye, Target, Trophy, Menu, X } from 'lucide-react';

export default function PresentacionPage() {
  const [activeSection, setActiveSection] = useState('vision');
  const [menuOpen, setMenuOpen] = useState(false);

  const sections = [
    { id: 'vision', label: 'Visión', icon: Eye },
    { id: 'mision', label: 'Misión', icon: Target },
    { id: 'objetivos', label: 'Objetivos', icon: Trophy },
  ];

  const content = {
    vision: {
      title: 'Nuestra Visión',
       description: 'Ser el referente necesario y reconocido en el sector de las tecnologías de la información y las comunicaciones a nivel nacional e internacional.',
 
    },
    mision: {
      title: 'Nuestra Misión',
          description: 'Somos una organización sin fines de lucro, que representa y promueve al sector de las Tecnologías de la información y las Comunicaciones (TIC), como motor de desarrollo de El Salvador.',
      details: 'Quien busca ampliar y acercar las oportunidades que proporcionen la competitividad y el crecimiento del sector de la tecnología.'
    },
    objetivos: {
      title: 'Nuestros Objetivos',
      description: 'Fomentar la excelencia profesional, promover la innovación tecnológica y fortalecer los lazos entre nuestros miembros.',
      details: [
        'Desarrollar programas de formación continua para nuestros socios',
        'Facilitar el networking y la colaboración entre empresas tecnológicas',
        'Promover la adopción de tecnologías emergentes en el mercado local',
        'Contribuir al desarrollo económico a través de la innovación tecnológica'
      ]
    }
  };

  const activeContent = content[activeSection];

  return (
    <div className="bg-mesh min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-br from-casatic-700 via-casatic-800 to-surface-900 text-white py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 animate-fade-in-up">
            Presentación CASATIC
          </h1>
          <p className="text-lg text-white/90 max-w-2xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            Conoce nuestra visión, misión y objetivos para el futuro de la tecnología
          </p>
        </div>
      </div>
        <br />
        <br />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Mobile Menu Toggle */}
        <div className="md:hidden mb-6">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="btn-secondary flex items-center gap-2"
          >
            <Menu size={20} />
            Menú
          </button>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Menu */}
          <div className={`md:w-1/4 ${menuOpen ? 'block' : 'hidden'} md:block`}>
            <div className="bg-white rounded-2xl shadow-elevated p-6 sticky top-6">
              <h2 className="text-lg font-semibold text-surface-900 mb-4">Navegación</h2>
              <nav className="space-y-2">
                {sections.map((section) => {
                  const Icon = section.icon;
                  return (
                    <button
                      key={section.id}
                      onClick={() => {
                        setActiveSection(section.id);
                        setMenuOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all ${
                        activeSection === section.id
                          ? 'bg-casatic-50 text-casatic-700 border border-casatic-200'
                          : 'text-surface-600 hover:bg-surface-50 hover:text-surface-900'
                      }`}
                    >
                      <Icon size={20} />
                      <span className="font-medium">{section.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Content */}
          <div className="md:w-3/4">
            <div className="bg-white rounded-2xl shadow-elevated p-8">
              <div className="flex items-center gap-4 mb-6">
                {(() => {
                  const ActiveIcon = sections.find(s => s.id === activeSection).icon;
                  return <ActiveIcon size={32} className="text-casatic-600" />;
                })()}
                <h2 className="text-2xl font-bold text-surface-900">{activeContent.title}</h2>
              </div>

              <p className="text-lg text-surface-600 mb-6 leading-relaxed">
                {activeContent.description}
              </p>

              {activeSection === 'objetivos' ? (
                <ul className="space-y-4">
                  {activeContent.details.map((objective, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-casatic-500 rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-surface-700">{objective}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-surface-700 leading-relaxed">
                  {activeContent.details}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
