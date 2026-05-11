import { useState } from 'react';
import { Grid3X3 } from 'lucide-react';
import imagenboletin from '../public/pdf/boletin csasatic.png';
import boletin2021 from '../public/pdf/boletin 2021.pdf';
import boletin2022 from '../public/pdf/boletin 2022.pdf';
import plandeeventos from '../public/pdf/Plan de Eventos 2021 - 17FEB.pdf';
import planEventos2021 from '../public/pdf/PLan casatic.pdf';
const boletines = [
  {
    clave: 'boletin2021',
    titulo: 'Boletín 2021',
    descripcion: 'Publicaciones y noticias correspondientes al año 2021.',
    imagen: imagenboletin,
    pdf: boletin2021,
    links: [
      { nombre: 'Calendario 2021', url: '#' },
      { nombre: 'Galería 2021', url: '#' },
      { nombre: 'Contacto', url: '#' },
    ],
  },
  {
    clave: 'boletin2022',
    titulo: 'Boletín 2022',
    descripcion: 'Publicaciones y noticias correspondientes al año 2022.',
    imagen: imagenboletin,
    pdf: boletin2022,
    links: [
      { nombre: 'Calendario 2022', url: '#' },
      { nombre: 'Galería 2022', url: '#' },
      { nombre: 'Contacto', url: '#' },
    ],
  },
  {
    clave: 'planEventos',
    titulo: 'Plan de Eventos',
    descripcion: 'Programación general de actividades y eventos de CASATIC.',
    imagen: imagenboletin,
    pdf: plandeeventos,
    links: [
      { nombre: 'Cronograma', url: '#' },
      { nombre: 'Descargas', url: '#' },
      { nombre: 'Contacto', url: '#' },
    ],
  },
  {
    clave: 'planEventos2021',
    titulo: 'Plan de Eventos CasaTIC 2021',
    descripcion: 'Plan anual de actividades desarrollado durante 2021.',
    imagen: imagenboletin,
    pdf: planEventos2021,
    links: [
      { nombre: 'Agenda 2021', url: '#' },
      { nombre: 'Galería', url: '#' },
      { nombre: 'Contacto', url: '#' },
    ],
  },
];

export default function CategoriasPage() {
  const [seleccionado, setSeleccionado] = useState(boletines[0]);

  return (
    <div className="bg-gray-50 min-h-screen pb-16">
      {/* Banner */}
      <div className="bg-gradient-to-br from-casatic-700 via-casatic-800 to-surface-900 text-white py-14 sm:py-20 relative overflow-hidden">
        <div className="relative max-w-5xl mx-auto px-4 text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-white/10 rounded-2xl mb-4">
            <Grid3X3 size={28} className="text-casatic-200" />
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-3">
            Boletines de CASATIC
          </h1>

          <p className="text-casatic-200 text-base sm:text-lg max-w-xl mx-auto">
            Descubre noticias, documentos y recursos importantes.
          </p>
        </div>
      </div>

      {/* Contenido */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        {/* Título */}
        <div className="text-center mb-10">
          <h2 className="text-4xl font-extrabold text-gray-800 mb-3">
            Boletines
          </h2>
          <p className="text-gray-600 max-w-3xl mx-auto">
            Selecciona un boletín para visualizar su información y descargar el
            documento PDF.
          </p>
        </div>

        {/* Layout principal */}
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Menú lateral */}
          <aside className="lg:col-span-1">
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
              {boletines.map((item) => (
                <button
                  key={item.clave}
                  onClick={() => setSeleccionado(item)}
                  className={`w-full text-left px-6 py-4 border-b font-semibold transition ${
                    seleccionado.clave === item.clave
                      ? 'bg-blue-100 text-blue-700'
                      : 'hover:bg-blue-50 text-gray-700'
                  }`}
                >
                  📄 {item.titulo}
                </button>
              ))}
            </div>
          </aside>

          {/* Área principal */}
          <div className="lg:col-span-3">
            <div className="grid md:grid-cols-3 gap-6">
              {/* Imagen y descripción */}
              <div className="md:col-span-2 bg-white rounded-3xl shadow-xl overflow-hidden">
                <img
                  src={seleccionado.imagen}
                  alt={seleccionado.titulo}
                  className="w-full h-72 object-cover"
                />

                <div className="p-8">
                  <h3 className="text-3xl font-bold text-gray-800 mb-4">
                    {seleccionado.titulo}
                  </h3>

                  <p className="text-gray-600 leading-relaxed">
                    {seleccionado.descripcion}
                  </p>

                  <a
                    href={seleccionado.pdf}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center mt-6 px-6 py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition"
                  >
                    📄 Descargar PDF
                  </a>
                </div>
              </div>

              {/* Enlaces relacionados */}
              <aside className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-3xl shadow-xl p-6">
                <h4 className="text-xl font-bold mb-5">
                  Enlaces Relacionados
                </h4>

                <div className="space-y-3">
                  {seleccionado.links.map((link, index) => (
                    <a
                      key={index}
                      href={link.url}
                      className="block bg-white/10 hover:bg-white/20 rounded-xl px-4 py-3 transition"
                    >
                      🔗 {link.nombre}
                    </a>
                  ))}
                </div>
              </aside>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}