
import { Link } from 'react-router-dom';

import { useState, useEffect } from 'react';
import api from '../../api/client';
import icono1 from '../public/img/busquedainteligente.png'
import icono2 from '../public/img/gestionsegura.png'
import icono3 from '../public/img/conexionempresarial.png'
import {
  Search, Building2, Check, Globe, ShieldCheck, ArrowRight, Users, BarChart3,Crown,ChevronLeft,ChevronRight,User,
 

} from 'lucide-react';
import casaticLogo from '../../img/Reverse - v3@4x.png';
import { useNavigate } from 'react-router-dom';
import casatic1 from './img/imagenes casatic/ChatGPT Image 27 abr 2026, 15_48_16.png';
import membresia from './img/MEMBRESIA CASATIC.png';


//*]*//*  uso de clip´s para ir a otra pagina en la carpeto convenios de casatic *//*]*/

const features = [
  {
    icon: Search,
    title: 'Búsqueda Avanzada',
    desc: 'Encuentra socios por especialidad, sector o nombre con filtros potentes.',
    color: 'bg-casatic-50 text-casatic-600',
    
    link:"/categorias"
  },
  {
    icon: Globe,
    title: 'Información Completa',
    desc: 'Perfiles detallados con sitios web, contactos y descripciones.',
    color: 'bg-accent-50 text-accent-600',

    link:"/directorio"
  },
  {
    icon: ShieldCheck,
    title: 'Datos Verificados',
    desc: 'Información confiable y actualizada de socios registrados.',
    color: 'bg-purple-50 text-purple-600',
   
  },
];

export default function HomePage() {
    const [total, setTotal] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    api.get('/directorio?page=1&pageSize=1')
      .then((res) => setTotal(res.data.total))
      .catch(() => {});
  }, []);


  const navigate = useNavigate();

  const handleClick = (item) => {
    if (item.route) {
      navigate(item.route);
    } else if (item.url) {
      window.open(item.url, '_blank');
    }
  };


  // Imágenes del carousel con título y link
