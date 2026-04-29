/**
 * Cliente HTTP centralizado para CASATIC
 * Usa Fetch API con manejo de autenticación y errores
 * 
 * Para componentes que requieran solicitudes más complejas (multipart),
 * ver api/client.js que usa Axios
 */

import { clearSession, getToken } from './auth'

const BASE_URL = import.meta.env.VITE_API_URL || '/api'

/**
 * Realiza una solicitud HTTP con autenticación automática
 * @param {string} path - Ruta relativa a la API
 * @param {object} options - Opciones fetch
 * @returns {Promise<any>} Respuesta parseada
 */
async function request(path, options = {}) {
	const token = getToken()
	const headers = {
		'Content-Type': 'application/json; charset=utf-8',
		'Accept': 'application/json',
		...(options.headers || {})
	}

	if (token) {
		headers.Authorization = `Bearer ${token}`
	}

	const response = await fetch(`${BASE_URL}${path}`, {
		...options,
		headers
	})

	// Sesión expirada
	if (response.status === 401) {
		clearSession()
	}

	const text = await response.text()
	const data = text ? JSON.parse(text) : null

	if (!response.ok) {
		throw new Error(data?.message || `Error: ${response.status}`)
	}

	return data
}

export const api = {
	// ── AUTENTICACIÓN ──────────────────────────────────────
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

	recuperarPassword: (email) =>
		request('/auth/recuperar-password', {
			method: 'POST',
			body: JSON.stringify({ email })
		}),

	validarTokenRecuperacion: (token) =>
		request('/auth/validar-token-recuperacion', {
			method: 'POST',
			body: JSON.stringify({ token })
		}),

	restablecerPassword: (token, nuevaPassword) =>
		request('/auth/resetear-password', {
			method: 'POST',
			body: JSON.stringify({ token, nuevaPassword })
		}),

	me: () => request('/auth/me'),

	// ── DIRECTORIO PÚBLICO ──────────────────────────────────
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
	obtenerSocioPorSlug: (slug) => request(`/directorio/socio/${slug}`),

	// ── FORMULARIOS DE CONTACTO ─────────────────────────────
	enviarFormulario: (socioId, payload) =>
		request(`/formulariocontacto`, {
			method: 'POST',
			body: JSON.stringify({ ...payload, socioId })
		}),

	// ── DATOS PERSONALES ────────────────────────────────────
	obtenerMiEmpresa: () => request('/miempresa'),

	actualizarMiEmpresa: (payload) =>
		request('/miempresa', {
			method: 'PUT',
			body: JSON.stringify(payload)
		})
}
