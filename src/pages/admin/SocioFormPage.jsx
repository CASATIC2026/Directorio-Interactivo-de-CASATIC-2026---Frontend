import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../api/client';
import {
  Save, ArrowLeft, Building2, Globe, Phone, MapPin,
  Tag, Briefcase, Image, Share2, AlertCircle, Loader2
} from 'lucide-react';

export default function SocioFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [form, setForm] = useState({
    nombreEmpresa: '',
    slug: '',
    descripcion: '',
    telefono: '',
    direccion: '',
    logoUrl: '',
    marcasRepresenta: '',
    especialidades: '',
    servicios: '',
    redesSociales: '{}',
  });
  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isEditing) return;
    api.get(`/socios/${id}`)
      .then((r) => {
        const s = r.data;
        setForm({
          nombreEmpresa: s.nombreEmpresa || '',
          slug: s.slug || '',
          descripcion: s.descripcion || '',
          telefono: s.telefono || '',
          direccion: s.direccion || '',
          logoUrl: s.logoUrl || '',
          marcasRepresenta: s.marcasRepresenta || '',
          especialidades: (s.especialidades || []).join(', '),
          servicios: (s.servicios || []).join(', '),
          redesSociales: s.redesSociales || '{}',
        });
      })
      .catch(() => setError('No se pudo cargar el socio.'))
      .finally(() => setLoading(false));
  }, [id, isEditing]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    const payload = {
      ...form,
      especialidades: form.especialidades.split(',').map((s) => s.trim()).filter(Boolean),
      servicios: form.servicios.split(',').map((s) => s.trim()).filter(Boolean),
    };
    try {
      if (isEditing) {
        await api.put(`/socios/${id}`, payload);
      } else {
        await api.post('/socios', payload);
      }
      navigate('/admin/socios');
    } catch (err) {
      setError(err.response?.data?.message || 'Error al guardar el socio.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="w-10 h-10 border-4 border-[#0E3877]/20 border-t-[#0E3877] rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate('/admin/socios')} className="p-2 hover:bg-gray-100 rounded-lg transition">
          <ArrowLeft size={20} className="text-gray-500" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-[#0A0A0A] flex items-center gap-2">
            <Building2 size={24} className="text-[#0E3877]" />
            {isEditing ? 'Editar Socio' : 'Nuevo Socio'}
          </h1>
        </div>
      </div>

      {error && (
        <div className="mb-4 flex items-center gap-2 text-red-500 text-sm bg-red-50 p-3 rounded-lg border border-red-100">
          <AlertCircle size={16} /> {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4">
        {/* Nombre */}
        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wider">
            Nombre de Empresa *
          </label>
          <div className="relative">
            <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 text-[#0E3877]" size={16} />
            <input name="nombreEmpresa" required value={form.nombreEmpresa} onChange={handleChange}
              className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#0C9EC6]"
              placeholder="Ej: TechCorp S.R.L." />
          </div>
        </div>

        {/* Slug */}
        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wider">
            Slug <span className="text-gray-300">(auto-generado si se deja vacío)</span>
          </label>
          <input name="slug" value={form.slug} onChange={handleChange}
            className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#0C9EC6]"
            placeholder="techcorp-srl" />
        </div>

        {/* Descripción */}
        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wider">
            Descripción <span className="text-gray-300">(máx. 150 palabras)</span>
          </label>
          <textarea name="descripcion" value={form.descripcion} onChange={handleChange} rows={3}
            className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#0C9EC6] resize-none"
            placeholder="Descripción de la empresa..." />
        </div>

        {/* Teléfono & Dirección */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wider">Teléfono</label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-[#0E3877]" size={14} />
              <input name="telefono" value={form.telefono} onChange={handleChange}
                className="w-full pl-8 pr-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#0C9EC6]"
                placeholder="+591..." />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wider">Dirección</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-[#0E3877]" size={14} />
              <input name="direccion" value={form.direccion} onChange={handleChange}
                className="w-full pl-8 pr-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#0C9EC6]"
                placeholder="Av. ..." />
            </div>
          </div>
        </div>

        {/* Logo URL */}
        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wider">Logo URL</label>
          <div className="relative">
            <Image className="absolute left-3 top-1/2 -translate-y-1/2 text-[#0E3877]" size={14} />
            <input name="logoUrl" value={form.logoUrl} onChange={handleChange}
              className="w-full pl-8 pr-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#0C9EC6]"
              placeholder="https://..." />
          </div>
        </div>

        {/* Especialidades */}
        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wider">
            Especialidades <span className="text-gray-300">(separadas por coma)</span>
          </label>
          <div className="relative">
            <Tag className="absolute left-3 top-1/2 -translate-y-1/2 text-[#0E3877]" size={14} />
            <input name="especialidades" value={form.especialidades} onChange={handleChange}
              className="w-full pl-8 pr-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#0C9EC6]"
              placeholder="Software, IoT, Ciberseguridad" />
          </div>
        </div>

        {/* Servicios */}
        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wider">
            Servicios <span className="text-gray-300">(separados por coma)</span>
          </label>
          <div className="relative">
            <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 text-[#0E3877]" size={14} />
            <input name="servicios" value={form.servicios} onChange={handleChange}
              className="w-full pl-8 pr-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#0C9EC6]"
              placeholder="Consultoría, Desarrollo, Soporte" />
          </div>
        </div>

        {/* Marcas */}
        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wider">
            Marcas que representa <span className="text-gray-300">(máx. 50 palabras)</span>
          </label>
          <input name="marcasRepresenta" value={form.marcasRepresenta} onChange={handleChange}
            className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#0C9EC6]"
            placeholder="Cisco, Microsoft..." />
        </div>

        {/* Redes Sociales */}
        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wider flex items-center gap-1">
            <Share2 size={12} /> Redes Sociales <span className="text-gray-300">(JSON)</span>
          </label>
          <textarea name="redesSociales" value={form.redesSociales} onChange={handleChange} rows={2}
            className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm font-mono focus:outline-none focus:border-[#0C9EC6] resize-none"
            placeholder='{"linkedin":"https://...","facebook":"https://..."}' />
        </div>

        <div className="flex gap-3 pt-2">
          <button type="button" onClick={() => navigate('/admin/socios')}
            className="flex-1 py-2.5 border-2 border-gray-200 text-gray-600 rounded-lg text-sm font-semibold hover:bg-gray-50 transition">
            Cancelar
          </button>
          <button type="submit" disabled={saving}
            className="flex-1 py-2.5 bg-[#0E3877] hover:bg-[#0C9EC6] text-white rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition active:scale-95">
            {saving
              ? <Loader2 size={18} className="animate-spin" />
              : <><Save size={16} /> {isEditing ? 'Guardar cambios' : 'Crear socio'}</>}
          </button>
        </div>
      </form>
    </div>
  );
}

