import { useEffect, useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router'
import { toast } from 'sonner'
import { loginUser } from '../services/api'
import { useAuth } from '../context/AuthContext'

// Mensajes del backend que indican email no verificado
const MSG_NO_VERIFICADO = [
  'debes verificar tu correo',
  'verifica tu correo',
  'email no verificado',
  'correo no verificado',
  'verify your email',
]

const esErrorDeVerificacion = (msg) =>
  MSG_NO_VERIFICADO.some((k) => msg.toLowerCase().includes(k))

function Login() {
  const { login, isLogged } = useAuth()
  const navigate  = useNavigate()
  const location  = useLocation()

  const [loading, setLoading]           = useState(false)
  const [form, setForm]                 = useState({ email: '', password: '' })
  const [error, setError]               = useState('')
  const [noVerificado, setNoVerificado] = useState(false)

  useEffect(() => {
    if (isLogged) navigate('/reservas', { replace: true })
  }, [isLogged])

  // Si viene de /verify-email con éxito, mostrar toast
  useEffect(() => {
    if (location.state?.verificado) {
      toast.success('¡Email verificado! Ya podés iniciar sesión.')
    }
  }, [])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    // limpiar aviso de no verificado si cambia el email
    if (e.target.name === 'email') setNoVerificado(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setNoVerificado(false)
    setLoading(true)
    try {
      const res = await loginUser(form)
      login(res.data.data)
      toast.success('¡Bienvenido/a!')
      navigate('/reservas', { replace: true })
    } catch (err) {
      const msg = err.response?.data?.message || 'Error al iniciar sesión'
      if (esErrorDeVerificacion(msg)) {
        setNoVerificado(true)   // muestra el banner específico
      } else {
        setError(msg)
        toast.error(msg)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light py-5">
      <div className="card shadow border-0 w-100" style={{ maxWidth: 420 }}>
        <div className="card-body p-4 p-md-5">
          <div className="text-center mb-4">
            <i className="bi bi-dribbble text-success" style={{ fontSize: 48 }}></i>
            <h2 className="fw-bold mt-2">Iniciar sesión</h2>
            <p className="text-muted small">Ingresá tu cuenta para reservar canchas</p>
          </div>

          {/* Error genérico */}
          {error && (
            <div className="alert alert-danger py-2 small" role="alert">
              <i className="bi bi-exclamation-circle me-2"></i>{error}
            </div>
          )}

          {/* Banner específico: email no verificado */}
          {noVerificado && (
            <div className="alert alert-warning border-0 small" role="alert">
              <div className="d-flex gap-2 align-items-start">
                <i className="bi bi-envelope-exclamation-fill fs-5 flex-shrink-0 mt-1"></i>
                <div>
                  <p className="fw-semibold mb-1">Verificá tu correo electrónico</p>
                  <p className="mb-0">
                    Debés verificar tu cuenta antes de iniciar sesión.
                    Revisá tu bandeja de entrada y hacé clic en el enlace que te enviamos
                    {form.email && <> a <strong>{form.email}</strong></>}.
                  </p>
                  <p className="mb-0 mt-1 text-muted">
                    ¿No llegó el correo? Revisá la carpeta de spam.
                  </p>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label fw-semibold">Email</label>
              <input
                type="email"
                name="email"
                className={`form-control form-control-lg ${noVerificado ? 'border-warning' : ''}`}
                placeholder="ejemplo@email.com"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-4">
              <label className="form-label fw-semibold">Contraseña</label>
              <input
                type="password"
                name="password"
                className="form-control form-control-lg"
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
                required
              />
            </div>
            <button
              type="submit"
              className="btn btn-success w-100 btn-lg fw-bold"
              disabled={loading}
            >
              {loading
                ? <><span className="spinner-border spinner-border-sm me-2"></span>Ingresando...</>
                : <><i className="bi bi-box-arrow-in-right me-2"></i>Ingresar</>
              }
            </button>
          </form>

          <hr className="my-4" />
          <p className="text-center text-muted mb-0 small">
            ¿No tenés cuenta?{' '}
            <Link to="/register" className="text-success fw-semibold">Registrate</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login
