import { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle, AlertCircle, Loader2, Clock, Globe } from 'lucide-react';
import api from '../../api/client';
import casaticLogo from '../../img/Reverse - v2@4x.png';

const INFO = [
  { icon: Mail, label: 'Correo electrónico', value: 'info@casatic.org.sv', href: 'mailto:info@casatic.org.sv' },
  { icon: Phone, label: 'Teléfono', value: '+503 2222-0000', href: 'tel:+50322220000' },
  { icon: MapPin, label: 'Dirección', value: 'San Salvador, El Salvador', href: null },
  { icon: Clock, label: 'Horario de atención', value: 'Lunes a Viernes, 8:00 – 17:00', href: null },
  { icon: Globe, label: 'Sitio web', value: 'www.casatic.org.sv', href: 'https://www.casatic.org/' },
];

export default function ContactoPage() {
  const [form, setForm] = useState({ nombre: '', correo: '', asunto: '', mensaje: '' });
  const [status, setStatus] = useState(null); // 'loading' | 'ok' | 'error'

  const set = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    try {
      await api.enviarContactoGeneral(form);
      setStatus('ok');
      setForm({ nombre: '', correo: '', asunto: '', mensaje: '' });
    } catch {
      setStatus('error');
    }
  };

  return (
    <div className="bg-mesh min-h-screen pb-16">
      {/* ── Banner ──────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-casatic-700 via-casatic-800 to-surface-900 py-16 sm:py-20">
        <div className="absolute inset-0 bg-grid opacity-10 pointer-events-none" />
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-casatic-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-accent-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <img src={casaticLogo} alt="CASATIC" className="h-10 w-auto object-contain mb-5 mx-auto animate-fade-in" />
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-casatic-300 bg-white/10 px-3 py-1.5 rounded-full mb-5 animate-fade-in-up">
            <span className="w-1.5 h-1.5 rounded-full bg-accent-400 animate-pulse-soft" />
            Contáctenos
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-4 animate-fade-in-up">
            Hablemos con{' '}
            <span className="text-gradient-accent">CASATIC</span>
          </h1>
          <p className="text-base sm:text-lg text-casatic-200 leading-relaxed max-w-xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            Estamos aquí para ayudarle. Envíenos su consulta y le responderemos a la brevedad.
          </p>
        </div>
      </section>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* ── Info lateral ──────────────────────────── */}
          <div className="space-y-4">
            {INFO.map(({ icon: Icon, label, value, href }) => (
              <div key={label} className="card-base p-5 flex items-start gap-4">
                <div className="w-10 h-10 bg-casatic-50 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Icon size={18} className="text-casatic-600" />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-surface-400 mb-0.5">{label}</p>
                  {href ? (
                    <a href={href} target={href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer"
                      className="text-sm text-casatic-600 hover:text-casatic-700 font-medium transition-colors">
                      {value}
                    </a>
                  ) : (
                    <p className="text-sm text-surface-700 font-medium">{value}</p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* ── Formulario ────────────────────────────── */}
          <div className="lg:col-span-2 card-base p-6 sm:p-8">
            <h2 className="text-lg font-bold text-surface-900 mb-6">Envíenos un mensaje</h2>

            {status === 'ok' && (
              <div className="alert-success mb-6">
                <CheckCircle size={18} />
                <span>¡Mensaje enviado correctamente! Le responderemos pronto.</span>
              </div>
            )}
            {status === 'error' && (
              <div className="alert-error mb-6">
                <AlertCircle size={18} />
                <span>Ocurrió un error al enviar. Inténtelo de nuevo.</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="input-label">Nombre completo *</label>
                  <input
                    required
                    value={form.nombre}
                    onChange={set('nombre')}
                    className="input-field"
                    placeholder="Su nombre"
                  />
                </div>
                <div>
                  <label className="input-label">Correo electrónico *</label>
                  <input
                    required
                    type="email"
                    value={form.correo}
                    onChange={set('correo')}
                    className="input-field"
                    placeholder="correo@ejemplo.com"
                  />
                </div>
              </div>
              <div>
                <label className="input-label">Asunto *</label>
                <input
                  required
                  value={form.asunto}
                  onChange={set('asunto')}
                  className="input-field"
                  placeholder="¿En qué podemos ayudarle?"
                />
              </div>
              <div>
                <label className="input-label">Mensaje *</label>
                <textarea
                  required
                  rows={5}
                  value={form.mensaje}
                  onChange={set('mensaje')}
                  className="input-field resize-none"
                  placeholder="Escriba su mensaje aquí..."
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="btn-primary btn-lg w-full sm:w-auto"
                >
                  {status === 'loading' ? (
                    <><Loader2 size={18} className="animate-spin" /> Enviando...</>
                  ) : (
                    <><Send size={18} /> Enviar mensaje</>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