const images = [
  {
    route: "/convenio_innovacion",
    title: "Convenio con la Secretaría de Innovación",
    img: "https://www.casatic.org/images/FOTOS%20CONVENIOS/CONVENIO%20CON%20SECRETAR%C3%8DA%20DE%20INNOVACI%C3%93N/convenio%204%20secretaria.jpg",
  },
  {
    route: "/convenio_brita",
    title: "Convenio con la Cámara de Comercio Británica",
    img: "https://www.casatic.org/images/FOTOS%20CONVENIOS/CONVENIO%20CAMARA%20DE%20COMERCIO%20BRITANICO/convenio%202.jpg",
  },
  {
    route: "/convenio_proyeccion",
    title: "Convenio con la Universidad de El Salvador",
    img: "https://www.casatic.org/images/FOTOS%20CONVENIOS/CONVENIO%20CON%20PROYECCI%C3%93N%20SOCIAL/proyeccion%20social%202.jpg"
  },
  {
    route: "/convenio_ugb",
    title: "Convenio con UGB",
    img: "https://www.casatic.org/images/FOTOS%20CONVENIOS/CONVENIO%20UNIVERSIDAD%20GERARDO%20BARRIOS/convenio%20ugb%203.jpg"
  },
  {
    route: "/convenio_uo",
    title: "Convenio con UNIVO",
    img: "https://www.casatic.org/images/FOTOS%20CONVENIOS/UNIVERSIDAD%20DE%20ORIENTE/convenio%20univo%204.jpg"
  }
];

  const prevSlide = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? images.length - 1 : prev - 1
    );
  };

  const nextSlide = () => {
    setCurrentIndex((prev) =>
      prev === images.length - 1 ? 0 : prev + 1
    );
  };


  return (
    <div className="bg-white overflow-x-hidden">

      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-casatic-700 via-casatic-800 to-surface-900 py-16 sm:py-24 lg:py-32">
        {/* Decorative blobs */}
        <div className="absolute inset-0 bg-grid opacity-10 pointer-events-none" />
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-casatic-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-accent-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">

            {/* Copy */}
            <div className="text-center lg:text-left animate-fade-in-up">
              <img src={casaticLogo} alt="CASATIC" className="h-12 w-auto object-contain mb-5 mx-auto lg:mx-0" />
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
                  className="btn-primary btn-lg shadow-xl shadow-casatic-700/40 hover:shadow-casatic-600/50 hover:scale-105 hover:shadow-2xl transition-all duration-300"
                >
                  Explorar Directorio <ArrowRight size={18} />
                </Link>
                <Link
                  to="/login"
                  className="btn btn-lg bg-white/10 text-white border border-white/20 hover:bg-white/20 backdrop-blur-sm shadow-xl hover:scale-105 hover:shadow-2xl transition-all duration-300"
                >
                  Iniciar Sesión
                </Link>
              </div>
            </div>

            {/* Visual card */}
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
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 sm:gap-10 text-center">
            <div>
              <p className="text-2xl sm:text-3xl font-extrabold text-white">{total}+</p>
              <p className="text-casatic-200 text-sm mt-0.5">Socios registrados</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-extrabold text-white">25+</p>
              <p className="text-casatic-200 text-sm mt-0.5">Especialidades</p>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <p className="text-2xl sm:text-3xl font-extrabold text-white">100%</p>
              <p className="text-casatic-200 text-sm mt-0.5">Verificado</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Features ────────────────────────────────────── */}
      {/* ── cuadricula de caracteristicas ───────────────────────────────── */}
      <section className="py-20 bg-gradient-to-br from-[rgb(254, 255, 255)] to-[#1e3a8a] ">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-surface-900 tracking-tight mb-4">
              Todo lo que necesitas en un
              <span className="text-accent-400 text-gradient"> solo lugar</span>
            </h2>
            <p className="bg-blue-200/50 inline-block text-lg text-gray-600 px-4 py-2 rounded-lg">
              Una plataforma moderna para conectar empresas de tecnología con quienes necesitan sus servicios.
            </p>
          </div>
          {/*--------------------cuadro de menus de casatic --------------*/}
     <div className="grid grid-cols-1 md:grid-cols-3 gap-6  max-w-4xl mx-auto">

      {/* Imagen si existe */}
     {features.map((f, i) => (
  <div key={i}        className="bg-white/20 backdrop-blur-lg border border-white/30 rounded-3xl p-8 shadow-xl text-center transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-2xl">

    {f.img && (
      <img
        src={f.img}
        alt={f.title}
  
        className="w-40 mx-auto mb-4  "
      />
    )}

    {f.img2 && (
      <img
        src={f.img2}
        alt={f.title}
        className="w-40 mx-auto mb-4"
      />
    )}

    <h3 className="font-bold text-lg mb-2">
      {f.title}
    </h3>

    <p className="text-sm text-gray-600 mb-4">
      {f.desc}
    </p>

    {f.link && (
     <Link to={f.link} className="text-blue-600 font-semibold hover:underline">
  Ver más
</Link>
    )}

  </div>
))}
  </div>
  </div>
  </section>

  { /*--------------------EJES ESTRATEGICOS ACTUALIZADOS  --------------*/}
        <section className="py-20 bg-gradient-to-br from-[rgb(254, 255, 255)] to-[#1e3a8a] ">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-surface-900 tracking-tight mb-5">
              Ejes Estratégicos de{' '}
              <span className="text-blue-900 text-gradient">CASATIC</span>
            </h2>
            <div className="flex items-center gap-2 justify-center">
   <Link to="/Politicaspublicas" className="flex items-center gap-2 justify-center group">
  <Crown className="text-gray-400 w-6 h-6 group-hover:text-blue-600" />
  <h3 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0b2a5a] tracking-tight group-hover:underline">
    POLÍTICAS PÚBLICAS
  </h3>
  </Link>
</div>
     

<div className="flex items-center gap-2 justify-center">
 <Link to="/exportacion" className="flex items-center gap-2 justify-center group">
  <Globe className="text-gray-400 w-6 h-6 group-hover:text-blue-600" />
  <h3 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0b2a5a] tracking-tight group-hover:underline">
    EXPORTACIÓN Y NEGOCIOS
  </h3>
  </Link>
</div>

<div className="flex items-center gap-2 justify-center">
 <Link to="/talentohumano" className="flex items-center gap-2 justify-center group">
  <Users className="text-gray-400 w-6 h-6 group-hover:text-blue-600" />
  <h3 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0b2a5a] tracking-tight group-hover:underline">
    TALENTO HUMANO
  </h3>
</Link>
</div>

             <div className="flex items-center gap-2 justify-center">
 <Link to="/innovacion" className="flex items-center gap-2 justify-center group">
  <BarChart3 className="text-gray-400 w-6 h-6 group-hover:text-blue-600" />
  <h3 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0b2a5a] tracking-tight group-hover:underline">
    INNOVACIÓN
  </h3>
</Link>
</div>
           </div>
        </div>

        </section>
{/* --------- convenios de casatic---------- */}

        <section className="py-10 bg-gradient-to-br from-[rgb(254, 255, 255)] to-[#1e3a8a] ">
         <div className="relative w-full max-w-3xl mx-auto overflow-hidden">
          <h2 className="text-3xl sm:text-4xl font-bold text-surface-900 tracking-tight mb-10 text-center">
              Convenios de{' '}
              <span className="text-blue-900 text-gradient">CASATIC</span>
            </h2>
      
      {/* Imagen con link */}
     <div
  className="w-full h-[500px] relative group cursor-pointer"
  onClick={() => handleClick(images[currentIndex])}
