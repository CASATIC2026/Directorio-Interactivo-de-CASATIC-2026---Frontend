import { Link } from 'react-router-dom'

export default function NotFoundPage() {
	return (
		<section className="card">
			<h2>Página no encontrada</h2>
			<p>La ruta solicitada no existe.</p>
			<Link to="/directorio">Ir al directorio</Link>
		</section>
	)
}
