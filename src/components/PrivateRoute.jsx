import { Navigate, Outlet } from 'react-router'
import { useAuth } from '../context/AuthContext'

// Ruta protegida: requiere estar logueado
function PrivateRoute() {
  const { isLogged } = useAuth()
  return isLogged ? <Outlet /> : <Navigate to="/login" replace />
}

export default PrivateRoute
