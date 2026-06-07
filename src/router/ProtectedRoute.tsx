import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

interface ProtectedRouteProps {
  redirectTo?: string
}

export const ProtectedRoute = ({
  redirectTo = '/login',
}: ProtectedRouteProps) => {
  const { isAuthenticated } = useAuth()

  return isAuthenticated ? <Outlet /> : <Navigate to={redirectTo} replace />
}

export const GuestRoute = () => {
  const { isAuthenticated } = useAuth()

  return isAuthenticated ? <Navigate to="/" replace /> : <Outlet />
}
