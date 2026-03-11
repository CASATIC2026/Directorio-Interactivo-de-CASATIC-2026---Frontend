import { Eye, Target, Trophy } from 'lucide-react';
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import slide1 from '../public/img/usaid del pueblo de usaid.png';
import slide2 from '../public/img/giz2-1.png';
import slide3 from '../public/img/witsa2.png';
import slide4 from '../public/img/ales2.png';
import slide5 from '../public/img/aleti logo.png';

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

  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

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
<section className="py-16 bg-slate-50 bg-blue-800">

  <div className="max-w-6xl mx-auto px-4 text-center">

    {/* Título */}
    <h2 className="text-3xl md:text-4xl font-bold text-white mb-2 tracking-tight">
     Alianzas internacionales
    </h2>

    <p className="text-1x1 md:text-1x1 font-bold text-white mb-2 tracking-tight">
      Organizaciones y aliados que apoyan el desarrollo tecnológico, brindan 
    </p>

    {/* Slider o proveedores del area */}
    <div className="relative h-[300px] bg-white rounded-2xl shadow-lg overflow-hidden flex items-center justify-center">

      {slides.map((slide, index) => (
        <a
          key={index}
          href={slide.link}
          target="_blank"
          rel="noopener noreferrer"
          className={`absolute transition-opacity duration-1000 ${
            index === currentSlide ? "opacity-1000" : "opacity-0"
          }`}
        >
          <img
            src={slide.img}
            alt="proveedor"
            className="max-h-[180px] object-contain hover:scale-105 transition-transform duration-300"
          />
        </a>
      ))}

    </div>

  </div>

</section>

    </div>
  );
}