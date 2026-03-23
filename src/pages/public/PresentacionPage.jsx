import { Eye, Target, Trophy } from 'lucide-react';
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import reunion from '../public/img/imagenes referentes a nuevos iconos,fondos etc/reunion 2 .0.png';
import reunion2 from './img/imagenes referentes a nuevos iconos,fondos etc/imagen mision 2.0.png'
import reunion3 from './img/imagenes referentes a nuevos iconos,fondos etc/reuniones globales.jpg'

import casaticLogo from './img/Reverse - v2@4x.png'

import slide1 from '../public/img/alianzas internacionales/world vision.png';
import slide2 from '../public/img/alianzas internacionales/usaid.png';
import slide3 from '../public/img/alianzas internacionales/proesa organismo promotor de exportaciones e inversiones de el salvador.png';
import slide4 from '../public/img/alianzas internacionales/pnud.png';
import slide5 from '../public/img/alianzas internacionales/oportunidades gloria de kriete.png';
import slide6 from '../public/img/alianzas internacionales/junior achievement.png';
import slide7 from '../public/img/alianzas internacionales/gobierno de el salvador.png';
import slide8 from '../public/img/alianzas internacionales/fusades fundacion salvadoreña para el desarrollo economico y social.png';
import slide9 from '../public/img/alianzas internacionales/fundacion gloria kriete.png';
import slide10 from '../public/img/alianzas internacionales/dica direccion de innovacion y calidad.png';

import slide11 from '../public/img/alianzas internacionales/comite de proyecion social de el salvador.png';
import slide12 from '../public/img/alianzas internacionales/club tic.png';
import slide13 from '../public/img/alianzas internacionales/camarasal.png';
import slide14 from '../public/img/alianzas internacionales/camara de comercio britanico salvadoreño.png';
import slide15 from '../public/img/alianzas internacionales/bin lab banco interamericano de desaroolo bib labv.png';
import slide16 from '../public/img/alianzas internacionales/bandesal.png';
import slide17 from '../public/img/alianzas internacionales/asi a no asi a no.png';
import slide18 from '../public/img/alianzas internacionales/althes asciacion de lideres del talento humano de el salvador.png';
import slide19 from '../public/img/alianzas internacionales/aleti impulsamos la transformacion digital.png';
import slide20 from '../public/img/alianzas internacionales/ales.png';


import imagen1 from './img/socios e inversionistas/usam universidad alberto masferrer.png';
import imagen2 from './img/socios e inversionistas/unplug studio.png';
import imagen3 from './img/socios e inversionistas/univo.png';
import imagen4 from './img/socios e inversionistas/universidad pedagogica.png';
import imagen5 from './img/socios e inversionistas/universidad matias elgado.png';
import imagen6 from './img/socios e inversionistas/universidad gerardo barrios.png';
import imagen7 from './img/socios e inversionistas/universidad francisco gavidia.png';
import imagen8 from './img/socios e inversionistas/universidad evangelica de el salvador.png';
import imagen9 from './img/socios e inversionistas/tbox.png';
import imagen10 from './img/socios e inversionistas/svnet.png';
import imagen11 from './img/socios e inversionistas/soluciones sofis.png';
import imagen12 from './img/socios e inversionistas/simplexo.png';
import imagen13 from './img/socios e inversionistas/santillana.png';
import imagen14 from './img/socios e inversionistas/ricoh.png';
import imagen15 from './img/socios e inversionistas/qudox.png';
import imagen16 from './img/socios e inversionistas/pensertrust.png';
import imagen17 from './img/socios e inversionistas/pbs.png';
import imagen18 from './img/socios e inversionistas/OIP.webp';
import imagen19 from './img/socios e inversionistas/microsoft.png'
import imagen20 from './img/socios e inversionistas/localiza.png';
import imagen21 from './img/socios e inversionistas/legalitica.png';
import imagen22 from './img/socios e inversionistas/la tecno universidad tecnologica.png';
import imagen23 from './img/socios e inversionistas/la red movil mas tigo.png';
import imagen24 from './img/socios e inversionistas/korinver.png';
import imagen25 from './img/socios e inversionistas/ja junior.png';
import imagen26 from './img/socios e inversionistas/itconsulting.png';
import imagen27 from './img/socios e inversionistas/it project.png';
import imagen28 from './img/socios e inversionistas/integra sap.png';
import imagen29 from './img/socios e inversionistas/innboxinnivation box.png';
import imagen30 from './img/socios e inversionistas/inevrsion es torrres.png';
import imagen31 from './img/socios e inversionistas/idigitalstudio.png';
import imagen32 from './img/socios e inversionistas/i-estrategias.png';
import imagen33 from './img/socios e inversionistas/gigauno.png';
import imagen34 from './img/socios e inversionistas/gd grupo.png';
import imagen35 from './img/socios e inversionistas/esfe agape.png';
import imagen36 from './img/socios e inversionistas/esen.png';
import imagen37 from './img/socios e inversionistas/eon_logo.png';
import imagen38 from './img/socios e inversionistas/elaniin tech compay.png';
import imagen39 from './img/socios e inversionistas/ejje.png';
import imagen40 from './img/socios e inversionistas/datum.png';
import imagen41 from './img/socios e inversionistas/data guard.png';
import imagen42 from './img/socios e inversionistas/creativa consultores.png';
import imagen43 from './img/socios e inversionistas/consisa.png';
import imagen44 from './img/socios e inversionistas/cass.png';
import imagen45 from './img/socios e inversionistas/casatic.png';
import imagen46 from './img/socios e inversionistas/bluenet.png';
import imagen47 from './img/socios e inversionistas/bit frameworks.png';
import imagen48 from './img/socios e inversionistas/bird consultores.png';
import imagen49 from './img/socios e inversionistas/asociasion conexion.png';
import imagen50 from './img/socios e inversionistas/aseinfo.png';
import imagen51 from './img/socios e inversionistas/arias-logo-240x180.png';
import imagen52 from './img/socios e inversionistas/aplaudo.png';
import imagen53 from './img/socios e inversionistas/aeegle.png';
import imagen54 from './img/socios e inversionistas/administracion y sistemas.png';
import imagen55 from './img/socios e inversionistas/acari.png';
import imagen56 from './img/socios e inversionistas/2tijobs.png'



