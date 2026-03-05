import { Navigate, useLocation } from 'react-router-dom'
import { getUser, isAuthenticated } from '../lib/auth'

export default function PrivateRoute({ children, roles }) {
	const location = useLocation()

	if (!isAuthenticated()) {
		return <Navigate to="/login" replace state={{ from: location.pathname }} />
	}

	if (roles?.length) {
		const user = getUser()
		if (!user || !roles.includes(user.rol)) {
			return <Navigate to="/directorio" replace />
		}
	}

	return children
}
