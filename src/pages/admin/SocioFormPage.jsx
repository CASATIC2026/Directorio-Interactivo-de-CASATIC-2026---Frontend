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
    marcasRepresenta: '',
    // Redes sociales — campos individuales
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
          // Parsear redesSociales JSON a campos individuales
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSaving(true);

    const redesSociales = JSON.stringify(      Object.fromEntries(
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
      redesSociales,
      especialidades: form.especialidades.split(',').map((s) => s.trim()).filter(Boolean),
      servicios: form.servicios.split(',').map((s) => s.trim()).filter(Boolean),
    };

    try {
      if (isEdit) {
        await api.put(`/socios/${id}`, payload);
      } else {
        await api.post('/socios', payload);
      }
      navigate('/admin/socios');
    } catch (err) {
      setError(err.response?.data?.message || 'Error al guardar');
    } finally {
      setSaving(false);
    }
  };

  if (loadingData) {
    return (
      <div className="min-h-screen bg-[#0E3877] p-8 animate-pulse">
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="h-10 bg-white/10 rounded-xl w-48" />
          <div className="h-[500px] bg-white rounded-3xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0E3877] p-4 sm:p-8 font-['Roboto'] font-normal text-white">
      <style>
        {`@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap');`}
      </style>

      <div className="max-w-4xl mx-auto">
        {/* ── Header ────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-white/10 rounded-xl transition-colors"
            >
              <ArrowLeft size={24} />
            </button>
            <div>
              <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
                <Building2 size={32} className="text-[#0C9EC6]" />
                {isEdit ? 'Editar Socio' : 'Nuevo Socio'}
              </h1>
              <p className="text-white/60 text-sm mt-1">Configuración del perfil corporativo</p>
            </div>
          </div>
        </div>

        {/* ── Formulario (Fondo Blanco) ─────────────────── */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white rounded-3xl shadow-2xl p-6 sm:p-10 text-[#0A0A0A] border border-white/10">
            
            {/* Sección: Información General */}
            <div className="mb-10">
              <h3 className="text-[#0E3877] font-bold uppercase text-xs tracking-widest flex items-center gap-2 mb-6">
                <Tag size={16} className="text-[#0C9EC6]" /> Información General
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="relative">
                  <label className="block text-[11px] font-bold text-gray-400 uppercase mb-2 ml-1">Nombre Empresa *</label>
                  <input
                    type="text" required value={form.nombreEmpresa}
                    onChange={handleChange('nombreEmpresa')}
                    onBlur={!isEdit ? autoSlug : undefined}
                    className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl focus:border-[#0C9EC6] focus:outline-none transition-all font-normal"
                    placeholder="Ej. Tech Solutions"
                  />
                </div>
                <div className="relative">
                  <label className="block text-[11px] font-bold text-gray-400 uppercase mb-2 ml-1 flex items-center gap-1">
                    <Globe size={12} /> Slug (URL) *
                  </label>
                  <input
                    type="text" required value={form.slug}
                    onChange={handleChange('slug')}
                    className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl focus:border-[#0C9EC6] focus:outline-none transition-all font-mono text-sm bg-gray-50"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-[11px] font-bold text-gray-400 uppercase mb-2 ml-1">Descripción</label>
                  <textarea
                    rows={3} value={form.descripcion}
                    onChange={handleChange('descripcion')}
                    className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl focus:border-[#0C9EC6] focus:outline-none transition-all font-normal resize-none"
                    placeholder="Breve reseña de la organización..."
                  />
                </div>
              </div>
            </div>

            {/* Sección: Especialidades */}
            <div className="mb-10">
              <h3 className="text-[#0E3877] font-bold uppercase text-xs tracking-widest flex items-center gap-2 mb-6">
                <Briefcase size={16} className="text-[#0C9EC6]" /> Capacidades Técnicas
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[11px] font-bold text-gray-400 uppercase mb-2 ml-1">Especialidades</label>
                  <input
                    type="text" value={form.especialidades}
                    onChange={handleChange('especialidades')}
                    className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl focus:border-[#0C9EC6] focus:outline-none transition-all font-normal"
                    placeholder="IA, Cloud, Ciberseguridad..."
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-400 uppercase mb-2 ml-1">Servicios</label>
                  <input
                    type="text" value={form.servicios}
                    onChange={handleChange('servicios')}
                    className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl focus:border-[#0C9EC6] focus:outline-none transition-all font-normal"
                    placeholder="Desarrollo Web, Consultoría..."
                  />
                </div>
              </div>
            </div>

            {/* Sección: Contacto y Media */}
            <div className="mb-6">
              <h3 className="text-[#0E3877] font-bold uppercase text-xs tracking-widest flex items-center gap-2 mb-6">
                <Phone size={16} className="text-[#0C9EC6]" /> Contacto y Presencia Digital
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="relative">
                  <Phone className="absolute left-3 top-[38px] text-[#0C9EC6]" size={18} />
                  <label className="block text-[11px] font-bold text-gray-400 uppercase mb-2 ml-1">Teléfono</label>
                  <input type="text" value={form.telefono} onChange={handleChange('telefono')}
                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-100 rounded-xl focus:border-[#0C9EC6] focus:outline-none transition-all font-normal" 
                    placeholder="+503 2222-0000" />
                </div>
                <div className="relative">
                  <MapPin className="absolute left-3 top-[38px] text-[#0C9EC6]" size={18} />
                  <label className="block text-[11px] font-bold text-gray-400 uppercase mb-2 ml-1">Dirección</label>
                  <input type="text" value={form.direccion} onChange={handleChange('direccion')}
                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-100 rounded-xl focus:border-[#0C9EC6] focus:outline-none transition-all font-normal" 
                    placeholder="San Salvador, El Salvador" />
                </div>
                <div className="md:col-span-2 relative">
                  <Mail className="absolute left-3 top-[38px] text-[#0C9EC6]" size={18} />
                  <label className="block text-[11px] font-bold text-gray-400 uppercase mb-2 ml-1">
                    Email de Contacto
                    <span className="ml-2 text-[#0C9EC6] normal-case font-normal">— se recibirán los formularios enviados por clientes</span>
                  </label>
                  <input type="email" value={form.emailContacto} onChange={handleChange('emailContacto')}
                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-100 rounded-xl focus:border-[#0C9EC6] focus:outline-none transition-all font-normal" 
                    placeholder="contacto@miempresa.com" />
                </div>
                {/* Logo: URL o subida de archivo */}
                <div className="md:col-span-2">
                  <label className="block text-[11px] font-bold text-gray-400 uppercase mb-2 ml-1 flex items-center gap-1">
                    <Image size={12} /> Logo Corporativo
                  </label>
                  <div className="flex gap-3 items-start">
                    <div className="relative flex-1">
                      <Image className="absolute left-3 top-3.5 text-[#0C9EC6]" size={18} />
                      <input type="text" value={form.logoUrl} onChange={handleChange('logoUrl')}
                        className="w-full pl-10 pr-4 py-3 border-2 border-gray-100 rounded-xl focus:border-[#0C9EC6] focus:outline-none transition-all font-normal" 
                        placeholder="https://midominio.com/logo.png" />
                    </div>
                    {/* Botón subir imagen */}
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
                        className="flex items-center gap-2 px-4 py-3 bg-[#0E3877] hover:bg-[#0C9EC6] text-white text-sm font-bold rounded-xl transition-all disabled:opacity-60 whitespace-nowrap"
                      >
                        {uploadingLogo
                          ? <Loader2 size={16} className="animate-spin" />
                          : <Upload size={16} />}
                        {uploadingLogo ? 'Subiendo...' : 'Subir imagen'}
                      </button>
                      <span className="text-[10px] text-gray-400">JPG, PNG, WebP · máx 5MB</span>
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
                        className="h-14 w-14 object-contain rounded-xl border border-gray-100 bg-gray-50 p-1"
                        onError={(e) => { e.target.style.display = 'none'; }}
                      />
                      <span className="text-xs text-gray-400 break-all">{form.logoUrl}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Sección: Redes Sociales */}
            <div className="mb-6">
              <h3 className="text-[#0E3877] font-bold uppercase text-xs tracking-widest flex items-center gap-2 mb-6">
                <Share2 size={16} className="text-[#0C9EC6]" /> Redes Sociales y Presencia Web
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="relative">
                  <Globe size={16} className="absolute left-3 top-[38px] text-[#0C9EC6]" />
                  <label className="block text-[11px] font-bold text-gray-400 uppercase mb-2 ml-1">Sitio Web</label>
                  <input type="url" value={form.rsWebsite} onChange={handleChange('rsWebsite')}
                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-100 rounded-xl focus:border-[#0C9EC6] focus:outline-none transition-all font-normal"
                    placeholder="https://miempresa.com" />
                </div>
                <div className="relative">
                  <Facebook size={16} className="absolute left-3 top-[38px] text-[#1877F2]" />
                  <label className="block text-[11px] font-bold text-gray-400 uppercase mb-2 ml-1">Facebook</label>
                  <input type="url" value={form.rsFacebook} onChange={handleChange('rsFacebook')}
                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-100 rounded-xl focus:border-[#0C9EC6] focus:outline-none transition-all font-normal"
                    placeholder="https://facebook.com/miempresa" />
                </div>
                <div className="relative">
                  <Linkedin size={16} className="absolute left-3 top-[38px] text-[#0A66C2]" />
                  <label className="block text-[11px] font-bold text-gray-400 uppercase mb-2 ml-1">LinkedIn</label>
                  <input type="url" value={form.rsLinkedin} onChange={handleChange('rsLinkedin')}
                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-100 rounded-xl focus:border-[#0C9EC6] focus:outline-none transition-all font-normal"
                    placeholder="https://linkedin.com/company/miempresa" />
                </div>
                <div className="relative">
                  <Twitter size={16} className="absolute left-3 top-[38px] text-[#1DA1F2]" />
                  <label className="block text-[11px] font-bold text-gray-400 uppercase mb-2 ml-1">Twitter / X</label>
                  <input type="url" value={form.rsTwitter} onChange={handleChange('rsTwitter')}
                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-100 rounded-xl focus:border-[#0C9EC6] focus:outline-none transition-all font-normal"
                    placeholder="https://twitter.com/miempresa" />
                </div>
                <div className="relative">
                  <Instagram size={16} className="absolute left-3 top-[38px] text-[#E1306C]" />
                  <label className="block text-[11px] font-bold text-gray-400 uppercase mb-2 ml-1">Instagram</label>
                  <input type="url" value={form.rsInstagram} onChange={handleChange('rsInstagram')}
                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-100 rounded-xl focus:border-[#0C9EC6] focus:outline-none transition-all font-normal"
                    placeholder="https://instagram.com/miempresa" />
                </div>
                <div className="relative">
                  <Youtube size={16} className="absolute left-3 top-[38px] text-[#FF0000]" />
                  <label className="block text-[11px] font-bold text-gray-400 uppercase mb-2 ml-1">YouTube</label>
                  <input type="url" value={form.rsYoutube} onChange={handleChange('rsYoutube')}
                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-100 rounded-xl focus:border-[#0C9EC6] focus:outline-none transition-all font-normal"
                    placeholder="https://youtube.com/@miempresa" />
                </div>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 text-red-500 text-sm p-4 rounded-xl border border-red-100 flex items-center gap-3 mb-6 animate-shake font-normal">
                <AlertCircle size={20} /> {error}
              </div>
            )}

            {/* Acciones del formulario */}
            <div className="flex flex-col sm:flex-row items-center gap-4 pt-4 border-t border-gray-100">
              <button
                type="submit" disabled={saving}
                className="w-full sm:w-auto px-10 py-4 bg-[#0C9EC6] hover:bg-[#0E3877] text-white font-bold rounded-2xl transition-all shadow-lg shadow-[#0C9EC6]/20 flex items-center justify-center gap-2 active:scale-95 disabled:opacity-70"
              >
                {saving ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} />}
                {saving ? 'Procesando...' : 'Guardar Socio'}
              </button>
              <button
                type="button"
                onClick={() => navigate('/admin/socios')}
                className="w-full sm:w-auto px-10 py-4 bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold rounded-2xl transition-all active:scale-95"
              >
                Cancelar
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}