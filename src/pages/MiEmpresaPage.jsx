import { useEffect, useMemo, useState } from 'react'
import { api } from '../lib/api'

export default function MiEmpresaPage() {
	const [error, setError] = useState('')
	const [ok, setOk] = useState('')
	const [empresa, setEmpresa] = useState(null)

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

		try {
			const updated = await api.actualizarMiEmpresa(payload)
			setEmpresa(updated)
			setOk('Empresa actualizada correctamente')
		} catch (err) {
			setError(err.message)
		}
	}

	if (error && !empresa) {
		return <div className="alert error">{error}</div>
	}

	if (!empresa) {
		return <div className="card">Cargando...</div>
	}

	return (
		<section className="card">
			<h2>Mi empresa</h2>
			<p className="muted">
				<strong>{empresa.nombreEmpresa}</strong>
			</p>
			{error && <div className="alert error">{error}</div>}
			{ok && <div className="alert success">{ok}</div>}

			<form onSubmit={handleSubmit}>
				<label htmlFor="descripcion">Descripción</label>
				<textarea
					id="descripcion"
					rows="4"
					value={form.descripcion}
					onChange={(event) => setForm((prev) => ({ ...prev, descripcion: event.target.value }))}
				/>

				<label htmlFor="especialidades">Especialidades (separadas por coma)</label>
				<input
					id="especialidades"
					value={form.especialidades}
					onChange={(event) => setForm((prev) => ({ ...prev, especialidades: event.target.value }))}
				/>

				<label htmlFor="servicios">Servicios (separados por coma)</label>
				<input
					id="servicios"
					value={form.servicios}
					onChange={(event) => setForm((prev) => ({ ...prev, servicios: event.target.value }))}
				/>

				<label htmlFor="redes">Redes sociales (JSON)</label>
				<textarea
					id="redes"
					rows="3"
					value={form.redesSociales}
					onChange={(event) => setForm((prev) => ({ ...prev, redesSociales: event.target.value }))}
				/>

				<label htmlFor="telefono">Teléfono</label>
				<input
					id="telefono"
					value={form.telefono}
					onChange={(event) => setForm((prev) => ({ ...prev, telefono: event.target.value }))}
				/>

				<label htmlFor="direccion">Dirección</label>
				<input
					id="direccion"
					value={form.direccion}
					onChange={(event) => setForm((prev) => ({ ...prev, direccion: event.target.value }))}
				/>

				<label htmlFor="logoUrl">Logo URL</label>
				<input
					id="logoUrl"
					value={form.logoUrl}
					onChange={(event) => setForm((prev) => ({ ...prev, logoUrl: event.target.value }))}
				/>

				<label htmlFor="marcas">Marcas que representa</label>
				<input
					id="marcas"
					value={form.marcasRepresenta}
					onChange={(event) => setForm((prev) => ({ ...prev, marcasRepresenta: event.target.value }))}
				/>

				<button type="submit">Guardar cambios</button>
			</form>
		</section>
	)
}