export default function PresentacionPage() {


  const sections = [
    {
      id: 'vision',
      title: 'Nuestra Visión',
      icon: Eye,
      description:
        'Ser el referente necesario y reconocido en el sector de las tecnologías de la información y las comunicaciones a nivel nacional e internacional.',
        img:reunion,
    },
    {
      id: 'mision',
      title: 'Nuestra Misión',
      icon: Target,
      description:
        'Somos una organización sin fines de lucro que representa y promueve al sector TIC como motor de desarrollo de El Salvador.',
      details:
        'Buscamos ampliar y acercar las oportunidades que proporcionen la competitividad y el crecimiento del sector tecnológico.',
        img:reunion2,
    },
    {
      id: 'objetivos',
      title: 'Nuestros Objetivos',
      icon: Trophy,
      description:
        'Fomentar la excelencia profesional y promover la innovación tecnológica.',
      details: [
        'Programas de formación continua',
        'Networking entre empresas tecnológicas',
        'Promover tecnologías emergentes',
        'Impulsar el desarrollo económico tecnológico',
     
      ],img:reunion3,
    },
  ];

  /* SLIDER */
  const slides = [
    { img: slide1, link:"https://worldvision.org.sv/"},
    { img: slide2, link: "https://www.usaid.gov/" },
    { img: slide3, link: "https://www.proesa.gob.sv/" },
    { img: slide4, link:"https://www.sv.undp.org/content/el_salvador/es/home.html" },
    { img: slide5, link: "https://www.oportunidades.org.sv/" },
    {img:slide6, link:"https://jaelsalvador.org/"},
    { img:slide7, link:"https://www.presidencia.gob.sv/"},
    { img:slide8, link:"https://fusades.org/"},
    { img:slide9, link:"https://fundaciongloriakriete.org/"},
    { img:slide10, link:"http://dica.minec.gob.sv/home.html"},
    { img:slide11, link:"http://cpses.org/"},
   { img:slide12, link:"https://www.facebook.com/ClubTICSV/"},
    { img:slide13, link:"https://camarasal.com/"},
    { img:slide14, link:"https://industriaelsalvador.com/"},
    { img:slide15, link:"https://bidlab.org/es"},
    { img:slide16, link:"http://www.bandesal.gob.sv/"},
    { img:slide17, link:"https://industriaelsalvador.com/"},
    { img:slide18, link:"https://fb.com/AsociacionDeLideresDelTalentoHumanoDeElSalvador"},
    { img:slide19, link:"https://www.aleti.org/"},
    { img:slide20, link:"https://www.ales-lac.org/"},

  ];

  
   const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
const slidesPerView = 2;

useEffect(() => {
  const interval = setInterval(() => {
    setCurrentSlideIndex((prev) => (prev + slidesPerView) % slides.length);
  }, 3000);

  return () => clearInterval(interval);
}, []);

const visibleSlides = slides.slice(
  currentSlideIndex,
  currentSlideIndex + slidesPerView
);

      /* SLIDER */
  const imagenes = [
    { img: imagen1, link: "https://oig.usaid.gov/" },
    { img: imagen2, link: "https://gizcentroamerica.org/" },
    { img: imagen3, link: "https://www.witsa.org/" },
    { img: imagen4, link: "https://ales-lac.org/" },
   { img: imagen5, link: "https://www.bing.com/ck/a?!&&p=7d92c7b64a90e597286ae7d390c554924f89dc6451f5ff65fc63b917f7226a24JmltdHM9MTc3MzM2MDAwMA&ptn=3&ver=2&hsh=4&fclid=20aa1469-9121-6271-1a0c-021e90a763b0&psq=matias+delgado&u=a1aHR0cHM6Ly93d3cudWptZC5lZHUuc3Yv" },
    { img:imagen6, link: "https://ugb.edu.sv/"},
    { img:imagen7, link:"https://ufg.edu.sv/"},
    { img:imagen8, link:"https://www.uees.edu.sv/"},
    { img:imagen9, link:"https://www.tboxplanet.com/en/home"},
    { img:imagen10, link:"http://www.svnet.sv/"},
    { img:imagen11, link:"http://www.sofis-solutions.com/"},
    { img:imagen12, link:"https://www.simplexo.tech/"},
    { img:imagen13, link:"https://identity.santillanaconnect.com/login/"},
    { img:imagen14, link:"https://www.ricoh-americalatina.com/es"},
    { img:imagen15, link:"https://qudox.io/"},
    { img:imagen16, link:"http://pensertrust.com/sp/"},
    {img:imagen17, link:"https://www.grouppbs.com/"},
    { img:imagen18, link:"http://www.crecer.com.sv/"},
    { img:imagen19, link:"https://www.microsoft.com/es-sv/"},
    { img:imagen20, link:"http://localiza.com.sv/"},
    { img:imagen21, link:"https://legalitika.com/"},
    { img:imagen22 , link:"https://www.utec.edu.sv/"},
    { img:imagen23, link:"https://www.tigo.com.sv/"},
    { img:imagen24, link:"https://www.korinver.com/"},
    { img:imagen25, link:"https://jaelsalvador.org/"},
    { img:imagen26, link:"http://www.itconsultinglatam.com/"},
    { img:imagen27, link:"https://www.itproject41.com/"},
    { img:imagen28, link:"https://integrasap.com/sap"},
    { img:imagen29, link:"http://www.innbox.sv/"},
    { img:imagen30, link:"https://torres.legal/"},
    { img:imagen31, link:"https://idigitalstudios.com/"},
    { img:imagen32, link:"https://i-strategies.tech/"},
    { img:imagen33, link:"https://giga.uno/"},
    { img:imagen34, link:"http://www.grupogd.com.sv/"},
    { img:imagen35, link:"http://www.esfe.agape.edu.sv/"},
    { img:imagen36, link:"https://www.esen.edu.sv/"},
    { img:imagen37, link:"https://eonconsultant.com/"},
    { img:imagen38, link:"https://www.elaniin.com/"},
    { img:imagen39, link:"https://www.ejje.com/"},
    { img:imagen40, link:"https://www.datumredsoft.com/"},
    { img:imagen41, link:"http://www.dataguard.com.sv/"},

    { img:imagen42, link:"https://creativaconsultores.com/"},
    { img:imagen43, link:"http://www.consisa.com/"},
    { img:imagen44, link:"http://www.ca2s.com/?lang=en"},
    { img:imagen45, link:"https://casatic.org/"},
    { img:imagen46, link:"http://www.blue.net.gt/"},
    { img:imagen47, link:"https://www.bitframeworks.com/"},
    { img:imagen48, link:"http://bird.com.sv/"},
    { img:imagen49, link:"http://www.conexion.sv/"},
    { img:imagen50, link:"http://www.aseinfo.com.sv/index.html"},
    { img:imagen51, link:"https://ariaslaw.com/"},
    { img:imagen52, link:"http://www.applaudostudios.com/"},
    { img:imagen53, link:"http://www.aeegle.com/"},
    { img:imagen54, link:"http://www.ayssa.net/"},
    { img:imagen55, link:"https://www.aracaristudios.com/"},
    { img:imagen56, link:"https://www.2itjobs.com/"},


  ];
  const[currentIndex,setCurrentIndex]=useState(0);
  const itemsPerView=4;
  useEffect(() => {
    const interval=setInterval(()=>{
      setCurrentIndex((prev)=>(prev + itemsPerView) % imagenes.length);

    },3000);
     return () => clearInterval(interval);
  }, []);
  const visibleImagenes=imagenes.slice(currentIndex,
    currentIndex +  itemsPerView
  );
  
  return (
    <div className="bg-white overflow-x-hidden">

      {/* HEADER */}
      {/* HEADER */}
<div className="relative overflow-hidden bg-gradient-to-br from-casatic-700 via-casatic-800 to-surface-900 py-20 sm:py-24 lg:py-32">

  {/* Fondo decorativo */}
  <div className="absolute inset-0 bg-grid opacity-10 pointer-events-none" />
  <div className="absolute top-[-60px] right-[-60px] w-96 h-96 bg-casatic-500/20 rounded-full blur-3xl" />
  <div className="absolute bottom-[-60px] left-[-60px] w-80 h-80 bg-accent-500/10 rounded-full blur-3xl" />

  <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

    <div className="flex flex-col items-center text-center">

      {/* Logo */}
      <img 
        src={casaticLogo} 
        alt="CASATIC" 
        className="h-16 mb-6 object-contain"
      />

      {/* Título */}
      <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.2rem] font-extrabold text-white leading-tight tracking-tight max-w-4xl">
        Cámara Salvadoreña de Tecnologías de la Información y la Comunicación
      </h1>

      {/* Descripción */}
      <p className="mt-6 text-base sm:text-lg md:text-xl text-white/80 max-w-3xl leading-relaxed">
        Es una asociación sin fines de lucro que agrupa a entidades del sector TIC en el país, 
        con el objetivo de promover el desarrollo tecnológico en El Salvador.
      </p>

    </div>
  </div>
</div>

      {/* SLIDER */}
<section className="py-10 bg-white rounded-2xl shadow-lg overflow-hidden flex items-center justify-center">

  <div className="max-w-6xl mx-auto px-4 text-center">

    {/* Título */}
    <h2 className="text-3xl md:text-4xl font-bold text-grey-700 mb-2 tracking-tight">
    ALIANZAS INTERNACIONALES
    </h2>

    <p className="text-surface-600 from-text-gradient mb-4">
      Organizaciones y aliados que apoyan el desarrollo tecnológico
    </p>
<br></br>
   {/* Slider o proveedores del area */}
    <div className="flex justify-center gap-10 items-center">

      {visibleSlides.map((slide, index) =>{
        const isExternal=slide.link.startsWith("http");
        return isExternal ? (
        <a
          key={index}
          href={slide.link}
          target="_blank"
          rel="noopener noreferrer"
          
        >
          <img
            src={slide.img}
            alt="proveedor"
            className="max-h-[180px] object-contain hover:scale-105 transition-transform duration-300"
          />
        </a>
        ):(
          <Link key={index} to={slide.link}>
            <img
            src={slide.img}
            className='h-[120px] object-contain hover:scale-110 transition'/>
          </Link>);
      })}

    </div>

  </div>

</section><br></br><br></br>
<section className="py-10 bg-white rounded-2xl shadow-lg overflow-hidden flex items-center justify-center">

  <div className="max-w-6xl mx-auto px-4 text-center">

    {/* Título */}
    <h2 className="text-3xl md:text-4xl font-bold text-grey-700 mb-2 tracking-tight">
    SOCIOS Y PROVEEDORES DE CASATIC

    </h2>

    <p className="text-surface-600 from-text-gradient mb-4">
      Socios aliados y clientes satisfechos por servisios relizados
    </p>
<br></br>
    {/* Slider o proveedores del area */}
    <div className="flex justify-center gap-10 items-center">

      {visibleImagenes.map((imagen, index) =>{
        const isExternal=imagen.link.startsWith("http");
        return isExternal ? (
        <a
          key={index}
          href={imagen.link}
          target="_blank"
          rel="noopener noreferrer"
          
        >
          <img
            src={imagen.img}
            alt="proveedor"
            className="max-h-[180px] object-contain hover:scale-105 transition-transform duration-300"
          />
        </a>
        ):(
          <Link key={index} to={imagen.link}>
            <img
            src={imagen.img}
            className='h-[120px] object-contain hover:scale-110 transition'/>
          </Link>);
      })}

    </div>

  </div>

</section><br></br><br></br>

    </div>
  );
}