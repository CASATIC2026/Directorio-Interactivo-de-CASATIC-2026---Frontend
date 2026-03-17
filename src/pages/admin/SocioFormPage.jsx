import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../api/client';
import {
  Save, ArrowLeft, Building2, Globe, Phone, MapPin,
  Tag, Briefcase, Image, Share2, AlertCircle, Loader2,
  Facebook, Linkedin, Twitter, Instagram, Youtube, Mail, Upload
} from 'lucide-react';

export default function SocioFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const fileInputRef = useRef(null);

  const [form, setForm] = useState({
    nombreEmpresa: '',
    slug: '',
    descripcion: '',
    especialidades: '',
    servicios: '',
    telefono: '',
    direccion: '',
    logoUrl: '',
    emailContacto: '',
    mapaUrl: '',
    marcasRepresenta: '',
    rsWebsite: '',
    rsFacebook: '',
    rsLinkedin: '',
    rsTwitter: '',
    rsInstagram: '',
    rsYoutube: '',
  });
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [loadingData, setLoadingData] = useState(isEdit);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadError, setUploadError] = useState(null);

  useEffect(() => {
    if (isEdit) {
      api.get(`/socios/${id}`).then((res) => {
        const s = res.data;
        setForm({
          nombreEmpresa: s.nombreEmpresa,
          slug: s.slug,
          descripcion: s.descripcion,
          especialidades: (s.especialidades || []).join(', '),
          servicios: (s.servicios || []).join(', '),
          telefono: s.telefono || '',
          direccion: s.direccion || '',
          logoUrl: s.logoUrl || '',
          marcasRepresenta: s.marcasRepresenta || '',
          emailContacto: s.emailContacto || '',
          ...(() => {
            let rs = {};
            try { rs = typeof s.redesSociales === 'string' ? JSON.parse(s.redesSociales) : (s.redesSociales || {}); } catch {}
            return {
              rsWebsite: rs.website || '',
              rsFacebook: rs.facebook || '',
              rsLinkedin: rs.linkedin || '',
              rsTwitter: rs.twitter || '',
              rsInstagram: rs.instagram || '',
              rsYoutube: rs.youtube || '',
            };
          })(),
        });
      }).finally(() => setLoadingData(false));
    }
  }, [id]);

  const handleChange = (field) => (e) =>
    setForm({ ...form, [field]: e.target.value });

  const handleLogoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingLogo(true);
    setUploadError(null);
    const fd = new FormData();
    fd.append('file', file);
    try {
      const res = await api.post('/upload/logo', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setForm((prev) => ({ ...prev, logoUrl: res.data.url }));
    } catch (err) {
      setUploadError(err.response?.data?.message || 'Error al subir la imagen');
    } finally {
      setUploadingLogo(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const autoSlug = () => {
    const slug = form.nombreEmpresa
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    setForm({ ...form, slug });
  };

  const emptyForm = {
    nombreEmpresa: '', slug: '', descripcion: '', especialidades: '', servicios: '',
    telefono: '', direccion: '', logoUrl: '', emailContacto: '', mapaUrl: '', marcasRepresenta: '',
    rsWebsite: '', rsFacebook: '', rsLinkedin: '', rsTwitter: '', rsInstagram: '', rsYoutube: '',
  };

  const handleSubmit = async (e, addAnother = false) => {
    if (e && e.preventDefault) e.preventDefault();
    setError(null);
    setSaving(true);

    const redesSociales = JSON.stringify(
      Object.fromEntries(
        Object.entries({
          website: form.rsWebsite,
          facebook: form.rsFacebook,
          linkedin: form.rsLinkedin,
          twitter: form.rsTwitter,
          instagram: form.rsInstagram,
          youtube: form.rsYoutube,
        }).filter(([, v]) => v.trim() !== '')
      )
    );

    const payload = {
      nombreEmpresa: form.nombreEmpresa,
      slug: form.slug,
      descripcion: form.descripcion,
      telefono: form.telefono,
      direccion: form.direccion,
      logoUrl: form.logoUrl,
      emailContacto: form.emailContacto,
      mapaUrl: form.mapaUrl,
      redesSociales,
      especialidades: form.especialidades.split(',').map((s) => s.trim()).filter(Boolean),
      servicios: form.servicios.split(',').map((s) => s.trim()).filter(Boolean),
    };

    try {
      if (isEdit) {
        await api.put(`/socios/${id}`, payload);
        navigate('/admin/socios');
      } else {
        await api.post('/socios', payload);
        if (addAnother) {
          setForm(emptyForm);
          setError(null);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
          navigate('/admin/socios');
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error al guardar');
    } finally {
      setSaving(false);
    }
  };

  if (loadingData) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-casatic-200 border-t-casatic-600 rounded-full animate-spin" />
          <p className="text-sm text-surface-400 font-medium">Cargando socio…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* ── Header ────────────────────────────────────── */}
      <div className="flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="btn-icon btn-ghost">
          <ArrowLeft size={20} />
        </button>
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 bg-casatic-100 rounded-2xl flex items-center justify-center">
            <Building2 size={22} className="text-casatic-600" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-surface-900">
              {isEdit ? 'Editar Socio' : 'Nuevo Socio'}
            </h1>
            <p className="text-sm text-surface-500">Configuración del perfil corporativo</p>
          </div>
        </div>
      </div>

      {/* ── Formulario ────────────────────────────────── */}
      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Información General */}
        <div className="card-base p-5 sm:p-6 space-y-5">
          <h2 className="font-semibold text-sm uppercase tracking-widest text-surface-400 flex items-center gap-2">
            <Tag size={14} /> Información General
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="input-label">Nombre Empresa *</label>
              <input
                type="text" required value={form.nombreEmpresa}
                onChange={handleChange('nombreEmpresa')}
                onBlur={!isEdit ? autoSlug : undefined}
                className="input-field"
                placeholder="Ej. Tech Solutions"
              />
            </div>
            <div>
              <label className="input-label flex items-center gap-1">
                <Globe size={12} /> Slug (URL) *
              </label>
              <input
                type="text" required value={form.slug}
                onChange={handleChange('slug')}
                className="input-field font-mono text-sm bg-surface-50"
              />
            </div>
            <div className="md:col-span-2">
              <label className="input-label">Descripción</label>
              <textarea
                rows={3} value={form.descripcion}
                onChange={handleChange('descripcion')}
                className="input-field resize-none"
                placeholder="Breve reseña de la organización…"
              />
            </div>
          </div>
        </div>

        {/* Capacidades Técnicas */}
        <div className="card-base p-5 sm:p-6 space-y-5">
          <h2 className="font-semibold text-sm uppercase tracking-widest text-surface-400 flex items-center gap-2">
            <Briefcase size={14} /> Capacidades Técnicas
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="input-label">Especialidades</label>
              <input
                type="text" value={form.especialidades}
                onChange={handleChange('especialidades')}
                className="input-field"
                placeholder="IA, Cloud, Ciberseguridad…"
              />
            </div>
            <div>
              <label className="input-label">Servicios</label>
              <input
                type="text" value={form.servicios}
                onChange={handleChange('servicios')}
                className="input-field"
                placeholder="Desarrollo Web, Consultoría…"
              />
            </div>
          </div>
        </div>

        {/* Contacto y Presencia Digital */}
        <div className="card-base p-5 sm:p-6 space-y-5">
          <h2 className="font-semibold text-sm uppercase tracking-widest text-surface-400 flex items-center gap-2">
            <Phone size={14} /> Contacto y Presencia Digital
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="input-label flex items-center gap-1"><Phone size={12} /> Teléfono</label>
              <input type="text" value={form.telefono} onChange={handleChange('telefono')}
                className="input-field" placeholder="+503 2222-0000" />
            </div>
            <div>
              <label className="input-label flex items-center gap-1"><MapPin size={12} /> Dirección</label>
              <input type="text" value={form.direccion} onChange={handleChange('direccion')}
                className="input-field" placeholder="San Salvador, El Salvador" />
            </div>
            <div className="md:col-span-2">
              <label className="input-label flex items-center gap-1">
                <Mail size={12} /> Email de Contacto
                <span className="text-surface-400 font-normal text-xs ml-1">— se recibirán los formularios enviados por clientes</span>
              </label>
              <input type="email" value={form.emailContacto} onChange={handleChange('emailContacto')}
                className="input-field" placeholder="contacto@miempresa.com" />
            </div>
            {/* Logo */}
            <div className="md:col-span-2">
              <label className="input-label flex items-center gap-1">
                <Image size={12} /> Logo Corporativo
              </label>
              <div className="flex gap-3 items-start">
                <div className="flex-1">
                  <input type="text" value={form.logoUrl} onChange={handleChange('logoUrl')}
                    className="input-field" placeholder="https://midominio.com/logo.png" />
                </div>
                <div className="flex flex-col items-center gap-1">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/gif,image/webp"
                    className="hidden"
                    onChange={handleLogoUpload}
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadingLogo}
                    className="btn-primary btn-sm whitespace-nowrap"
                  >
                    {uploadingLogo ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
                    {uploadingLogo ? 'Subiendo…' : 'Subir imagen'}
                  </button>
                  <span className="text-[10px] text-surface-400">JPG, PNG, WebP · máx 5MB</span>
                </div>
              </div>
              {uploadError && (
                <p className="mt-2 text-xs text-red-500 flex items-center gap-1">
                  <AlertCircle size={12} /> {uploadError}
                </p>
              )}
              {form.logoUrl && (
                <div className="mt-3 flex items-center gap-3">
                  <img
                    src={form.logoUrl}
                    alt="Preview logo"
                    className="h-14 w-14 object-contain rounded-xl border border-surface-200 bg-surface-50 p-1"
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                  <span className="text-xs text-surface-400 break-all">{form.logoUrl}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Ubicación en mapa */}
        <div className="card-base p-5 sm:p-6 space-y-4">
          <h2 className="font-semibold text-sm uppercase tracking-widest text-surface-400 flex items-center gap-2">
            <MapPin size={14} /> Ubicación en mapa
          </h2>
          <div>
            <label className="input-label">Código iframe de Google Maps</label>
            <textarea
              rows={3}
              value={form.mapaUrl}
              onChange={(e) => {
                const val = e.target.value.trim();
                const match = val.match(/src="([^"]+)"/);
                setForm((prev) => ({ ...prev, mapaUrl: match ? match[1] : val }));
              }}
              className="input-field resize-none font-mono text-xs"
              placeholder='Pega aquí el iframe completo o solo la URL del src'
            />
            <p className="text-[11px] text-surface-400 mt-1">En Google Maps: <strong>Compartir → Insertar un mapa</strong> → copia y pega el código completo aquí</p>
            {form.mapaUrl && (
              <div className="mt-3 rounded-xl overflow-hidden border border-surface-200">
                <iframe
                  src={form.mapaUrl}
                  width="100%"
                  height="200"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Vista previa del mapa"
                />
              </div>
            )}
          </div>
        </div>

        {/* Redes Sociales */}
        <div className="card-base p-5 sm:p-6 space-y-5">
          <h2 className="font-semibold text-sm uppercase tracking-widest text-surface-400 flex items-center gap-2">
            <Share2 size={14} /> Redes Sociales y Presencia Web
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="input-label flex items-center gap-1"><Globe size={12} /> Sitio Web</label>
              <input type="url" value={form.rsWebsite} onChange={handleChange('rsWebsite')}
                className="input-field" placeholder="https://miempresa.com" />
            </div>
            <div>
              <label className="input-label flex items-center gap-1"><Facebook size={12} className="text-[#1877F2]" /> Facebook</label>
              <input type="url" value={form.rsFacebook} onChange={handleChange('rsFacebook')}
                className="input-field" placeholder="https://facebook.com/miempresa" />
            </div>
            <div>
              <label className="input-label flex items-center gap-1"><Linkedin size={12} className="text-[#0A66C2]" /> LinkedIn</label>
              <input type="url" value={form.rsLinkedin} onChange={handleChange('rsLinkedin')}
                className="input-field" placeholder="https://linkedin.com/company/miempresa" />
            </div>
            <div>
              <label className="input-label flex items-center gap-1"><Twitter size={12} className="text-[#1DA1F2]" /> Twitter / X</label>
              <input type="url" value={form.rsTwitter} onChange={handleChange('rsTwitter')}
                className="input-field" placeholder="https://twitter.com/miempresa" />
            </div>
            <div>
              <label className="input-label flex items-center gap-1"><Instagram size={12} className="text-[#E1306C]" /> Instagram</label>
              <input type="url" value={form.rsInstagram} onChange={handleChange('rsInstagram')}
                className="input-field" placeholder="https://instagram.com/miempresa" />
            </div>
            <div>
              <label className="input-label flex items-center gap-1"><Youtube size={12} className="text-[#FF0000]" /> YouTube</label>
              <input type="url" value={form.rsYoutube} onChange={handleChange('rsYoutube')}
                className="input-field" placeholder="https://youtube.com/@miempresa" />
            </div>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="alert-error">
            <AlertCircle size={16} /> {error}
          </div>
        )}

        {/* Acciones */}
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
          <button type="submit" disabled={saving} className="btn-primary btn-lg w-full sm:w-auto">
            {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
            {saving ? 'Procesando…' : 'Guardar Socio'}
          </button>
          {!isEdit && (
            <button
              type="button" disabled={saving}
              onClick={(e) => handleSubmit(e, true)}
              className="btn btn-lg bg-emerald-500 text-white hover:bg-emerald-600 focus:ring-emerald-400 w-full sm:w-auto"
            >
              {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
              {saving ? 'Procesando…' : 'Guardar y agregar otro'}
            </button>
          )}
          <button
            type="button"
            onClick={() => navigate('/admin/socios')}
            className="btn-secondary btn-lg w-full sm:w-auto"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
