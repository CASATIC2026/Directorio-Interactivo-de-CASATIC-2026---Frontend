import { Lightbulb, TrendingUp, Award, Users } from 'lucide-react';
import casaticLogo from '../../public/img/Reverse - v4@4x.png';
import proyecto1 from '../img/imagenes convenio/proyecto1.jpg';
import proyecto2 from '../img/imagenes convenio/proyecto2.jpg';
import proyecto3 from '../img/imagenes convenio/proyecto3.jpg';

export default function ConvenioInnovacionPage() {
  const features = [
    { title:'CONVENIO DE COOPERACIÓN ENTRE CASATIC Y EL COMITÉ DE PROYECCIÓN SOCIAL EL SALVADOR.',
      description: 'Con el objetivo de promover la cooperación interinstitucional en aras de fortalecer el desarrollo de ambas instituciones en temas de desarrollo de programas y proyectos de formación en beneficio del interés social, estrechar vínculos y establecer modalidades de cooperación entre CASATIC y EL COMITÉ.',},
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
            Convenio con Proyección<span className="text-gradient-accent"> Social</span>
          </h1>
          
        </div>
      </section>
      

   
        <div className="bg-mesh">
     <div 
  className="max-w-6xl mx-auto px-10 sm:px-10 lg:px-12 py-40 bg-cover bg-center"

>

          <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
            <img src={proyecto1} alt="CASATIC" className="h-200 w-auto object-contain mb-20 items-center" />
            {features.map((feature, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-elevated p-10 hover:scale-[1.04] transition-all duration-300 text-justify">
             
                <h3 className="text-lg font-semibold text-surface-900 mb-9 text-center">{feature.title}</h3>
                <p className="text-surface-600 text-justify">{feature.description}</p>
             <div className="flex justify-center items-center gap-6">
  <img src={proyecto2} alt="CASATIC" className="h-44" />
  <img src={proyecto3} alt="CASATIC" className="h-44" />

</div>
              </div>
            ))}
            
          </div>
        </div>
        
      </div>
    </div>
  );
}