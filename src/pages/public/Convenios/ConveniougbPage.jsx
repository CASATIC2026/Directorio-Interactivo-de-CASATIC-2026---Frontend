import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import casaticLogo from '../../public/img/Reverse - v4@4x.png';
import ugbLogo from '../img/socios e inversionistas/universidad gerardo barrios.png';

const convenioImages = [
  'https://www.casatic.org/images/FOTOS%20CONVENIOS/CONVENIO%20UNIVERSIDAD%20GERARDO%20BARRIOS/convenio%20ugb%203.jpg',
  'https://www.casatic.org/images/FOTOS%20CONVENIOS/CONVENIO%20UNIVERSIDAD%20GERARDO%20BARRIOS/convenio%20ugb%202.jpg',
];

const convenioInfo = {
  title: 'CONVENIO DE COOPERACION ENTRE LA UNIVERSIDAD GERARDO BARRIOS Y CASATIC',
  description:
    'Convenio orientado a fortalecer la cooperacion entre CASATIC y la Universidad Gerardo Barrios para impulsar formacion, innovacion, desarrollo de talento y vinculacion con el sector tecnologico.',
};

export default function ConveniougbPage() {
  return (
    <div className="bg-white">
      <section className="relative overflow-hidden bg-gradient-to-br from-casatic-700 via-casatic-800 to-surface-900 py-10 sm:py-14">
        <div className="absolute inset-0 bg-grid opacity-10 pointer-events-none" />
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-casatic-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-accent-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-casatic-200 hover:text-white mb-6"
          >
            <ArrowLeft size={18} />
            Volver al inicio
          </Link>

          <div className="flex justify-center items-center gap-4 mb-5">
            <img src={casaticLogo} alt="CASATIC" className="h-14 w-auto object-contain" />
            <img src={ugbLogo} alt="Universidad Gerardo Barrios" className="h-14 w-auto object-contain bg-white rounded-lg px-2 py-1" />
          </div>

          <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-casatic-300 bg-white/10 px-3 py-1.5 rounded-full mb-5 animate-fade-in-up">
            <span className="w-1.5 h-1.5 rounded-full bg-accent-400 animate-pulse-soft" />
            Directorio Interactivo CASATIC
          </span>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-4 animate-fade-in-up">
            Convenio con <span className="text-gradient-accent">UGB</span>
          </h1>

          <p className="text-base sm:text-lg text-casatic-200 leading-relaxed max-w-2xl mx-auto animate-fade-in-up">
            Fortalecemos la relacion entre academia, empresas y tecnologia.
          </p>
        </div>
      </section>

      <main className="bg-mesh py-16 sm:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <img
            src={convenioImages[0]}
            alt="Firma de convenio entre UGB y CASATIC"
            className="w-full max-h-[520px] object-cover rounded-2xl shadow-elevated mb-10"
          />

          <section className="bg-white rounded-2xl shadow-elevated p-6 sm:p-10 text-justify">
            <h2 className="text-xl sm:text-2xl font-bold text-surface-900 mb-6 text-center">
              {convenioInfo.title}
            </h2>
            <p className="text-surface-600 leading-relaxed">{convenioInfo.description}</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
              {convenioImages.map((image) => (
                <img
                  key={image}
                  src={image}
                  alt="Galeria convenio UGB"
                  className="h-44 w-full object-cover rounded-xl shadow"
                />
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
