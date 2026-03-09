import { useEffect, useMemo, useState } from 'react'
import { api } from '../lib/api'
import {
  Building2, Save, CheckCircle, AlertCircle, Loader2,
  FileText, Tag, Wrench, Globe, Phone, MapPin, Image, Award
} from 'lucide-react'

const Field = ({ label, icon: Icon, hint, children }) => (
  <div>
    <label className="input-label flex items-center gap-1.5">
      {Icon && <Icon size={13} className="text-casatic-500" />}
      {label}
      {hint && <span className="text-surface-400 font-normal text-xs">({hint})</span>}
    </label>
    {children}
  </div>
)

export default function MiEmpresaPage() {
  const [error, setError] = useState('')
  const [ok, setOk] = useState('')
  const [empresa, setEmpresa] = useState(null)
  const [saving, setSaving] = useState(false)

  const [form, setForm] = useState({
    descripcion: '',
    especialidades: '',
    servicios: '',
    redesSociales: '{}',
    telefono: '',
    direccion: '',
    logoUrl: '',
    marcasRepresenta: ''
  })

  const payload = useMemo(
    () => ({
      descripcion: form.descripcion,
      especialidades: form.especialidades.split(',').map((item) => item.trim()).filter(Boolean),
      servicios: form.servicios.split(',').map((item) => item.trim()).filter(Boolean),
      redesSociales: form.redesSociales,
      telefono: form.telefono,
      direccion: form.direccion,
      logoUrl: form.logoUrl,
      marcasRepresenta: form.marcasRepresenta
    }),
    [form]
  )

  useEffect(() => {
    const cargar = async () => {
      setError('')
      try {
        const data = await api.obtenerMiEmpresa()
        setEmpresa(data)
        setForm({
          descripcion: data.descripcion || '',
          especialidades: (data.especialidades || []).join(', '),
          servicios: (data.servicios || []).join(', '),
          redesSociales: data.redesSociales || '{}',
          telefono: data.telefono || '',
          direccion: data.direccion || '',
          logoUrl: data.logoUrl || '',
          marcasRepresenta: data.marcasRepresenta || ''
        })
      } catch (err) {
        setError(err.message)
      }
    }
    cargar()
  }, [])

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setOk('')
    setSaving(true)
    try {
      const updated = await api.actualizarMiEmpresa(payload)
      setEmpresa(updated)
      setOk('Empresa actualizada correctamente')
      setTimeout(() => setOk(''), 4000)
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  const set = (key) => (e) => setForm((prev) => ({ ...prev, [key]: e.target.value }))

  if (error && !empresa) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
        <div className="alert-error">
          <AlertCircle size={16} /> {error}
        </div>
      </div>
    )
  }

  if (!empresa) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="flex flex-col items-center gap-3 text-surface-400">
          <Loader2 size={32} className="animate-spin" />
          <p className="text-sm">Cargando información de su empresa...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-0 py-6 sm:py-8 space-y-6">
      {/* Head */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 bg-casatic-100 rounded-2xl flex items-center justify-center flex-shrink-0">
            <Building2 size={22} className="text-casatic-600" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-surface-900">Mi Empresa</h1>
            <p className="text-sm text-surface-500 truncate max-w-xs">{empresa.nombreEmpresa}</p>
          </div>
        </div>
      </div>

      {/* Alerts */}
      {error && (
        <div className="alert-error"><AlertCircle size={16} /> {error}</div>
      )}
      {ok && (
        <div className="alert-success"><CheckCircle size={16} /> {ok}</div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Descripción */}
        <div className="card-base p-5 sm:p-6 space-y-4">
          <h2 className="font-semibold text-surface-800 flex items-center gap-2 text-sm uppercase tracking-widest text-surface-400">
            <FileText size={14} /> Información General
          </h2>
          <Field label="Descripción" icon={FileText}>
            <textarea
              id="descripcion"
              rows="4"
              value={form.descripcion}
              onChange={set('descripcion')}
              className="input-field resize-none"
              placeholder="Describe brevemente la empresa..."
            />
          </Field>

          <Field label="URL del Logo" icon={Image}>
            <input
              id="logoUrl"
              type="url"
              value={form.logoUrl}
              onChange={set('logoUrl')}
              className="input-field"
              placeholder="https://..."
            />
          </Field>
        </div>

        {/* Especialidades y servicios */}
        <div className="card-base p-5 sm:p-6 space-y-4">
          <h2 className="font-semibold text-sm uppercase tracking-widest text-surface-400 flex items-center gap-2">
            <Tag size={14} /> Especialidades y Servicios
          </h2>
          <Field label="Especialidades" icon={Tag} hint="separadas por coma">
            <input
              id="especialidades"
              value={form.especialidades}
              onChange={set('especialidades')}
              className="input-field"
              placeholder="Ej: Software, Ciberseguridad, Cloud"
            />
          </Field>
          <Field label="Servicios" icon={Wrench} hint="separados por coma">
            <input
              id="servicios"
              value={form.servicios}
              onChange={set('servicios')}
              className="input-field"
              placeholder="Ej: Consultoría, Desarrollo, Soporte"
            />
          </Field>
          <Field label="Marcas que representa" icon={Award}>
            <input
              id="marcas"
              value={form.marcasRepresenta}
              onChange={set('marcasRepresenta')}
              className="input-field"
              placeholder="Ej: Microsoft, Cisco, Oracle"
            />
          </Field>
        </div>

        {/* Contacto */}
        <div className="card-base p-5 sm:p-6 space-y-4">
          <h2 className="font-semibold text-sm uppercase tracking-widest text-surface-400 flex items-center gap-2">
            <Phone size={14} /> Contacto y Ubicación
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Teléfono" icon={Phone}>
              <input
                id="telefono"
                value={form.telefono}
                onChange={set('telefono')}
                className="input-field"
                placeholder="+504 0000-0000"
              />
            </Field>
            <Field label="Dirección" icon={MapPin}>
              <input
                id="direccion"
                value={form.direccion}
                onChange={set('direccion')}
                className="input-field"
                placeholder="Ciudad, País"
              />
            </Field>
          </div>
        </div>

        {/* Redes sociales */}
        <div className="card-base p-5 sm:p-6 space-y-4">
          <h2 className="font-semibold text-sm uppercase tracking-widest text-surface-400 flex items-center gap-2">
            <Globe size={14} /> Redes Sociales
          </h2>
          <Field label="Redes Sociales" icon={Globe} hint="formato JSON">
            <textarea
              id="redes"
              rows="3"
              value={form.redesSociales}
              onChange={set('redesSociales')}
              className="input-field resize-none font-mono text-xs"
              placeholder='{"facebook": "...", "linkedin": "...", "twitter": "..."}'
            />
          </Field>
        </div>

        {/* Submit */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="btn-primary btn-lg w-full sm:w-auto"
          >
            {saving ? (
              <><Loader2 size={18} className="animate-spin" /> Guardando...</>
            ) : (
              <><Save size={18} /> Guardar cambios</>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
