import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../api/client';
import {
  Building2, MapPin, Phone, Globe, Facebook, Linkedin, Twitter,
  Instagram, Youtube,
  Send, ArrowLeft, ExternalLink, Mail, Tag, Briefcase,
  Star, CheckCircle, AlertCircle, Loader2, MessageSquare, Package
} from 'lucide-react';

/** Parsea el campo redesSociales (JSON string o objeto) */
function parseSocial(raw) {
  if (!raw) return {};
  if (typeof raw === 'object') return raw;
  try { return JSON.parse(raw); } catch { return {}; }
}

/* ─── Loading skeleton ──────────────────────────── */
function DetailSkeleton() {
  return (
    <div className="bg-mesh min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-6">
        <div className="h-5 skeleton w-36 rounded" />
        <div className="card-base p-6 sm:p-8 space-y-4">
          <div className="flex flex-col sm:flex-row gap-6">
            <div className="w-20 h-20 skeleton rounded-2xl flex-shrink-0 mx-auto sm:mx-0" />
            <div className="flex-1 space-y-3">
              <div className="h-7 skeleton w-2/3 rounded" />
              <div className="h-4 skeleton w-1/3 rounded" />
              <div className="h-4 skeleton w-full rounded" />
              <div className="h-4 skeleton w-4/5 rounded" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function MicroSitioPage() {
  const { slug } = useParams();
  const [socio, setSocio] = useState(null);
  const [loading, setLoading] = useState(true);
  // Formulario de contacto
  const [form, setForm] = useState({ nombre: '', correo: '', mensaje: '' });
  const [formStatus, setFormStatus] = useState(null); // 'loading' | 'ok' | 'error'

  useEffect(() => {
    setLoading(true);
    api.get(`/directorio/socio/${slug}`)
      .then((res) => setSocio(res.data))
      .catch(() => setSocio(null))
      .finally(() => setLoading(false));
  }, [slug]);

  const setField = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    if (!socio?.id) return;
    setFormStatus('loading');
    try {
      await api.post(`/formulariocontacto/${socio.id}`, form);
      setFormStatus('ok');
      setForm({ nombre: '', correo: '', mensaje: '' });
    } catch {
      setFormStatus('error');
    }
  };

  if (loading) return <DetailSkeleton />;

  if (!socio) {
    return (
      <div className="bg-mesh min-h-screen">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
          <Link to="/directorio" className="inline-flex items-center gap-2 text-casatic-600 hover:text-casatic-700 font-medium text-sm mb-8 transition-colors">
            <ArrowLeft size={16} /> Volver al Directorio
          </Link>
          <div className="card-base p-12 text-center">
            <div className="w-16 h-16 bg-surface-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Building2 size={28} className="text-surface-400" />
            </div>
            <h2 className="text-xl font-bold text-surface-900 mb-2">Socio no encontrado</h2>
            <p className="text-surface-500 text-sm">Lo sentimos, no pudimos encontrar la empresa solicitada.</p>
          </div>
        </div>
      </div>
    );
  }

  // Normalizar campos de la API
  const nombre = socio.nombreEmpresa ?? socio.nombre ?? '';
  const logo = socio.logoUrl ?? socio.logo ?? '';
  const direccion = socio.direccion ?? socio.ubicacion ?? '';
  const telefono = socio.telefono ?? '';
  const especialidades = socio.especialidades ?? [];
  const servicios = socio.servicios ?? [];
  const marcas = socio.marcasRepresenta ?? '';
  const social = parseSocial(socio.redesSociales);
  const hasSocial = social.website || social.facebook || social.linkedin || social.twitter || social.instagram || social.youtube;

  return (
    <div className="bg-mesh min-h-screen pb-16">
      {/* ── Banner superior ─────────────────────────────── */}
      <div className="bg-gradient-to-br from-casatic-700 via-casatic-800 to-surface-900 py-10 sm:py-14 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-10 pointer-events-none" />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            to="/directorio"
            className="inline-flex items-center gap-1.5 text-casatic-200 hover:text-white text-sm font-medium transition-colors mb-6"
          >
            <ArrowLeft size={15} /> Volver al Directorio
          </Link>

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-white shadow-xl flex items-center justify-center flex-shrink-0 overflow-hidden">
              {logo ? (
                <img src={logo} alt={nombre} className="w-full h-full object-contain p-2" />
              ) : (
                <Building2 size={36} className="text-casatic-600" />
              )}
            </div>
            <div className="text-center sm:text-left">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-tight">
                {nombre}
              </h1>
              {especialidades[0] && (
                <span className="inline-flex items-center gap-1.5 mt-2 text-sm font-semibold text-casatic-200 bg-white/10 px-3 py-1 rounded-full">
                  <Tag size={13} /> {especialidades[0]}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Content ─────────────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-5 relative z-10 space-y-5">

        {/* Descripción + Contacto */}
        <div className="card-base p-5 sm:p-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Descripción */}
            <div className="lg:col-span-2">
              {socio.descripcion && (
                <>
                  <h2 className="text-sm font-semibold uppercase tracking-widest text-surface-400 mb-3">Sobre la empresa</h2>
                  <p className="text-surface-700 leading-relaxed text-sm sm:text-base">{socio.descripcion}</p>
                </>
              )}
              {especialidades.length > 0 && (
                <div className="mt-5">
                  <h3 className="text-xs font-semibold uppercase tracking-widest text-surface-400 mb-2">Especialidades</h3>
                  <div className="flex flex-wrap gap-2">
                    {especialidades.map((e) => (
                      <span key={e} className="badge-primary text-xs">{e}</span>
                    ))}
                  </div>
                </div>
              )}
              {servicios.length > 0 && (
                <div className="mt-4">
                  <h3 className="text-xs font-semibold uppercase tracking-widest text-surface-400 mb-2">Servicios</h3>
                  <div className="flex flex-wrap gap-2">
                    {servicios.map((s) => (
                      <span key={s} className="badge-neutral text-xs">{s}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Contacto */}
            <div className="border-t lg:border-t-0 lg:border-l border-surface-100 pt-6 lg:pt-0 lg:pl-8">
              <h2 className="text-sm font-semibold uppercase tracking-widest text-surface-400 mb-4">Contacto</h2>
              <ul className="space-y-3">
                {direccion && (
                  <li className="flex items-start gap-2.5 text-sm text-surface-600">
                    <MapPin size={15} className="text-casatic-500 mt-0.5 flex-shrink-0" />
                    <span>{direccion}</span>
                  </li>
                )}
                {telefono && (
                  <li className="flex items-center gap-2.5 text-sm">
                    <Phone size={15} className="text-casatic-500 flex-shrink-0" />
                    <a href={`tel:${telefono}`} className="text-surface-600 hover:text-casatic-600 transition-colors">{telefono}</a>
                  </li>
                )}
              </ul>

              {/* Redes sociales */}
              {hasSocial && (
                <div className="mt-5">
                  <h2 className="text-sm font-semibold uppercase tracking-widest text-surface-400 mb-3">Redes Sociales</h2>
                  <div className="flex flex-col gap-2">
                    {social.website && (
                      <a href={social.website} target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-casatic-50 text-casatic-700 text-sm font-medium hover:bg-casatic-100 transition-colors">
                        <Globe size={15} /> Sitio Web
                      </a>
                    )}
                    {social.facebook && (
                      <a href={social.facebook} target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#1877F2]/10 text-[#1877F2] text-sm font-medium hover:bg-[#1877F2]/20 transition-colors">
                        <Facebook size={15} /> Facebook
                      </a>
                    )}
                    {social.linkedin && (
                      <a href={social.linkedin} target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#0A66C2]/10 text-[#0A66C2] text-sm font-medium hover:bg-[#0A66C2]/20 transition-colors">
                        <Linkedin size={15} /> LinkedIn
                      </a>
                    )}
                    {social.twitter && (
                      <a href={social.twitter} target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-surface-100 text-surface-700 text-sm font-medium hover:bg-surface-200 transition-colors">
                        <Twitter size={15} /> Twitter / X
                      </a>
                    )}
                    {social.instagram && (
                      <a href={social.instagram} target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#E1306C]/10 text-[#E1306C] text-sm font-medium hover:bg-[#E1306C]/20 transition-colors">
                        <Instagram size={15} /> Instagram
                      </a>
                    )}
                    {social.youtube && (
                      <a href={social.youtube} target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#FF0000]/10 text-[#FF0000] text-sm font-medium hover:bg-[#FF0000]/20 transition-colors">
                        <Youtube size={15} /> YouTube
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── Marcas que representa ──────────────────────── */}
        {marcas && (
          <div className="card-base p-5 sm:p-8">
            <h2 className="font-bold text-surface-900 text-lg flex items-center gap-2 mb-4">
              <span className="w-8 h-8 bg-casatic-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <Package size={16} className="text-casatic-600" />
              </span>
              Marcas que representa
            </h2>
            <p className="text-surface-700 text-sm sm:text-base leading-relaxed">{marcas}</p>
          </div>
        )}

        {/* ── Formulario de contacto inline ─────────────── */}
        <div className="card-base p-5 sm:p-8" id="contacto">
          <h2 className="font-bold text-surface-900 text-lg flex items-center gap-2 mb-5">
            <span className="w-8 h-8 bg-casatic-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <MessageSquare size={16} className="text-casatic-600" />
            </span>
            Enviar mensaje a {nombre}
          </h2>

          {formStatus === 'ok' && (
            <div className="alert-success mb-5">
              <CheckCircle size={17} />
              <span>¡Mensaje enviado! La empresa se pondrá en contacto con usted.</span>
            </div>
          )}
          {formStatus === 'error' && (
            <div className="alert-error mb-5">
              <AlertCircle size={17} />
              <span>Error al enviar. Por favor intente de nuevo.</span>
            </div>
          )}

          <form onSubmit={handleContactSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="input-label">Nombre completo *</label>
                <input required value={form.nombre} onChange={setField('nombre')} className="input-field" placeholder="Su nombre" />
              </div>
              <div>
                <label className="input-label">Correo electrónico *</label>
                <input required type="email" value={form.correo} onChange={setField('correo')} className="input-field" placeholder="correo@ejemplo.com" />
              </div>
            </div>
            <div>
              <label className="input-label">Mensaje *</label>
              <textarea required rows={4} value={form.mensaje} onChange={setField('mensaje')} className="input-field resize-none" placeholder="Escriba su consulta…" />
            </div>
            <div className="flex justify-end">
              <button type="submit" disabled={formStatus === 'loading'} className="btn-primary w-full sm:w-auto">
                {formStatus === 'loading' ? (
                  <><Loader2 size={16} className="animate-spin" /> Enviando…</>
                ) : (
                  <><Send size={16} /> Enviar mensaje</>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* ── Ubicación / Google Maps ──────────────────── */}
        {socio.mapaUrl && (
          <div className="card-base p-5 sm:p-8">
            <h2 className="font-bold text-surface-900 text-lg flex items-center gap-2 mb-4">
              <span className="w-8 h-8 bg-casatic-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <MapPin size={16} className="text-casatic-600" />
              </span>
              Ubicación
            </h2>
            <div className="rounded-xl overflow-hidden border border-surface-200">
              <iframe
                src={socio.mapaUrl}
                width="100%"
                height="350"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title={`Ubicación de ${nombre}`}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
