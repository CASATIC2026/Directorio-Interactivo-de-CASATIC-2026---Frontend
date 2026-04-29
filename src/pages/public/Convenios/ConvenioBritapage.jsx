import { Lightbulb, TrendingUp, Award, Users } from 'lucide-react';
import casaticLogo from '../../public/img/Reverse - v4@4x.png';
import britanico1 from '../img/imagenes convenio/britanico1.jpg';
import britanico2 from '../img/imagenes convenio/britanico2.jpg';
import britanico3 from '../img/imagenes convenio/britanico3.jpg';
import britanico4 from '../img/imagenes convenio/britanico4.jpg';

export default function ConvenioBritapage() {
  const features = [
    {
      title:'CONVENIO DE COOPERACIÓN ENTRE LA CÁMARA DE COMERCIO BRITÁNICO Y CASATIC',
 description: 'El Comité de Promoción de Negocios trabaja buscando el acercamiento de oportunidades comerciales que favorezcan el crecimiento del sector y el posicionamiento de las TIC como factor clave para el desarrollo del país y la competitividad empresarial.' },
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
            Convenio Camara de Comercio<span className="text-gradient-accent">Britanico</span>
          </h1>
         
        </div>
      </section>

   
      <div className="bg-mesh">
         <div 
      className="max-w-6xl mx-auto px-10 sm:px-10 lg:px-12 py-40 bg-cover bg-center"
      style={{ backgroundImage: `url(${britanico1})` }}
    >
              <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
        <div className="p-[3px] rounded-3xl bg-gradient-to-r from-casatic-500 via-accent-500 to-casatic-600 max-w-6xl mx-auto shadow-2xl">
<div className="p-[4px] rounded-2xl bg-green-800 max-w-6xl mx-auto shadow-lg">
  <img 
    src={britanico1} 
    alt="BRITANICO" 
    className="rounded-2xl w-full object-cover"
  />
</div>
</div>
                {features.map((feature, index) => (
                  <div key={index} className="bg-white rounded-2xl shadow-elevated p-10 hover:scale-[1.04] transition-all duration-300 text-justify">
                 
                    <h3 className="text-lg font-semibold text-surface-900 mb-9 text-center">{feature.title}</h3>
                    <p className="text-surface-600 text-justify">{feature.description}</p>
                 <div className="flex justify-center items-center gap-6">
      <img src={britanico2} alt="BRITANICO" className="h-20" />
      <img src={britanico3} alt="BRITANICO" className="h-20" />
      <img src={britanico4} alt="BRITANICO" className="h-20" />
    </div>
                  </div>
                ))}
                
              </div>
            </div>
            
          </div>
    </div>
  );
}