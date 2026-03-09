
import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../lib/api'

export default function DirectorioPage() {
	const [items, setItems] = useState([])
	const [total, setTotal] = useState(0)
	const [error, setError] = useState('')
	const [especialidades, setEspecialidades] = useState([])
	const [servicios, setServicios] = useState([])

	const [filtros, setFiltros] = useState({
		query: '',
		especialidad: '',
		servicio: '',
		producto: '',
		page: 1,
		pageSize: 12
	})

	const totalPages = useMemo(() => {
		return Math.max(1, Math.ceil(total / filtros.pageSize))
	}, [total, filtros.pageSize])

	const cargarFiltros = async () => {
		try {
			const [esp, srv] = await Promise.all([api.obtenerEspecialidades(), api.obtenerServicios()])
			setEspecialidades(esp || [])
			setServicios(srv || [])
		} catch {
			setEspecialidades([])
			setServicios([])
		}
	}

	const buscar = async () => {
		setError('')
		try {
			const result = await api.buscarDirectorio(filtros)
			setItems(result.items || [])
			setTotal(result.total || 0)
		} catch (err) {
			setError(err.message)
		}
	}

	useEffect(() => {
		cargarFiltros()
	}, [])

	useEffect(() => {
		buscar()
	}, [filtros.page])

	const onBuscar = async (event) => {
		event.preventDefault()
		setFiltros((prev) => ({ ...prev, page: 1 }))
		await buscar()
	}

	return (
		<section>
			<h2>Directorio de Socios</h2>

			<form className="card" onSubmit={onBuscar}>
				<div className="grid-four">
					<div>
						<label htmlFor="query">Búsqueda</label>
						<input
							id="query"
							value={filtros.query}
							onChange={(event) => setFiltros((prev) => ({ ...prev, query: event.target.value }))}
							placeholder="Nombre, tecnología..."
						/>
					</div>

					<div>
						<label htmlFor="especialidad">Especialidad</label>
						<select
							id="especialidad"
							value={filtros.especialidad}
							onChange={(event) =>
								setFiltros((prev) => ({ ...prev, especialidad: event.target.value }))
							}
						>
							<option value="">Todas</option>
							{especialidades.map((item) => (
								<option value={item} key={item}>
									{item}
								</option>
							))}
						</select>
					</div>

					<div>
						<label htmlFor="servicio">Servicio</label>
						<select
							id="servicio"
							value={filtros.servicio}
							onChange={(event) => setFiltros((prev) => ({ ...prev, servicio: event.target.value }))}
						>
							<option value="">Todos</option>
							{servicios.map((item) => (
								<option value={item} key={item}>
									{item}
								</option>
							))}
						</select>
					</div>

					<div>
						<label htmlFor="producto">Producto</label>
						<input
							id="producto"
							value={filtros.producto}
							onChange={(event) => setFiltros((prev) => ({ ...prev, producto: event.target.value }))}
							placeholder="Marca, producto..."
						/>
					</div>
				</div>

				<button type="submit">Buscar</button>
			</form>

			{error && <div className="alert error">{error}</div>}
			<p className="muted">Resultados: {total}</p>

			<div className="grid-cards">
				{items.map((item) => (
					<article className="card" key={item.id}>
						<h3>{item.nombreEmpresa}</h3>
						<p>{item.descripcion}</p>
						<p className="muted">{(item.especialidades || []).join(', ')}</p>
						<Link to={`/directorio/${item.id}`}>Ver detalle</Link>
					</article>
				))}
			</div>

			<div className="pagination">
				<button
					type="button"
					className="btn-secondary"
					onClick={() => setFiltros((prev) => ({ ...prev, page: prev.page - 1 }))}
					disabled={filtros.page <= 1}
				>
					Anterior
				</button>
				<span>
					Página {filtros.page} de {totalPages}
				</span>
				<button
					type="button"
					onClick={() => setFiltros((prev) => ({ ...prev, page: prev.page + 1 }))}
					disabled={filtros.page >= totalPages}
				>
					Siguiente
				</button>
			</div>
		</section>
	)
}
