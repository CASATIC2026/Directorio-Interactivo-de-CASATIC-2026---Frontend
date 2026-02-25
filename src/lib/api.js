import { clearSession, getToken } from './auth'

const BASE_URL = import.meta.env.VITE_API_URL || '/api'

async function request(path, options = {}) {
	const token = getToken()
	const headers = {
		'Content-Type': 'application/json',
		...(options.headers || {})
	}

	if (token) {
		headers.Authorization = `Bearer ${token}`
	}

	const response = await fetch(`${BASE_URL}${path}`, {
		...options,
		headers
	})

	if (response.status === 401) {
		clearSession()
	}

	const text = await response.text()
	const data = text ? JSON.parse(text) : null

	if (!response.ok) {
		throw new Error(data?.message || 'Error en la solicitud')
	}

	return data
}

export const api = {
	login: (payload) =>
		request('/auth/login', {
			method: 'POST',
			body: JSON.stringify(payload)
		}),

	cambiarPassword: (payload) =>
		request('/auth/cambiar-password', {
			method: 'POST',
			body: JSON.stringify(payload)
		}),

	me: () => request('/auth/me'),

	buscarDirectorio: (filters = {}) => {
		const query = new URLSearchParams()

		Object.entries(filters).forEach(([key, value]) => {
			if (value !== undefined && value !== null && String(value).trim() !== '') {
				query.set(key, value)
			}
		})

		return request(`/directorio?${query.toString()}`)
	},

	obtenerEspecialidades: () => request('/directorio/especialidades'),
	obtenerServicios: () => request('/directorio/servicios'),
	obtenerSocioPorId: (id) => request(`/directorio/company/${id}`),

	enviarFormulario: (socioId, payload) =>
		request(`/formulariocontacto/${socioId}`, {
			method: 'POST',
			body: JSON.stringify(payload)
		}),

	obtenerMiEmpresa: () => request('/miempresa'),

	actualizarMiEmpresa: (payload) =>
		request('/miempresa', {
			method: 'PUT',
			body: JSON.stringify(payload)
		})
}
