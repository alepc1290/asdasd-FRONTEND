import { useEffect, useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router'
import { toast } from 'sonner'
import { LogIn, Zap } from 'lucide-react'
import { loginUser } from '../services/api'
import { useAuth } from '../context/AuthContext'
import { API_URL } from '../config/env'
import logo from "../components/img/LogoImagen.png"

const mensajeNoVerificado = [
  'debes verificar tu correo', 'verifica tu correo',
  'email no verificado', 'correo no verificado', 'verify your email',
]
const esErrorDeVerificacion = (msg) =>
  mensajeNoVerificado.some((mensaje) => msg.toLowerCase().includes(mensaje))

function Login() {
  const { login, isLogged } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [noVerificado, setNoVerificado] = useState(false)

  useEffect(() => { if (isLogged) navigate('/reservas', { replace: true }) }, [isLogged])
  useEffect(() => { if (location.state?.verificado) toast.success('¡Email verificado! Ya podés iniciar sesión.') }, [])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    if (e.target.name === 'email') setNoVerificado(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(''); setNoVerificado(false); setLoading(true)
    try {
      const res = await loginUser(form)
      login(res.data.data)
      toast.success('¡Bienvenido/a!')
      navigate('/reservas', { replace: true })
    } catch (err) {
      const msg = err.response?.data?.message || 'Error al iniciar sesión'
      if (esErrorDeVerificacion(msg)) setNoVerificado(true)
      else {setError(msg)}
    } finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-carbon-900 py-12 px-4">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <span className="w-auto h-6 flex items-center justify-center">
              <img
                          src={logo}
                          alt="RC Sport Logo"
                          className="h-12 w-auto "
                        />
            </span>
          </Link>
          <h1 className="font-display font-black text-white uppercase text-4xl">Iniciar sesión</h1>
          <p className="text-carbon-300 text-sm mt-2">Ingresá tu cuenta para reservar canchas</p>
        </div>

        <div className="bg-carbon-800 border border-carbon-600 p-8">

          {/* Error genérico */}
          {error && (
            <div className="border border-red-800 bg-red-900/20 px-4 py-3 text-red-400 text-sm font-mono mb-5">
              ⚠ {error}
            </div>
          )}

          {/* Email no verificado */}
          {noVerificado && (
            <div className="border border-yellow-800 bg-yellow-900/20 px-4 py-3 text-yellow-400 text-sm mb-5">
              <p className="font-display font-bold uppercase tracking-wide text-sm mb-1">Verificá tu correo electrónico</p>
              <p className="text-xs text-yellow-400/80">
                Revisá tu bandeja de entrada{form.email && <> (enviamos a <strong>{form.email}</strong>)</>}.
                Si no llegó, revisá spam.
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="font-mono text-xs text-carbon-400 uppercase tracking-widest block mb-1.5">Email</label>
              <input
                type="email"
                name="email"
                className={`input-field ${noVerificado ? 'border-yellow-700' : ''}`}
                placeholder="ejemplo@email.com"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label className="font-mono text-xs text-carbon-400 uppercase tracking-widest block mb-1.5">Contraseña</label>
              <input
                type="password"
                name="password"
                className="input-field"
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
                required
              />
            </div>
            <button
              type="submit"
              className="btn-primary w-full flex items-center justify-center gap-2 mt-2"
              disabled={loading}
            >
              {loading
                ? <><div className="w-4 h-4 border-2 border-carbon-900/40 border-t-carbon-900 rounded-full animate-spin" /> Ingresando...</>
                : <><LogIn size={16} /> Ingresar</>
              }
            </button>
          </form>

          {/* Separador */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-carbon-600" />
            <span className="font-mono text-carbon-400 text-xs uppercase tracking-widest">O</span>
            <div className="flex-1 h-px bg-carbon-600" />
          </div>

          {/* Google */}
          <a href={`${API_URL}/api/auth/google/login`}
            className="w-full flex items-center justify-center gap-3 bg-carbon-700 border border-carbon-500 hover:border-verde-600 text-white font-body text-sm px-4 py-3 transition-all duration-200 hover:bg-carbon-600">
            Continuar con Google
          </a>

          <div className="border-t border-carbon-600 mt-6 pt-5 text-center">
            <p className="text-carbon-400 text-sm">
              ¿No tenés cuenta?{' '}
              <Link to="/register" className="text-verde-400 hover:text-verde-300 font-semibold transition-colors">
                Registrate
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login