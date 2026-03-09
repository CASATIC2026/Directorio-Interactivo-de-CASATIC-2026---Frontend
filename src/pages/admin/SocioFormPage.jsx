import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../api/client';
import {
  Save, ArrowLeft, Building2, Globe, Phone, MapPin,
  Tag, Briefcase, Image, Share2, AlertCircle, Loader2,
  Facebook, Linkedin, Twitter, Instagram, Youtube
} from 'lucide-react';

export default function SocioFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [form, setForm] = useState({
    nombreEmpresa: '',
    slug: '',
    descripcion: '',
    especialidades: '',
    servicios: '',
    telefono: '',
    direccion: '',
    logoUrl: '',
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
                  <Image className="absolute left-3 top-[38px] text-[#0C9EC6]" size={18} />
                  <label className="block text-[11px] font-bold text-gray-400 uppercase mb-2 ml-1">URL Logo Corporativo</label>
                  <input type="text" value={form.logoUrl} onChange={handleChange('logoUrl')}
                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-100 rounded-xl focus:border-[#0C9EC6] focus:outline-none transition-all font-normal" 
                    placeholder="https://midominio.com/logo.png" />
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