import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { api } from '../lib/api'
import { saveSession } from '../lib/auth'

export default function LoginPage() {
	const navigate = useNavigate()
	const location = useLocation()
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [error, setError] = useState('')

	const handleSubmit = async (event) => {
		event.preventDefault()
		setError('')

		try {
			const result = await api.login({ email, password })
			saveSession(result)

			if (result.primerLogin) {
				navigate('/cambiar-password')
				return
			}

			const redirectTo = location.state?.from || '/directorio'
			navigate(redirectTo)
		} catch (err) {
			setError(err.message)
		}
	}

	return (
		<section className="card form-card">
			<h2>Iniciar sesión</h2>
			{error && <div className="alert error">{error}</div>}

			<form onSubmit={handleSubmit}>
				<label htmlFor="email">Correo</label>
				<input
					id="email"
					type="email"
					value={email}
					onChange={(event) => setEmail(event.target.value)}
					required
				/>

				<label htmlFor="password">Contraseña</label>
				<input
					id="password"
					type="password"
					value={password}
					onChange={(event) => setPassword(event.target.value)}
					required
				/>

				<button type="submit">Entrar</button>
			</form>
		</section>
	)
}
