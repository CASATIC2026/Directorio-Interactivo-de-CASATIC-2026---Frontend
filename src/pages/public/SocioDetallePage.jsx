import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, Mail, Phone, MapPin, Globe, Facebook, Linkedin, Instagram, 
  Twitter, Youtube, Building2, Briefcase, MessageSquare, CheckCircle2, AlertCircle
} from 'lucide-react';
import api from '../../api/client';

export default function SocioDetallePage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [socio, setSocio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [contactForm, setContactForm] = useState({ nombre: '', correo: '', mensaje: '' });
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitMessage, setSubmitMessage] = useState(null);

  useEffect(() => {
    const fetchSocio = async () => {
      try {
        setLoading(true);
        // ✅ Usar endpoint correcto para obtener socio por slug
        const response = await api.get(`/directorio/socio/${slug}`);
        setSocio(response.data);
      } catch (err) {
        setError('Error al cargar los detalles del socio');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchSocio();
  }, [slug]);

  const handleSubmitContact = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    setSubmitMessage(null);
    try {
      await api.post('/formulariocontacto', {
        nombre: contactForm.nombre,
        correo: contactForm.correo,
        mensaje: contactForm.mensaje
      });
      setSubmitMessage({ type: 'success', text: '✓ Mensaje enviado correctamente' });
      setContactForm({ nombre: '', correo: '', mensaje: '' });
    } catch (err) {
      setSubmitMessage({ type: 'error', text: '✗ Error al enviar el mensaje' });
    } finally {
      setSubmitLoading(false);
    }
  };


  if (loading) {
    return (
      <div className="min-h-screen bg-mesh flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-casatic-200 border-t-casatic-600"></div>
      </div>
    );
  }

  if (error || !socio) {
    return (
      <div className="min-h-screen bg-mesh flex flex-col items-center justify-center p-4">
        <div className="card-base max-w-md p-8 text-center">
          <AlertCircle size={48} className="mx-auto mb-4 text-red-500" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">No encontrado</h1>
          <p className="text-gray-500 mb-6">No pudimos encontrar esta empresa socio.</p>
          <Link to="/directorio" className="btn btn-primary">
            ← Volver al directorio
          </Link>
        </div>
      </div>
    );
  }

  const estadoColor = socio.estadoFinanciero === 'AlDia' 
    ? 'text-emerald-600 bg-emerald-50'
    : socio.estadoFinanciero === 'Atrasado'
    ? 'text-amber-600 bg-amber-50'
    : 'text-red-600 bg-red-50';

  return (
    <div className="min-h-screen bg-white">
      {/* ── Header con Navegación ──────────────────────── */}
      <div className="bg-gradient-to-br from-casatic-600 to-casatic-700 text-white py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <button 
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors mb-4 font-semibold"
          >
            <ArrowLeft size={20} /> Volver
          </button>
          <h1 className="text-3xl sm:text-4xl font-bold">{socio.nombreEmpresa}</h1>
        </div>
      </div>

      {/* ── Contenido Principal ────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* ── Grid Principal ─────────────────────────── */}
        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          
          {/* ── Columna Izquierda (Info Principal) ──── */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Logo & Estado */}
            <div className="card-base p-8 text-center">
              {socio.logoUrl && (
                <img 
                  src={socio.logoUrl} 
                  alt={socio.nombreEmpresa}
                  className="h-32 object-contain mx-auto mb-6"
                />
              )}
              {!socio.logoUrl && (
                <div className="h-32 w-32 mx-auto mb-6 bg-gradient-to-br from-casatic-100 to-casatic-50 rounded-2xl flex items-center justify-center">
                  <Building2 size={48} className="text-casatic-400" />
                </div>
              )}
              {socio.estadoFinanciero && (
                <span className={`inline-block px-4 py-2 rounded-full text-sm font-semibold ${estadoColor}`}>
                  {socio.estadoFinanciero === 'AlDia' && '✓ Al Dí'}
                  {socio.estadoFinanciero === 'Atrasado' && '⚠ Atrasado'}
                  {socio.estadoFinanciero === 'Suspendido' && '✗ Suspendido'}
                </span>
              )}
            </div>

            {/* Descripción */}
            {socio.descripcion && (
              <div className="card-base p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Acerca de</h2>
                <p className="text-gray-600 leading-relaxed text-lg">
                  {socio.descripcion}
                </p>
              </div>
            )}

            {/* Especialidades */}
            {socio.especialidades && socio.especialidades.length > 0 && (
              <div className="card-base p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Briefcase size={24} className="text-casatic-600" />
                  Especialidades
                </h2>
                <div className="flex flex-wrap gap-2">
                  {socio.especialidades.map((esp, idx) => (
                    <span key={idx} className="badge-primary">{esp}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Servicios */}
            {socio.servicios && socio.servicios.length > 0 && (
              <div className="card-base p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Servicios</h2>
                <ul className="space-y-3">
                  {socio.servicios.map((servicio, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-gray-700">
                      <CheckCircle2 size={20} className="text-emerald-500 flex-shrink-0 mt-0.5" />
                      <span>{servicio}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Mapa */}
            {socio.mapaUrl && (
              <div className="card-base p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <MapPin size={24} className="text-casatic-600" />
                  Ubicación
                </h2>
                <div className="rounded-xl overflow-hidden h-96 bg-gray-100">
                  <iframe
                    src={socio.mapaUrl}
                    width="100%"
                    height="100%"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    style={{ border: 'none' }}
                    title="Ubicación"
                  />
                </div>
              </div>
            )}

          </div>

          {/* ── Columna Derecha (Contacto + RRSS) ──── */}
          <div className="space-y-8">
            
            {/* Información de Contacto */}
            <div className="card-base p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Contacto</h2>
              <div className="space-y-5">
                {socio.emailContacto && (
                  <a 
                    href={`mailto:${socio.emailContacto}`}
                    className="flex items-center gap-3 text-gray-700 hover:text-casatic-600 transition-colors p-3 rounded-lg hover:bg-casatic-50"
                  >
                    <Mail size={24} className="text-casatic-600 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs text-gray-500 font-semibold uppercase">Email</p>
                      <p className="truncate font-semibold">{socio.emailContacto}</p>
                    </div>
                  </a>
                )}
                {socio.telefono && (
                  <a 
                    href={`tel:${socio.telefono}`}
                    className="flex items-center gap-3 text-gray-700 hover:text-casatic-600 transition-colors p-3 rounded-lg hover:bg-casatic-50"
                  >
                    <Phone size={24} className="text-casatic-600 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs text-gray-500 font-semibold uppercase">Teléfono</p>
                      <p className="truncate font-semibold">{socio.telefono}</p>
                    </div>
                  </a>
                )}
                {socio.direccion && (
                  <div className="flex items-start gap-3 text-gray-700 p-3 rounded-lg bg-gray-50">
                    <MapPin size={24} className="text-casatic-600 flex-shrink-0 mt-0.5" />
                    <div className="min-w-0">
                      <p className="text-xs text-gray-500 font-semibold uppercase mb-1">Ubicación</p>
                      <p className="text-sm leading-relaxed">{socio.direccion}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Redes Sociales */}
            {(socio.rsWebsite || socio.rsFacebook || socio.rsLinkedin || socio.rsTwitter || socio.rsInstagram || socio.rsYoutube) && (
              <div className="card-base p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Síguenos</h2>
                <div className="grid grid-cols-3 gap-3">
                  {socio.rsWebsite && (
                    <a href={socio.rsWebsite} target="_blank" rel="noopener noreferrer" 
                       className="p-4 bg-gray-100 rounded-lg hover:bg-casatic-100 transition-colors flex items-center justify-center" title="Sitio Web">
                      <Globe size={28} className="text-gray-700" />
                    </a>
                  )}
                  {socio.rsFacebook && (
                    <a href={socio.rsFacebook} target="_blank" rel="noopener noreferrer"
                       className="p-4 bg-gray-100 rounded-lg hover:text-blue-600 transition-all flex items-center justify-center" title="Facebook">
                      <Facebook size={28} className="text-gray-700" />
                    </a>
                  )}
                  {socio.rsLinkedin && (
                    <a href={socio.rsLinkedin} target="_blank" rel="noopener noreferrer"
                       className="p-4 bg-gray-100 rounded-lg hover:text-blue-700 transition-all flex items-center justify-center" title="LinkedIn">
                      <Linkedin size={28} className="text-gray-700" />
                    </a>
                  )}
                  {socio.rsInstagram && (
                    <a href={socio.rsInstagram} target="_blank" rel="noopener noreferrer"
                       className="p-4 bg-gray-100 rounded-lg hover:text-pink-600 transition-all flex items-center justify-center" title="Instagram">
                      <Instagram size={28} className="text-gray-700" />
                    </a>
                  )}
                  {socio.rsTwitter && (
                    <a href={socio.rsTwitter} target="_blank" rel="noopener noreferrer"
                       className="p-4 bg-gray-100 rounded-lg hover:text-sky-500 transition-all flex items-center justify-center" title="Twitter">
                      <Twitter size={28} className="text-gray-700" />
                    </a>
                  )}
                  {socio.rsYoutube && (
                    <a href={socio.rsYoutube} target="_blank" rel="noopener noreferrer"
                       className="p-4 bg-gray-100 rounded-lg hover:text-red-600 transition-all flex items-center justify-center" title="YouTube">
                      <Youtube size={28} className="text-gray-700" />
                    </a>
                  )}
                </div>
              </div>
            )}

            {/* Formulario de Contacto */}
            <div className="card-base p-8 bg-gradient-to-br from-casatic-50 to-white border-2 border-casatic-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <MessageSquare size={24} className="text-casatic-600" />
                Enviar Mensaje
              </h2>
              <form onSubmit={handleSubmitContact} className="space-y-4">
                <div>
                  <label className="input-label">Nombre</label>
                  <input
                    type="text"
                    required
                    value={contactForm.nombre}
                    onChange={(e) => setContactForm({...contactForm, nombre: e.target.value})}
                    className="input-field"
                    placeholder="Tu nombre"
                  />
                </div>
                <div>
                  <label className="input-label">Email</label>
                  <input
                    type="email"
                    required
                    value={contactForm.correo}
                    onChange={(e) => setContactForm({...contactForm, correo: e.target.value})}
                    className="input-field"
                    placeholder="tu@email.com"
                  />
                </div>
                <div>
                  <label className="input-label">Mensaje</label>
                  <textarea
                    required
                    value={contactForm.mensaje}
                    onChange={(e) => setContactForm({...contactForm, mensaje: e.target.value})}
                    className="input-field resize-none"
                    placeholder="Tu mensaje..."
                    rows={4}
                  />
                </div>
                {submitMessage && (
                  <div className={`p-3 rounded-lg text-sm font-semibold ${
                    submitMessage.type === 'success' 
                      ? 'alert-success' 
                      : 'alert-error'
                  }`}>
                    {submitMessage.text}
                  </div>
                )}
                <button
                  type="submit"
                  disabled={submitLoading}
                  className="btn btn-primary w-full"
                >
                  {submitLoading ? 'Enviando...' : 'Enviar Mensaje'}
                </button>
              </form>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
