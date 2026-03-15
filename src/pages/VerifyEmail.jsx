import { useEffect, useState, useRef } from 'react'
import { Link, useSearchParams, useNavigate } from 'react-router'
import { verificarEmail } from '../services/api'

// Estados posibles del proceso de verificación
const ESTADO = {
  CARGANDO: 'cargando',
  EXITO: 'exito',
  ERROR: 'error',
  SIN_TOKEN: 'sin_token',
}

function VerifyEmail() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [estado, setEstado] = useState(ESTADO.CARGANDO)
  const [mensaje, setMensaje] = useState('')
  const [contador, setContador] = useState(5)

  const token = searchParams.get('token')

  const called = useRef(false)

  useEffect(() => {
    if (!token) { setEstado(ESTADO.SIN_TOKEN); return }
    if (called.current) return
    called.current = true

    verificarEmail(token)
      .then(() => setEstado(ESTADO.EXITO))
      .catch((err) => {
        const msg = err.response?.data?.message || 'El enlace es inválido o ya expiró'
        setMensaje(msg)
        setEstado(ESTADO.ERROR)
      })
  }, [token])

  // Cuenta regresiva para redirigir al login tras el éxito
  useEffect(() => {
    if (estado !== ESTADO.EXITO) return
    if (contador <= 0) {
      navigate('/login', { state: { verificado: true } })
      return
    }
    const timer = setTimeout(() => setContador((c) => c - 1), 1000)
    return () => clearTimeout(timer)
  }, [estado, contador])

  // ── Cargando ────────────────────────────────────────────────────────────────
  if (estado === ESTADO.CARGANDO) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
        <div className="text-center">
          <div className="spinner-border text-success mb-3" style={{ width: 48, height: 48 }}></div>
          <p className="text-muted">Verificando tu correo electrónico...</p>
        </div>
      </div>
    )
  }

  // ── Éxito ───────────────────────────────────────────────────────────────────
  if (estado === ESTADO.EXITO) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light py-5">
        <div className="card shadow border-0 w-100 text-center" style={{ maxWidth: 460 }}>
          <div className="card-body p-4 p-md-5">
            <span className="d-inline-flex align-items-center justify-content-center bg-success bg-opacity-10 rounded-circle mb-4"
              style={{ width: 88, height: 88 }}>
              <i className="bi bi-patch-check-fill text-success" style={{ fontSize: 48 }}></i>
            </span>

            <h3 className="fw-bold mb-2">¡Email verificado!</h3>
            <p className="text-muted mb-4">
              Tu cuenta está activa. Ya podés iniciar sesión y empezar a reservar canchas.
            </p>

            <Link
              to="/login"
              state={{ verificado: true }}
              className="btn btn-success btn-lg w-100 fw-bold mb-3"
            >
              <i className="bi bi-box-arrow-in-right me-2"></i>
              Iniciar sesión
            </Link>

            <p className="text-muted small mb-0">
              Redirigiendo automáticamente en{' '}
              <span className="fw-semibold text-success">{contador}</span> segundos...
            </p>
          </div>
        </div>
      </div>
    )
  }

  // ── Sin token ───────────────────────────────────────────────────────────────
  if (estado === ESTADO.SIN_TOKEN) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light py-5">
        <div className="card shadow border-0 w-100 text-center" style={{ maxWidth: 460 }}>
          <div className="card-body p-4 p-md-5">
            <span className="d-inline-flex align-items-center justify-content-center bg-warning bg-opacity-10 rounded-circle mb-4"
              style={{ width: 88, height: 88 }}>
              <i className="bi bi-link-45deg text-warning" style={{ fontSize: 48 }}></i>
            </span>

            <h3 className="fw-bold mb-2">Enlace inválido</h3>
            <p className="text-muted mb-4">
              Este enlace de verificación no es válido.
              Asegurate de haber copiado correctamente la URL del correo.
            </p>

            <Link to="/register" className="btn btn-success btn-lg w-100 fw-bold mb-3">
              <i className="bi bi-person-plus me-2"></i>
              Volver al registro
            </Link>
            <Link to="/login" className="btn btn-outline-secondary btn-lg w-100">
              Iniciar sesión
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // ── Error ───────────────────────────────────────────────────────────────────
  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light py-5">
      <div className="card shadow border-0 w-100 text-center" style={{ maxWidth: 460 }}>
        <div className="card-body p-4 p-md-5">
          <span className="d-inline-flex align-items-center justify-content-center bg-danger bg-opacity-10 rounded-circle mb-4"
            style={{ width: 88, height: 88 }}>
            <i className="bi bi-x-circle-fill text-danger" style={{ fontSize: 48 }}></i>
          </span>

          <h3 className="fw-bold mb-2">No se pudo verificar</h3>
          <p className="text-muted mb-2">{mensaje}</p>
          <p className="text-muted small mb-4">
            Los enlaces de verificación expiran después de un tiempo.
            Si tu enlace expiró, registrate nuevamente para recibir uno nuevo.
          </p>

          <div className="d-flex flex-column gap-2">
            <Link to="/register" className="btn btn-success btn-lg fw-bold">
              <i className="bi bi-person-plus me-2"></i>
              Registrarme de nuevo
            </Link>
            <Link to="/login" className="btn btn-outline-secondary btn-lg">
              Ir a iniciar sesión
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default VerifyEmail
