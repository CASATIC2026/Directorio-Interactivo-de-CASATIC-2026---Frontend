import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { api } from '../lib/api'

export default function SocioDetallePage() {
	const { id } = useParams()
	const [socio, setSocio] = useState(null)
	const [error, setError] = useState('')
	const [ok, setOk] = useState('')
	const [form, setForm] = useState({
		nombre: '',
		correo: '',
		mensaje: ''
	})

	useEffect(() => {
		const cargar = async () => {
			setError('')
			try {
				const result = await api.obtenerSocioPorId(id)
				setSocio(result)
			} catch (err) {
				setError(err.message)
			}
		}

		cargar()
	}, [id])

	const onSubmit = async (event) => {
		event.preventDefault()
		setError('')
		setOk('')

		try {
			await api.enviarFormulario(id, form)
			setOk('Mensaje enviado correctamente')
			setForm({ nombre: '', correo: '', mensaje: '' })
		} catch (err) {
			setError(err.message)
		}
	}

	if (error) {
		return <div className="alert error">{error}</div>
	}

	if (!socio) {
		return <div className="card">Cargando...</div>
	}

	return (
		<section>
			<article className="card">
				<h2>{socio.nombreEmpresa}</h2>
				<p>{socio.descripcion}</p>
				<p>
					<strong>Especialidades:</strong> {(socio.especialidades || []).join(', ')}
				</p>
				<p>
					<strong>Servicios:</strong> {(socio.servicios || []).join(', ')}
				</p>
				<p>
					<strong>Teléfono:</strong> {socio.telefono || 'N/D'}
				</p>
				<p>
					<strong>Dirección:</strong> {socio.direccion || 'N/D'}
				</p>
				<p>
					<strong>Marcas:</strong> {socio.marcasRepresenta || 'N/D'}
				</p>
			</article>

			<article className="card">
				<h3>Formulario de contacto</h3>
				{ok && <div className="alert success">{ok}</div>}
				{error && <div className="alert error">{error}</div>}

				<form onSubmit={onSubmit}>
					<label htmlFor="nombre">Nombre</label>
					<input
						id="nombre"
						value={form.nombre}
						onChange={(event) => setForm((prev) => ({ ...prev, nombre: event.target.value }))}
						required
					/>

					<label htmlFor="correo">Correo</label>
					<input
						id="correo"
						type="email"
						value={form.correo}
						onChange={(event) => setForm((prev) => ({ ...prev, correo: event.target.value }))}
						required
					/>

					<label htmlFor="mensaje">Mensaje</label>
					<textarea
						id="mensaje"
						rows="4"
						value={form.mensaje}
						onChange={(event) => setForm((prev) => ({ ...prev, mensaje: event.target.value }))}
						required
					/>

					<button type="submit">Enviar</button>
				</form>
			</article>
		</section>
	)
}
