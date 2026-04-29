import { Lightbulb, TrendingUp, Award, Users } from 'lucide-react';
import casaticLogo from '../../public/img/Reverse - v4@4x.png';

export default function ExportacionPage() {
  const features = [
    { description: 'El Comité de Promoción de Negocios trabaja buscando el acercamiento de oportunidades comerciales que favorezcan el crecimiento del sector y el posicionamiento de las TIC como factor clave para el desarrollo del país y la competitividad empresarial.' },
    { description: 'La promoción de negocios es uno de los objetivos más importantes de CASATIC, para favorecer al crecimiento del sector TIC del país y especialmente, para aportar a su inserción exitosa en mercados internacionales.' },
    { description: 'En este sentido, se busca trabajar de lleno en la creación de herramientas, eventos, acercamientos entre empresas del sector TIC y empresas multisectoriales, así como con alianzas a nivel regional para propiciar la internacionalización. Fomentamos la participación en actividades de promoción comercial, además de la distribución y difusión de estudios de mercado de la demanda internacional de productos y servicios del sector.' },
    { description: 'CASATIC tiene como objetivo que los negocios generen riqueza, oportunidades y valor para los ciudadanos.' },
  ];

  return (
    <div className="bg-white">
   
         {/* HEADER */}
         <section className="relative overflow-hidden bg-gradient-to-br from-casatic-700 via-casatic-800 to-surface-900 py-1 sm:py-1">
           <div className="absolute inset-0 bg-grid opacity-10 pointer-events-none" />
           <div className="absolute -top-40 -right-40 w-96 h-96 bg-casatic-500/20 rounded-full blur-3xl pointer-events-none" />
           <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-accent-500/10 rounded-full blur-3xl pointer-events-none" />
   
   
             <div className=" text-center ">
                     <img src={casaticLogo} alt="CASATIC" className="h-16 w-auto object-contain mb-1 mx-1 " />
                     <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-casatic-300 bg-white/10 px-3 py-1.5 rounded-full mb-5 animate-fade-in-up">
                       <span className="w-1.5 h-1.5 rounded-full bg-accent-400 animate-pulse-soft" />
                       Directorio Interactivo CASATIC
                     </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-4 animate-fade-in-up">
            Exportación y <span className="text-gradient-accent">Negocios</span>
          </h1>
          <p className="text-base sm:text-lg text-casatic-200 leading-relaxed max-w-2xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            Promovemos la innovación tecnológica como motor de desarrollo para las empresas del sector TIC en El Salvador.
          </p>
        </div>
      </section>

   
        <div className="bg-mesh">
        <div className="max-w-6xl mx-auto px-10 sm:px-10 lg:px-12 py-40">
          <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
            {features.map((feature, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-elevated p-10 hover:scale-[1.04] transition-all duration-300 text-justify">
               
                <h3 className="text-lg font-semibold text-surface-900 mb-2">{feature.title}</h3>
                <p className="text-surface-600 text-justify">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}