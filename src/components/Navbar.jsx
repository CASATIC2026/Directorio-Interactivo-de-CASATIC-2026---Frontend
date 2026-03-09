import { Link, useNavigate } from 'react-router-dom'
import { clearSession, getUser, isAuthenticated } from '../lib/auth'

export default function Navbar() {
	const navigate = useNavigate()
	const user = getUser()

	const handleLogout = () => {
		clearSession()
		navigate('/login')
	}

	return (
		<header className="nav">
			<div className="nav-brand">CASATIC</div>
			<nav className="nav-links">
				<Link to="/directorio">Directorio</Link>
				{isAuthenticated() && (user?.rol === 'Usuario' || user?.rol === 'Socio') && (
					<Link to="/mi-empresa">Mi empresa</Link>
				)}
				{!isAuthenticated() ? (
					<Link to="/login">Login</Link>
				) : (
					<button className="btn-secondary" onClick={handleLogout} type="button">
						Salir
					</button>
				)}
			</nav>
		</header>
	)
}
