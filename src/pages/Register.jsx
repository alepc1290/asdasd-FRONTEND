import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { toast } from 'sonner'
import { registerUser } from '../services/api'
import { useAuth } from '../context/AuthContext'

function Register() {
  const { isLogged } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')
  const [form, setForm]       = useState({ nombre: '', email: '', password: '', confirmar: '' })

  useEffect(() => {
    if (isLogged) navigate('/', { replace: true })
  }, [isLogged])

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (form.password !== form.confirmar) {
      setError('Las contraseñas no coinciden')
      return
    }
    if (form.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres')
      return
    }
    setLoading(true)
    try {
      await registerUser({ nombre: form.nombre, email: form.email, password: form.password })
      toast.success('¡Cuenta creada! Ahora podés iniciar sesión.')
      navigate('/login')
    } catch (err) {
      const msg = err.response?.data?.message || 'Error al registrarse'
      setError(msg)
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light py-5">
      <div className="card shadow border-0 w-100" style={{ maxWidth: 440 }}>
        <div className="card-body p-4 p-md-5">
          <div className="text-center mb-4">
            <i className="bi bi-person-plus text-success" style={{ fontSize: 48 }}></i>
            <h2 className="fw-bold mt-2">Crear cuenta</h2>
            <p className="text-muted small">Registrate gratis y empezá a reservar</p>
          </div>

          {error && (
            <div className="alert alert-danger py-2 small" role="alert">
              <i className="bi bi-exclamation-circle me-2"></i>{error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label fw-semibold">Nombre completo</label>
              <input
                type="text"
                name="nombre"
                className="form-control form-control-lg"
                placeholder="Juan García"
                value={form.nombre}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label fw-semibold">Email</label>
              <input
                type="email"
                name="email"
                className="form-control form-control-lg"
                placeholder="ejemplo@email.com"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label fw-semibold">Contraseña</label>
              <input
                type="password"
                name="password"
                className="form-control form-control-lg"
                placeholder="Mínimo 6 caracteres"
                value={form.password}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-4">
              <label className="form-label fw-semibold">Confirmar contraseña</label>
              <input
                type="password"
                name="confirmar"
                className="form-control form-control-lg"
                placeholder="Repetí tu contraseña"
                value={form.confirmar}
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
                ? <><span className="spinner-border spinner-border-sm me-2"></span>Creando cuenta...</>
                : <><i className="bi bi-person-check me-2"></i>Crear cuenta</>
              }
            </button>
          </form>

          <hr className="my-4" />
          <p className="text-center text-muted mb-0 small">
            ¿Ya tenés cuenta?{' '}
            <Link to="/login" className="text-success fw-semibold">Iniciá sesión</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Register