>
<img
  src={images[currentIndex].img}
  alt={images[currentIndex].title}
 
  className="w-full h-full object-cover rounded-xl"
/>

  {/* overlay con título */}
  <div className="absolute inset-0 flex items-center justify-center">
    <div className="bg-black/40 backdrop-blur-sm px-6 py-3 rounded-lg">
      <h3 className="text-white text-lg font-semibold text-center">
        {images[currentIndex].title}
      </h3>
    </div>
  </div>

      {/* Botón izquierda */}
     <button
  onClick={(e) => {
    e.stopPropagation();
    prevSlide();
  }}
  className="absolute top-1/2 left-4 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow"
>
  <ChevronLeft size={24} />
</button>

<button
  onClick={(e) => {
    e.stopPropagation();
    nextSlide();
  }}
  className="absolute top-1/2 right-4 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow"
>
  <ChevronRight size={24} />
</button>

        </div>
        </div>

        </section>
       <section className="py-20 bg-writer-200 ">
  <div className="max-w-5xl mx-auto px-4">
    
    <div className="w-full relative group cursor-pointer">
      <img
        src={casatic1}
        alt="CASATIC"
        className="w-full h-[300px] md:h-[500px] object-cover rounded-3xl"
      />
    </div>

  </div>
</section>


{/*           MEBRESIAS DE CASATIC*/}
<section className="py-10">
  <div className="max-w-10xl mx-auto px-4">

    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      
      {/* SOcios fundadores */}
      <div className="bg-white/10 backdrop-blur-md border border-black/20 rounded-3xl p-8 shadow-lg text-center hover:scale-105 transition">
        <img src={membresia} alt="CASATIC" className="w-70 h-80 mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">Socios fundadores</h2>
        <p className="text-xl font-semibold mb-2">$1,300</p><br></br>
        <p className="text-3x1 text-xl font-semibold mb-2 text-center">
          Empresas fundadoras de CASATIC <br /><br></br>
          CASATIC fue fundada en 2010 por más de 20 empresas TIC
        </p>
      </div>

      {/* socios miembros */}
      <div className="bg-white/10 backdrop-blur-md border border-black/20 rounded-3xl p-8 shadow-lg text-center hover:scale-105 transition">
        <img src={membresia} alt="CASATIC" className="w-70 h-80 mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">Socios miembros</h2>
        <p className="text-xl font-semibold mb-2">$400 - $1,200</p><br></br>
        <p className=" text-3xl text-xl font-semibold mb-2 text-center">
          Empresas del sector industrial, comercio, finanzas y servicios
        </p>
      </div>

      {/* socios invitados */}
      <div className="bg-white/10 backdrop-blur-md border border-black/20 rounded-3xl p-8 shadow-lg text-center hover:scale-105 transition">
        <img src={membresia} alt="CASATIC" className="w-70 h-80 mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">Socios invitados</h2>
        <p className="text-xl font-semibold mb-2">$25 - $100</p><br></br>
        <p className="text-3x1 text-xl font-semibold mb-2 text-center">
          Entidades con menos de 10 empleados pagan trimestralmente <br /><br></br>
          Multinacionales hacen un pago único
        </p>
      </div>

    </div>

    

  </div>
</section>

<section className="flex justify-center">
  <div className="bg-yellow-100 text-yellow-900 p-4 rounded-lg max-w-2xl w-full">
    
    <div className="flex items-center gap-2 mb-2">
      <Check className="text-green-600" />
      <h1 className="font-bold">PRECIOS NO INCLUYEN IVA</h1>
    </div>
    <div className="flex items-center gap-2 mb-2">
      <Check className="text-green-600" />
      <h1 className="font-bold">10% DE DESCUENTO SOBRE EL PAGO PARA SOCIOS QUE CANCELEN SUS CUOTAS ANUALES POR ADELANTADO </h1>
    </div>
    <div className="flex items-center gap-2 mb-2">
      <Check className="text-green-600" />
      <h1 className="font-bold">ENVIAR SIN EXCEPCIÓN COPIA DE SU NIT Y TARJETA DE IVA AL MOMENTO DE REMITIR EL FORMULARIO DE FORMA DE PAGO</h1>
    </div>
    <div className="flex items-center gap-2 mb-2">
      <Check className="text-green-600" />
      <h1 className="font-bold">AL AFILIARSE A CASATIC Y DESIGNAR UNA FORMA DE PAGO, AUTORIZA LA EMISIÓN DE CCD O FACTURA (SEGUN SEA EL CASO) PARA EL COBRO DE LA CUOTA MENSUAL,TRIMESTRAL Y/O ANUAL</h1>
    </div>


  </div>
</section>


      {/* ── CTA ─────────────────────────────────────────── */}
      <section className="py-16 sm:py-20 bg-white border-t border-surface-100">
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
