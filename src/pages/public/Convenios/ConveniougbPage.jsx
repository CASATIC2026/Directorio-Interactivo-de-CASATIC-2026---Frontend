import { Lightbulb, TrendingUp, Award, Users } from 'lucide-react';
import casaticLogo from '../../public/img/Reverse - v4@4x.png';

export default function ConvenioInnovacionPage() {
  const features = [
    { title:'CONVENIO DE COOPERACIÓN ENTRE LA SECRETARÍA DE INNOVACIÓN DE LA PRESIDENCIA Y CASATIC',
      description: 'Con el objetivo de que ambas partes fomenten, faciliten, promuevan y emprendan actividades conjuntas que contribuyan a fomentar y potenciar la Innovación, las Tecnologías de Información y Comunicación, la Investigación, así como la modernización del Estado, garantizando la inclusión y la reducción de la brecha digital, con el fin de coadyuvar a la ejecución de los proyectos estratégicos de país desde la empresa privada, en conjunto con la Secretaría de Innovación de la Presidencia, y los participantes de todos los sectores',},
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
            Convenio con Secretaria<span className="text-gradient-accent">Negocios</span>
          </h1>
          <p className="text-base sm:text-lg text-casatic-200 leading-relaxed max-w-2xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            Promovemos la innovación tecnológica como motor de desarrollo para las empresas del sector TIC en El Salvador.
          </p>
        </div>
      </section>
      

   
        <div className="bg-mesh">
     <div 
  className="max-w-6xl mx-auto px-10 sm:px-10 lg:px-12 py-40 bg-cover bg-center"
  style={{ backgroundImage: `url(${casaticLogo1})` }}
>
          <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
            <img src={casaticLogo1} alt="CASATIC" className="h-200 w-auto object-contain mb-20" />
            {features.map((feature, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-elevated p-10 hover:scale-[1.04] transition-all duration-300 text-justify">
             
                <h3 className="text-lg font-semibold text-surface-900 mb-9 text-center">{feature.title}</h3>
                <p className="text-surface-600 text-justify">{feature.description}</p>
             <div className="flex justify-center items-center gap-6">
  <img src={casaticLogo2} alt="CASATIC" className="h-20" />
  <img src={casaticLogo3} alt="CASATIC" className="h-20" />
  <img src={casaticLogo4} alt="CASATIC" className="h-20" />
</div>
              </div>
            ))}
            
          </div>
        </div>
        
      </div>
    </div>
  );
}