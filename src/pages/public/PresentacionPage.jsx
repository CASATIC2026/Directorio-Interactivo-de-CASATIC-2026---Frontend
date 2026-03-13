import { Eye, Target, Trophy } from 'lucide-react';
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import slide1 from '../public/img/usaid del pueblo de usaid.png';
import slide2 from '../public/img/giz2-1.png';
import slide3 from '../public/img/witsa2.png';
import slide4 from '../public/img/ales2.png';
import slide5 from '../public/img/aleti logo.png';

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
import imagen21 from './img/socios e inversionistas/legalitica.png'

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
        'Somos una organización sin fines de lucro que representa y promueve al sector TIC como motor de desarrollo de El Salvador.',
      details:
        'Buscamos ampliar y acercar las oportunidades que proporcionen la competitividad y el crecimiento del sector tecnológico.',
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
      ],
    },
  ];

  /* SLIDER */
  const slides = [
    { img: slide1, link: "https://oig.usaid.gov/" },
    { img: slide2, link: "https://gizcentroamerica.org/" },
    { img: slide3, link: "https://www.witsa.org/" },
    { img: slide4, link: "https://ales-lac.org/" },
    { img: slide5, link: "/backend" }
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
    <div className="bg-mesh min-h-screen">

      {/* HEADER */}
      <div className="bg-gradient-to-br from-casatic-700 via-casatic-800 to-surface-900 text-white py-16 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Presentación CASATIC
        </h1>
        <p className="text-lg text-white/90 max-w-2xl mx-auto">
          Conoce nuestra visión, misión y objetivos
        </p>
      </div>

      {/* SECCIONES */}
      <div className="max-w-7xl mx-auto px-4 py-12 space-y-16">
        {sections.map((sec) => {
          const Icon = sec.icon;

          return (
            <div
              key={sec.id}
              className="bg-white rounded-2xl shadow-lg p-8 flex flex-col md:flex-row items-center gap-6"
            >
              <Icon size={48} className="text-casatic-600" />

              <div>
                <h2 className="text-2xl font-bold mb-4">{sec.title}</h2>

                <p className="text-surface-600 mb-4">
                  {sec.description}
                </p>

                {Array.isArray(sec.details) ? (
                  <ul className="list-disc pl-5 space-y-2">
                    {sec.details.map((d, i) => (
                      <li key={i}>{d}</li>
                    ))}
                  </ul>
                ) : sec.details ? (
                  <p>{sec.details}</p>
                ) : null}
              </div>

            </div>
          );
        })}
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