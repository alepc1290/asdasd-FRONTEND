import { Link, useNavigate } from 'react-router'
import { useAuth } from '../context/AuthContext'

function Navbar() {
  const { isLogged, isAdmin, auth, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark sticky-top shadow">
      <div className="container">
        <Link className="navbar-brand fw-bold fs-4" to="/">
          <i className="bi bi-dribbble me-2 text-success"></i>
          Canchas & Deportes
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarMain"
          aria-controls="navbarMain"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarMain">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link" to="/">
                <i className="bi bi-house me-1"></i>Inicio
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/productos">
                <i className="bi bi-bag me-1"></i>Tienda
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/reservas">
                <i className="bi bi-calendar-check me-1"></i>Reservar
              </Link>
            </li>
            {isAdmin && (
              <li className="nav-item">
                <Link className="nav-link text-warning" to="/admin">
                  <i className="bi bi-gear me-1"></i>Admin
                </Link>
              </li>
            )}
          </ul>

          <ul className="navbar-nav ms-auto">
            {isLogged ? (
              <>
                <li className="nav-item d-flex align-items-center me-3">
                  <span className="text-light small">
                    <i className="bi bi-person-circle me-1"></i>
                    {auth?.user?.nombre}
                    {isAdmin && (
                      <span className="badge bg-warning text-dark ms-2">Admin</span>
                    )}
                  </span>
                </li>
                <li className="nav-item">
                  <button className="btn btn-outline-light btn-sm" onClick={handleLogout}>
                    <i className="bi bi-box-arrow-right me-1"></i>Salir
                  </button>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item me-2">
                  <Link className="btn btn-outline-light btn-sm" to="/login">
                    Iniciar sesión
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="btn btn-success btn-sm" to="/register">
                    Registrarse
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
