import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft, Mail, Phone, MapPin, Globe, Facebook, Linkedin, Instagram,
  Twitter, Youtube, Building2, Briefcase, MessageSquare, CheckCircle2,
  AlertCircle, Send,
} from 'lucide-react';
import api from '../../api/client';
import LogoSlider from '../../components/LogoSlider';
import partnerLogo1 from './img/socios e inversionistas/microsoft.png';
import partnerLogo2 from './img/socios e inversionistas/pbs.png';
import partnerLogo3 from './img/socios e inversionistas/tbox.png';
import partnerLogo4 from './img/socios e inversionistas/aplaudo.png';
import partnerLogo5 from './img/socios e inversionistas/acari.png';

const sociosDelSocio = [
  { img: partnerLogo1, link: 'https://www.microsoft.com/es-sv/' },
  { img: partnerLogo2, link: 'https://www.grouppbs.com/' },
  { img: partnerLogo3, link: 'https://www.tboxplanet.com/en/home' },
  { img: partnerLogo4, link: 'http://www.applaudostudios.com/' },
  { img: partnerLogo5, link: 'https://www.aracaristudios.com/' },
];

const socialLinks = [
  {
    key: 'rsWebsite',   Icon: Globe,     label: 'Sitio Web',
    iconCls: 'text-casatic-600',
    bgCls:   'bg-casatic-50 border-casatic-100',
    hoverCls: 'hover:bg-casatic-100 hover:border-casatic-200',
  },
  {
    key: 'rsFacebook',  Icon: Facebook,  label: 'Facebook',
    iconCls: 'text-[#1877F2]',
    bgCls:   'bg-blue-50 border-blue-100',
    hoverCls: 'hover:bg-blue-100 hover:border-blue-200',
  },
  {
    key: 'rsLinkedin',  Icon: Linkedin,  label: 'LinkedIn',
    iconCls: 'text-[#0A66C2]',
    bgCls:   'bg-sky-50 border-sky-100',
    hoverCls: 'hover:bg-sky-100 hover:border-sky-200',
  },
  {
    key: 'rsTwitter',   Icon: Twitter,   label: 'Twitter/X',
    iconCls: 'text-[#1DA1F2]',
    bgCls:   'bg-sky-50 border-sky-100',
    hoverCls: 'hover:bg-sky-100 hover:border-sky-200',
  },
  {
    key: 'rsInstagram', Icon: Instagram, label: 'Instagram',
    iconCls: 'text-[#E1306C]',
    bgCls:   'bg-pink-50 border-pink-100',
    hoverCls: 'hover:bg-pink-100 hover:border-pink-200',
  },
  {
    key: 'rsYoutube',   Icon: Youtube,   label: 'YouTube',
    iconCls: 'text-[#FF0000]',
    bgCls:   'bg-red-50 border-red-100',
    hoverCls: 'hover:bg-red-100 hover:border-red-200',
  },
];

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
    api.get(`/directorio/socio/${slug}`)
      .then((res) => setSocio(res.data))
      .catch(() => setError('Error al cargar los detalles del socio'))
      .finally(() => setLoading(false));
  }, [slug]);

  const handleSubmitContact = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    setSubmitMessage(null);
    try {
      const payload = {
        nombre: contactForm.nombre,
        correo: contactForm.correo,
        mensaje: contactForm.mensaje,
      };

      if (socio?.id) {
        await api.enviarFormulario(socio.id, payload);
      } else {
        await api.enviarFormularioPorSlug(socio.slug, payload);
      }

      setSubmitMessage({ type: 'success', text: 'Mensaje enviado correctamente. Nos pondremos en contacto pronto.' });
      setContactForm({ nombre: '', correo: '', mensaje: '' });
    } catch {
      setSubmitMessage({ type: 'error', text: 'No se pudo enviar el mensaje. Intenta nuevamente.' });
    } finally {
      setSubmitLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-mesh flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 border-4 border-casatic-200 border-t-casatic-600 rounded-full animate-spin" />
          <p className="text-sm text-surface-500 font-medium">Cargando perfil…</p>
        </div>
      </div>
    );
  }

  if (error || !socio) {
    return (
      <div className="min-h-screen bg-mesh flex flex-col items-center justify-center p-4">
        <div className="card-base max-w-md p-8 text-center">
          <AlertCircle size={48} className="mx-auto mb-4 text-red-400" />
          <h1 className="text-2xl font-bold text-surface-900 mb-2">No encontrado</h1>
          <p className="text-surface-500 mb-6">No pudimos encontrar esta empresa socio.</p>
          <Link to="/directorio" className="btn-primary">
            ← Volver al directorio
          </Link>
        </div>
      </div>
    );
  }

  const hasSocial = socialLinks.some(({ key }) => !!socio[key]);

  return (
    <div className="min-h-screen bg-surface-50">

      {/* ── Header ──────────────────────────────────────── */}
      <div className="bg-gradient-to-br from-casatic-700 via-casatic-800 to-surface-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-10 pointer-events-none" />
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-casatic-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-white/70 hover:text-white transition-colors mb-5 text-sm font-medium"
          >
            <ArrowLeft size={18} /> Volver al directorio
          </button>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <div className="w-16 h-16 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/20 flex-shrink-0">
              {socio.logoUrl ? (
                <img src={socio.logoUrl} alt={socio.nombreEmpresa} className="w-12 h-12 object-contain rounded-xl" />
              ) : (
                <Building2 size={28} className="text-white/80" />
              )}
            </div>
            <div>
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white leading-tight">
                  {socio.nombreEmpresa}
              </h1>
            </div>
          </div>
        </div>
      </div>

      {/* ── Body ────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid lg:grid-cols-3 gap-8">

          {/* ── Columna Principal ──────────────────────── */}
          <div className="lg:col-span-2 space-y-6">

            {/* Sobre la empresa */}
            {socio.descripcion && (
              <div className="card-base p-6 sm:p-8">
                <h2 className="text-xl font-bold text-surface-900 mb-4 flex items-center gap-2">
                  <Building2 size={20} className="text-casatic-600" />
                  Acerca de
                </h2>
                <p className="text-surface-600 leading-relaxed text-base">{socio.descripcion}</p>
              </div>
            )}

            {/* Especialidades */}
            {socio.especialidades?.length > 0 && (
              <div className="card-base p-6 sm:p-8">
                <h2 className="text-xl font-bold text-surface-900 mb-4 flex items-center gap-2">
                  <Briefcase size={20} className="text-casatic-600" />
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
            {socio.servicios?.length > 0 && (
              <div className="card-base p-6 sm:p-8">
                <h2 className="text-xl font-bold text-surface-900 mb-4">Servicios</h2>
                <ul className="space-y-3">
                  {socio.servicios.map((servicio, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-surface-700">
                      <CheckCircle2 size={18} className="text-emerald-500 flex-shrink-0 mt-0.5" />
                      <span>{servicio}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

           {/* Marcas que representa (con logos) */}
{socio.marcasRepresenta?.length > 0 && (
  <div className="card-base p-6 sm:p-8">
    <h2 className="text-xl font-bold text-surface-900 mb-6">
      Marcas que representa
    </h2>

    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      {socio.marcasRepresenta.map((marca, idx) => (
        <div
          key={idx}
          className="flex items-center justify-center p-4 rounded-2xl border border-surface-200 bg-white hover:shadow-md transition-all"
        >
          <img
            src={marca.logoUrl}
            alt={marca.nombre}
            className="max-h-16 object-contain"
          />
        </div>
      ))}
    </div>
  </div>
)}

            {/* Mapa */}
            {socio.mapaUrl && (
              <div className="card-base p-6 sm:p-8">
                <h2 className="text-xl font-bold text-surface-900 mb-4 flex items-center gap-2">
                  <MapPin size={20} className="text-casatic-600" />
                  Ubicación
                </h2>
                <div className="rounded-xl overflow-hidden h-80 bg-surface-100">
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

          {/* ── Sidebar ────────────────────────────────── */}
          <div className="space-y-6">

            {/* Logo */}
            {socio.logoUrl && (
              <div className="card-base p-6 flex items-center justify-center">
                <img
                  src={socio.logoUrl}
                  alt={socio.nombreEmpresa}
                  className="max-h-28 object-contain"
                />
              </div>
            )}

            {/* Contacto */}
            <div className="card-base p-6">
              <h2 className="text-lg font-bold text-surface-900 mb-4">Información de Contacto</h2>
              <div className="space-y-3">
                {socio.emailContacto && (
                  <a
                    href={`mailto:${socio.emailContacto}`}
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-casatic-50 transition-colors group"
                  >
                    <div className="w-9 h-9 bg-casatic-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Mail size={16} className="text-casatic-600" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] text-surface-400 font-semibold uppercase tracking-wider">Email</p>
                      <p className="text-sm font-medium text-surface-700 truncate group-hover:text-casatic-600 transition-colors">
                        {socio.emailContacto}
                      </p>
                    </div>
                  </a>
                )}
                {socio.telefono && (
                  <a
                    href={`tel:${socio.telefono}`}
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-casatic-50 transition-colors group"
                  >
                    <div className="w-9 h-9 bg-casatic-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Phone size={16} className="text-casatic-600" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] text-surface-400 font-semibold uppercase tracking-wider">Teléfono</p>
                      <p className="text-sm font-medium text-surface-700 group-hover:text-casatic-600 transition-colors">
                        {socio.telefono}
                      </p>
                    </div>
                  </a>
                )}
                {socio.direccion && (
                  <div className="flex items-start gap-3 p-3 rounded-xl bg-surface-50">
                    <div className="w-9 h-9 bg-surface-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                      <MapPin size={16} className="text-surface-500" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] text-surface-400 font-semibold uppercase tracking-wider mb-0.5">Dirección</p>
                      <p className="text-sm text-surface-600 leading-relaxed">{socio.direccion}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Redes Sociales */}
            {hasSocial && (
              <div className="card-base p-6">
                <h2 className="text-lg font-bold text-surface-900 mb-4">Síguenos</h2>
                <div className="grid grid-cols-3 gap-2">
                  {socialLinks.map(({ key, Icon, label, iconCls, bgCls, hoverCls }) =>
                    socio[key] ? (
                      <a
                        key={key}
                        href={socio[key]}
                        target="_blank"
                        rel="noopener noreferrer"
                        title={label}
                        className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border transition-all duration-200 ${bgCls} ${hoverCls}`}
                      >
                        <Icon size={22} className={iconCls} />
                        <span className={`text-[10px] font-semibold ${iconCls}`}>{label}</span>
                      </a>
                    ) : null
                  )}
                </div>
              </div>
            )}

            {/* Formulario de Contacto */}
            <div className="card-base p-6 border-2 border-casatic-100 bg-gradient-to-br from-casatic-50/50 to-white">
              <h2 className="text-lg font-bold text-surface-900 mb-4 flex items-center gap-2">
                <MessageSquare size={18} className="text-casatic-600" />
                Enviar Mensaje
              </h2>
              <form onSubmit={handleSubmitContact} className="space-y-3">
                <div>
                  <label className="input-label">Nombre</label>
                  <input
                    type="text"
                    required
                    value={contactForm.nombre}
                    onChange={(e) => setContactForm({ ...contactForm, nombre: e.target.value })}
                    className="input-field"
                    placeholder="Tu nombre completo"
                  />
                </div>
                <div>
                  <label className="input-label">Email</label>
                  <input
                    type="email"
                    required
                    value={contactForm.correo}
                    onChange={(e) => setContactForm({ ...contactForm, correo: e.target.value })}
                    className="input-field"
                    placeholder="tu@email.com"
                  />
                </div>
                <div>
                  <label className="input-label">Mensaje</label>
                  <textarea
                    required
                    value={contactForm.mensaje}
                    onChange={(e) => setContactForm({ ...contactForm, mensaje: e.target.value })}
                    className="input-field resize-none"
                    placeholder="¿En qué podemos ayudarte?"
                    rows={4}
                  />
                </div>

                {submitMessage && (
                  <div className={submitMessage.type === 'success' ? 'alert-success' : 'alert-error'}>
                    {submitMessage.type === 'success'
                      ? <CheckCircle2 size={16} />
                      : <AlertCircle size={16} />}
                    {submitMessage.text}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={submitLoading}
                  className="btn-primary w-full"
                >
                  {submitLoading
                    ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    : <Send size={16} />}
                  {submitLoading ? 'Enviando…' : 'Enviar Mensaje'}
                </button>
              </form>
            </div>

          </div>
        </div>

        <div className="mt-10">
          <LogoSlider
            title={`Socios de ${socio.nombreEmpresa}`}
            subtitle="Espacio preparado para mostrar aliados, clientes o socios relacionados con esta empresa"
            items={sociosDelSocio}
            perPage={5}
          />
        </div>
      </div>
    </div>
  );
}
