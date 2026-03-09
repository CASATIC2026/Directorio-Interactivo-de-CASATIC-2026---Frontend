import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../lib/api'

export default function CambiarPasswordPage() {
	const navigate = useNavigate()
	const [nuevaPassword, setNuevaPassword] = useState('')
	const [error, setError] = useState('')
	const [message, setMessage] = useState('')

	const handleSubmit = async (event) => {
		event.preventDefault()
		setError('')
		setMessage('')

		try {
			await api.cambiarPassword({ nuevaPassword })
			setMessage('Contraseña actualizada correctamente.')
			setTimeout(() => navigate('/directorio'), 800)
		} catch (err) {
			setError(err.message)
		}
	}

	return (
		<section className="card form-card">
			<h2>Cambiar contraseña</h2>
			{error && <div className="alert error">{error}</div>}
			{message && <div className="alert success">{message}</div>}

			<form onSubmit={handleSubmit}>
				<label htmlFor="nuevaPassword">Nueva contraseña</label>
				<input
					id="nuevaPassword"
					type="password"
					value={nuevaPassword}
					onChange={(event) => setNuevaPassword(event.target.value)}
					minLength={8}
					required
				/>

				<button type="submit">Guardar</button>
			</form>
		</section>
	)
}
