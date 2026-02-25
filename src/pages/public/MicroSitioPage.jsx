import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../api/client';
import {
  Building2, MapPin, Phone, Globe, Facebook, Linkedin, Twitter,
  Send, ArrowLeft, CheckCircle, ExternalLink, Mail, Tag, Briefcase
} from 'lucide-react';

export default function MicroSitioPage() {
  const { slug } = useParams();
  const [socio, setSocio] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api.get(`/directorio/socio/${slug}`)
      .then((res) => setSocio(res.data))
      .catch(() => setSocio(null))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Cargando información...</p>
        </div>
      </div>
    );
  }

  if (!socio) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Link to="/directorio" className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6">
          <ArrowLeft className="w-4 h-4" />
          Volver al Directorio
        </Link>
        <div className="text-center py-12">
          <Building2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Socio no encontrado</h2>
          <p className="text-gray-600">Lo sentimos, no pudimos encontrar la empresa solicitada.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back Button */}
      <Link to="/directorio" className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-8">
        <ArrowLeft className="w-4 h-4" />
        Volver al Directorio
      </Link>

      {/* Header */}
      <div className="bg-white rounded-xl shadow-md p-8 mb-8">
        <div className="grid md:grid-cols-4 gap-8 items-start">
          <div className="md:col-span-3">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{socio.nombre}</h1>
            {socio.especialidad && (
              <p className="text-blue-600 font-semibold flex items-center gap-2 mb-4">
                <Tag className="w-4 h-4" />
                {socio.especialidad}
              </p>
            )}
            {socio.descripcion && (
              <p className="text-gray-600 mb-6">{socio.descripcion}</p>
            )}

            {/* Contact Info */}
            <div className="space-y-3">
              {socio.ubicacion && (
                <div className="flex items-center gap-3 text-gray-700">
                  <MapPin className="w-5 h-5 text-blue-600 flex-shrink-0" />
                  <span>{socio.ubicacion}</span>
                </div>
              )}
              {socio.telefono && (
                <div className="flex items-center gap-3 text-gray-700">
                  <Phone className="w-5 h-5 text-blue-600 flex-shrink-0" />
                  <a href={`tel:${socio.telefono}`} className="hover:text-blue-600">
                    {socio.telefono}
                  </a>
                </div>
              )}
              {socio.email && (
                <div className="flex items-center gap-3 text-gray-700">
                  <Mail className="w-5 h-5 text-blue-600 flex-shrink-0" />
                  <a href={`mailto:${socio.email}`} className="hover:text-blue-600">
                    {socio.email}
                  </a>
                </div>
              )}
              {socio.sitio_web && (
                <div className="flex items-center gap-3">
                  <Globe className="w-5 h-5 text-blue-600 flex-shrink-0" />
                  <a
                    href={socio.sitio_web}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-700 flex items-center gap-1"
                  >
                    Visitar sitio web <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Logo/Icon */}
          <div className="flex justify-center">
            {socio.logo ? (
              <img src={socio.logo} alt={socio.nombre} className="w-24 h-24 object-contain" />
            ) : (
              <div className="w-24 h-24 bg-blue-100 rounded-lg flex items-center justify-center">
                <Building2 className="w-12 h-12 text-blue-600" />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid md:grid-cols-2 gap-8">
        {/* About */}
        {socio.detalle_negocios && (
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-blue-600" />
              Detalle del Negocio
            </h2>
            <p className="text-gray-700 leading-relaxed">{socio.detalle_negocios}</p>
          </div>
        )}

        {/* Social Media */}
        {(socio.facebook || socio.linkedin || socio.twitter) && (
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Redes Sociales</h2>
            <div className="space-y-3">
              {socio.facebook && (
                <a
                  href={socio.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-gray-700 hover:text-blue-600 transition"
                >
                  <Facebook className="w-5 h-5" />
                  Facebook
                </a>
              )}
              {socio.linkedin && (
                <a
                  href={socio.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-gray-700 hover:text-blue-600 transition"
                >
                  <Linkedin className="w-5 h-5" />
                  LinkedIn
                </a>
              )}
              {socio.twitter && (
                <a
                  href={socio.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-gray-700 hover:text-blue-600 transition"
                >
                  <Twitter className="w-5 h-5" />
                  Twitter
                </a>
              )}
            </div>
          </div>
        )}
      </div>

      {/* CTA */}
      <div className="mt-8 bg-blue-50 rounded-xl p-8 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">¿Interesado en conectar?</h2>
        <a
          href={socio.email ? `mailto:${socio.email}` : '#'}
          className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
        >
          <Send className="w-4 h-4" />
          Enviar mensaje
        </a>
      </div>
    </div>
  );
}
