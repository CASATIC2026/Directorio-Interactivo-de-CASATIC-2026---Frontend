const TOKEN_KEY = 'casatic_token'
const USER_KEY = 'casatic_user'

export function saveSession(data) {
	const user = {
		email: data.email,
		rol: data.rol,
		primerLogin: data.primerLogin,
		socioId: data.socioId
	}

	localStorage.setItem(TOKEN_KEY, data.token)
	localStorage.setItem(USER_KEY, JSON.stringify(user))
}

export function getToken() {
	return localStorage.getItem(TOKEN_KEY)
}

export function getUser() {
	const raw = localStorage.getItem(USER_KEY)
	if (!raw) return null

	try {
		return JSON.parse(raw)
	} catch {
		clearSession()
		return null
	}
}

export function isAuthenticated() {
	return Boolean(getToken())
}

export function clearSession() {
	localStorage.removeItem(TOKEN_KEY)
	localStorage.removeItem(USER_KEY)
}
