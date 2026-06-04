/**
 * ⚠️ CLIENTE LEGACY (fetch) — usar `api/client.js` (axios) para nuevos features.
 *
 * Esta capa se mantiene por compatibilidad con páginas que ya la usaban,
 * pero todos sus endpoints están alineados a los del backend real.
 *
 * Bugs corregidos respecto a la versión original:
 *  - `resetear-password` → `restablecer-password` (ruta real del backend)
 *  - `validar-token-recuperacion` ahora envía `{ email, token }` (faltaba email)
 *  - `enviarFormulario` ahora va a `/formulariocontacto/{socioId}` (era POST a `/formulariocontacto` con socioId en body)
 *  - `restablecer-password` ahora envía `{ email, token, nuevaPassword }`
 */

import { clearSession, getToken } from './auth'

const BASE_URL = import.meta.env.VITE_API_URL || '/api'

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

	const response = await fetch(`${BASE_URL}${path}`, { ...options, headers })

	if (response.status === 401) {
		clearSession()
	}

	const text = await response.text()
	let data = null
	try {
		data = text ? JSON.parse(text) : null
	} catch {
		// Respuesta no-JSON (raro, pero defensivo)
		data = { raw: text }
	}

	if (!response.ok) {
		const msg = data?.message || data?.title || `Error: ${response.status}`
		const err = new Error(msg)
		err.status = response.status
		err.data = data
		throw err
	}

	return data
}

export const api = {
	// ── AUTENTICACIÓN ──────────────────────────────────────
	login: (payload) =>
		request('/auth/login', { method: 'POST', body: JSON.stringify(payload) }),

	cambiarPassword: (payload) =>
		request('/auth/cambiar-password', { method: 'POST', body: JSON.stringify(payload) }),

	recuperarPassword: (email) =>
		request('/auth/recuperar-password', {
			method: 'POST',
			body: JSON.stringify({ email })
		}),

	validarTokenRecuperacion: (email, token) =>
		request('/auth/validar-token-recuperacion', {
			method: 'POST',
			body: JSON.stringify({ email, token })
		}),

	restablecerPassword: (email, token, nuevaPassword) =>
		request('/auth/restablecer-password', {
			method: 'POST',
			body: JSON.stringify({ email, token, nuevaPassword })
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
	// Backend: POST /api/formulariocontacto/{socioId}
	enviarFormulario: (socioId, payload) =>
		request(`/formulariocontacto/${socioId}`, {
			method: 'POST',
			body: JSON.stringify(payload)
		}),

	// ── DATOS PERSONALES ────────────────────────────────────
	obtenerMiEmpresa: () => request('/miempresa'),
	actualizarMiEmpresa: (payload) =>
		request('/miempresa', { method: 'PUT', body: JSON.stringify(payload) })
}
