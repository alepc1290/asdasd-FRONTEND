import { Navigate, Outlet } from 'react-router'
import { useAuth } from '../context/AuthContext'

// Ruta admin, requiere el rol "admin"
function AdminRoute() {
  const { isLogged, isAdmin } = useAuth()
  if (!isLogged) return <Navigate to="/login" replace />
  if (!isAdmin)  return <Navigate to="/" replace />
  return <Outlet />
}

export default AdminRoute
