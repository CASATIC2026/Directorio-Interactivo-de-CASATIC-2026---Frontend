import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/client';
import { resolveAssetUrl } from '../../utils/assetUrl';
import {
  Plus, Search, Calendar, MapPin, RefreshCw,
  Trash2, Check, X, ChevronDown, ChevronUp, Upload, Image
} from 'lucide-react';

const TIPOS = ['Conferencia', 'Capacitacion', 'Webinar', 'Networking', 'Feria', 'Taller', 'Seminario', 'Expo', 'Lanzamiento', 'Reunion'];
const TIPO_VALUES = TIPOS.reduce((acc, tipo, index) => ({ ...acc, [tipo]: index }), {});
const TIPO_LABELS = {
  Conferencia: 'Conferencia', Capacitacion: 'Capacitación', Webinar: 'Webinar',
  Networking: 'Networking', Feria: 'Feria', Taller: 'Taller',
  Seminario: 'Seminario', Expo: 'Expo', Lanzamiento: 'Lanzamiento', Reunion: 'Reunión',
};
const MODALIDADES = [
  { value: 'Presencial', label: 'Presencial' },
  { value: 'Virtual',    label: 'Virtual' },
  { value: 'Hibrido',   label: 'Híbrida' },
];
const MODALIDAD_VALUES = { Presencial: 0, Virtual: 1, Hibrido: 2 };

function formatDate(iso) {
  return new Date(iso).toLocaleString('es-SV', {
    year: 'numeric', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

function EventoForm({ socios, onSave, onCancel, defaultSocioId = '', isSocio = false }) {
  const fileInputRef = useRef(null);
  const [form, setForm] = useState({
    socioId: defaultSocioId,
    titulo: '',
    descripcion: '',
    tipo: 'Conferencia',
    modalidad: 'Presencial',
    fechaInicio: '',
    fechaFin: '',
    lugar: '',
    imagenUrl: '',
  });
  const [imageFile, setImageFile]     = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [uploading, setUploading]     = useState(false);
  const [saving, setSaving]           = useState(false);
  const [error, setError]             = useState('');
  const resolvedPreview = imagePreview || resolveAssetUrl(form.imagenUrl);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleImagePick = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const clearImage = () => {
    setImageFile(null);
    setImagePreview('');
    setForm(prev => ({ ...prev, imagenUrl: '' }));
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      let imagenUrl = form.imagenUrl;

      if (imageFile) {
        setUploading(true);
        const fd = new FormData();
        fd.append('file', imageFile);
        const { data } = await api.post('/upload/image', fd, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        imagenUrl = data.url;
        setUploading(false);
      }

      await onSave({
        ...form,
        tipo: TIPO_VALUES[form.tipo],
        modalidad: MODALIDAD_VALUES[form.modalidad],
        imagenUrl,
      });
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.title || 'Error al guardar el evento');
      setUploading(false);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-card p-6 border border-surface-100">
      <h3 className="text-lg font-bold text-surface-900 mb-4">Crear Nuevo Evento</h3>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700 flex items-center gap-2">
          <X size={14} className="flex-shrink-0" /> {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Socio — oculto para socios, dropdown para admin */}
          {!isSocio && (
            <div>
              <label className="block text-sm font-semibold text-surface-700 mb-1">Socio *</label>
              <select name="socioId" value={form.socioId} onChange={handleChange} required className="input-field w-full">
                <option value="">Selecciona un socio</option>
                {socios.map(s => (
                  <option key={s.id} value={s.id}>{s.nombreEmpresa}</option>
                ))}
              </select>
            </div>
          )}

          <div className={isSocio ? 'md:col-span-2' : ''}>
            <label className="block text-sm font-semibold text-surface-700 mb-1">Título *</label>
            <input
              type="text" name="titulo" value={form.titulo} onChange={handleChange}
              required className="input-field w-full" placeholder="Título del evento"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-surface-700 mb-1">Descripción *</label>
          <textarea
            name="descripcion" value={form.descripcion} onChange={handleChange}
            required rows="4" className="input-field w-full" placeholder="Describe el evento"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-surface-700 mb-1">Tipo *</label>
            <select name="tipo" value={form.tipo} onChange={handleChange} className="input-field w-full">
              {TIPOS.map(t => <option key={t} value={t}>{TIPO_LABELS[t]}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-surface-700 mb-1">Modalidad *</label>
            <select name="modalidad" value={form.modalidad} onChange={handleChange} className="input-field w-full">
              {MODALIDADES.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-surface-700 mb-1">Fecha de Inicio *</label>
            <input
              type="datetime-local" name="fechaInicio" value={form.fechaInicio}
              onChange={handleChange} required className="input-field w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-surface-700 mb-1">Fecha de Fin</label>
            <input
              type="datetime-local" name="fechaFin" value={form.fechaFin}
              onChange={handleChange} className="input-field w-full"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-surface-700 mb-1">Lugar</label>
          <input
            type="text" name="lugar" value={form.lugar} onChange={handleChange}
            className="input-field w-full" placeholder="Dirección o enlace del evento"
          />
        </div>

        {/* Imagen */}
        <div>
          <label className="block text-sm font-semibold text-surface-700 mb-1">Imagen del evento</label>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleImagePick}
            className="hidden"
          />

          {resolvedPreview ? (
            <div className="relative w-full aspect-[16/9] rounded-xl overflow-hidden border border-surface-200 group bg-casatic-50">
              <img src={resolvedPreview} alt="Preview" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={clearImage}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                title="Quitar imagen"
              >
                <X size={14} />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => fileInputRef.current.click()}
              className="w-full aspect-[16/9] rounded-xl border-2 border-dashed border-surface-300 hover:border-casatic-500 flex flex-col items-center justify-center gap-2 text-surface-400 hover:text-casatic-600 transition-colors"
            >
              <Upload size={24} />
              <span className="text-sm font-medium">Subir imagen desde la computadora</span>
              <span className="text-xs">Cualquier imagen — máx. 10 MB</span>
            </button>
          )}
          <div className="mt-3 flex flex-col sm:flex-row gap-2">
            <input
              type="url"
              name="imagenUrl"
              value={form.imagenUrl}
              onChange={(e) => {
                setImageFile(null);
                setImagePreview('');
                if (fileInputRef.current) fileInputRef.current.value = '';
                handleChange(e);
              }}
              className="input-field flex-1"
              placeholder="O pega una URL de imagen"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current.click()}
              className="btn-secondary whitespace-nowrap"
            >
              <Upload size={16} /> Seleccionar archivo
            </button>
          </div>
        </div>

        <div className="flex gap-3 justify-end pt-2">
          <button type="button" onClick={onCancel} className="btn-secondary">Cancelar</button>
          <button type="submit" disabled={saving} className="btn-primary">
            {uploading ? (
              <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Subiendo imagen…</>
            ) : saving ? (
              <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Guardando…</>
            ) : (
              <><Check size={16} /> Crear Evento</>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

function EventoRow({ evento, onAprobar, onRechazar, onEliminar, onExpand, expanded, isAdmin }) {
  const imagenUrl = resolveAssetUrl(evento.imagenUrl);

  return (
    <>
      <tr className="border-b border-surface-100 hover:bg-casatic-50 transition-colors">
        <td className="px-4 py-3">
          <div className="font-semibold text-surface-900 text-sm">{evento.titulo}</div>
          {isAdmin && <div className="text-xs text-surface-500 mt-0.5">{evento.socioNombre}</div>}
        </td>
        <td className="px-4 py-3 text-sm text-surface-600 whitespace-nowrap">
          <span className="inline-flex items-center gap-1">
            <Calendar size={13} /> {new Date(evento.fechaInicio).toLocaleDateString('es-SV')}
          </span>
        </td>
        <td className="px-4 py-3 text-sm">
          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
            evento.estado === 'Aprobado'  ? 'bg-green-100 text-green-700' :
            evento.estado === 'Pendiente' ? 'bg-amber-100 text-amber-700' :
                                            'bg-red-100 text-red-700'
          }`}>
            {evento.estado}
          </span>
        </td>
        <td className="px-4 py-3 text-right">
          <div className="flex items-center justify-end gap-1.5">
            <button onClick={onExpand} className="btn-icon btn-ghost" title="Ver detalles">
              {expanded ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
            </button>
            {isAdmin && evento.estado === 'Pendiente' && (
              <>
                <button onClick={() => onAprobar(evento.id)} className="btn-icon btn-success-outline" title="Aprobar">
                  <Check size={15} />
                </button>
                <button onClick={() => onRechazar(evento.id)} className="btn-icon btn-danger-outline" title="Denegar">
                  <X size={15} />
                </button>
              </>
            )}
            {isAdmin && (
              <button onClick={() => onEliminar(evento.id)} className="btn-icon btn-danger-outline" title="Eliminar">
                <Trash2 size={15} />
              </button>
            )}
          </div>
        </td>
      </tr>
      {expanded && (
        <tr className="bg-surface-50 border-b border-surface-100">
          <td colSpan="4" className="px-4 py-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="md:col-span-2">
                <span className="font-semibold text-surface-700">Descripción:</span>
                <p className="text-surface-600 mt-1">{evento.descripcion}</p>
              </div>
              <div className="space-y-2">
                <div><span className="font-semibold text-surface-700">Tipo: </span><span className="text-surface-600">{TIPO_LABELS[evento.tipo] ?? evento.tipo}</span></div>
                <div><span className="font-semibold text-surface-700">Modalidad: </span><span className="text-surface-600">{MODALIDADES.find(m => m.value === evento.modalidad)?.label ?? evento.modalidad}</span></div>
                {evento.lugar && (
                  <div className="flex items-start gap-1">
                    <MapPin size={13} className="mt-0.5 text-surface-500 flex-shrink-0" />
                    <span className="text-surface-600">{evento.lugar}</span>
                  </div>
                )}
                {imagenUrl && (
                  <div>
                    <img src={imagenUrl} alt="Imagen" className="w-full aspect-[16/9] object-cover rounded-lg mt-1" />
                  </div>
                )}
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

export default function EventosAdminPage() {
  const { user } = useAuth();
  const isAdmin = user?.rol === 'Admin';

  const [eventos, setEventos]     = useState([]);
  const [socios, setSocios]       = useState([]);
  const [loading, setLoading]     = useState(true);
  const [showForm, setShowForm]   = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedId, setExpandedId] = useState(null);
  const [filtro, setFiltro]       = useState('todos');
  const [saveError, setSaveError] = useState('');

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const eventosRes = await api.get('/eventos');
      setEventos(eventosRes.data || []);

      if (isAdmin) {
        const sociosRes = await api.get('/directorio', {
          params: { page: 1, pageSize: 1000 },
        });
        setSocios(sociosRes.data?.items || []);
      }
    } catch (err) {
      console.error('Error cargando datos:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (formData) => {
    setSaveError('');
    await api.post('/eventos', formData);
    setShowForm(false);
    await loadData();
  };

  const handleAprobar = async (id) => {
    try {
      await api.put(`/eventos/${id}/aprobar`);
      await loadData();
    } catch (err) {
      console.error('Error aprobando evento:', err);
      if (err.response?.status === 403) {
        alert('No se pudo aprobar el evento: esta accion requiere iniciar sesion como administrador.');
        return;
      }
      alert(err.response?.data?.message || err.response?.data?.title || 'No se pudo aprobar el evento');
    }
  };

  const handleRechazar = async (id) => {
    if (!window.confirm('¿Denegar este evento?')) return;
    try {
      await api.put(`/eventos/${id}/rechazar`);
      await loadData();
    } catch (err) {
      console.error('Error denegando evento:', err);
      if (err.response?.status === 403) {
        alert('No se pudo denegar el evento: esta accion requiere iniciar sesion como administrador.');
        return;
      }
      alert(err.response?.data?.message || err.response?.data?.title || 'No se pudo denegar el evento');
    }
  };

  const handleEliminar = async (id) => {
    if (!window.confirm('¿Eliminar este evento?')) return;
    try {
      await api.delete(`/eventos/${id}`);
      await loadData();
    } catch (err) {
      console.error('Error eliminando evento:', err);
    }
  };

  const filtered = eventos.filter(e => {
    const matchSearch = e.titulo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchFiltro = filtro === 'todos' || e.estado === filtro;
    return matchSearch && matchFiltro;
  });

  // SocioId para pre-rellenar el form cuando es un Socio
  const defaultSocioId = isAdmin ? '' : (user?.socioId ?? '');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-surface-900 dark:text-white">Gestión de Eventos</h1>
          <p className="text-surface-600 dark:text-surface-400 text-sm mt-1">
            {isAdmin ? 'Crea, aprueba y gestiona todos los eventos' : 'Crea y gestiona los eventos de tu empresa'}
          </p>
        </div>
        <button onClick={() => { setShowForm(!showForm); setSaveError(''); }} className="btn-primary">
          <Plus size={18} /> Nuevo Evento
        </button>
      </div>

      {/* Formulario */}
      {showForm && (
        <EventoForm
          socios={socios}
          onSave={handleCreate}
          onCancel={() => setShowForm(false)}
          defaultSocioId={defaultSocioId}
          isSocio={!isAdmin}
        />
      )}

      {/* Filtros */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Search size={17} className="absolute left-3 top-3 text-surface-400" />
          <input
            type="text" placeholder="Buscar eventos..." value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="input-field w-full pl-10"
          />
        </div>
        <select value={filtro} onChange={e => setFiltro(e.target.value)} className="input-field">
          <option value="todos">Todos los estados</option>
          <option value="Pendiente">Pendientes</option>
          <option value="Aprobado">Aprobados</option>
          <option value="Rechazado">Rechazados</option>
        </select>
        <button onClick={loadData} className="btn-secondary" title="Recargar">
          <RefreshCw size={17} />
        </button>
      </div>

      {/* Tabla */}
      <div className="bg-white dark:bg-surface-900 rounded-2xl shadow-card border border-surface-100 dark:border-surface-700 overflow-hidden">
        {loading ? (
          <div className="p-10 text-center">
            <div className="inline-block w-8 h-8 border-4 border-casatic-200 border-t-casatic-600 rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-10 text-center text-surface-500 dark:text-surface-400">
            <Calendar size={32} className="mx-auto mb-3 opacity-40" />
            <p className="font-medium">No hay eventos para mostrar</p>
            <p className="text-xs mt-1">Crea el primero con el botón "Nuevo Evento"</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-casatic-50 dark:bg-surface-800 border-b border-surface-100 dark:border-surface-700">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-surface-700 dark:text-surface-300">Evento</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-surface-700 dark:text-surface-300">Fecha</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-surface-700 dark:text-surface-300">Estado</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-surface-700 dark:text-surface-300">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(evento => (
                  <EventoRow
                    key={evento.id}
                    evento={evento}
                    isAdmin={isAdmin}
                    onAprobar={handleAprobar}
                    onRechazar={handleRechazar}
                    onEliminar={handleEliminar}
                    onExpand={() => setExpandedId(expandedId === evento.id ? null : evento.id)}
                    expanded={expandedId === evento.id}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
