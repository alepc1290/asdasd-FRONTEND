import React from 'react'
import { useEffect, useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router'
import { toast } from 'sonner'
import { LogIn, Zap } from 'lucide-react'
import { loginUser } from '../services/api'
import { useAuth } from '../context/AuthContext'
import { API_URL } from '../config/env'

const MSG_NO_VERIFICADO = [
  'debes verificar tu correo', 'verifica tu correo',
  'email no verificado', 'correo no verificado', 'verify your email',
]
const esErrorDeVerificacion = (msg) =>
  MSG_NO_VERIFICADO.some((k) => msg.toLowerCase().includes(k))

export default function Login() {
  const { login, isLogged } = useAuth()
  const navigate  = useNavigate()
  const location  = useLocation()
  const [loading,      setLoading]      = useState(false)
  const [form,         setForm]         = useState({ email: '', password: '' })
  const [error,        setError]        = useState('')
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
      else { setError(msg); toast.error(msg) }
    } finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-carbon-900 py-12 px-4">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <span className="w-10 h-10 bg-verde-500 flex items-center justify-center">
              <Zap size={20} className="text-carbon-900" fill="currentColor" />
            </span>
            <span className="font-display font-black text-white uppercase text-xl tracking-wider">
              Canchas<span className="text-verde-400">&Deportes</span>
            </span>
          </Link>
          <p className="section-label mb-1">Acceso al sistema</p>
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
            <span className="font-mono text-carbon-400 text-xs uppercase tracking-widest">o</span>
            <div className="flex-1 h-px bg-carbon-600" />
          </div>

          {/* Google */}
          <a
            href={`${API_URL}/api/auth/google/login`}
            className="w-full flex items-center justify-center gap-3 bg-carbon-700 border border-carbon-500 hover:border-verde-600 text-white font-body text-sm px-4 py-3 transition-all duration-200 hover:bg-carbon-600"
          >
            <svg width="18" height="18" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
              <path fill="#EA4335" d="M24 9.5c3.14 0 5.95 1.08 8.17 2.85l6.1-6.1C34.46 3.09 29.5 1 24 1 14.82 1 7.07 6.48 3.6 14.26l7.1 5.52C12.43 13.48 17.75 9.5 24 9.5z"/>
              <path fill="#4285F4" d="M46.5 24.5c0-1.64-.15-3.22-.42-4.75H24v9h12.7c-.55 2.96-2.2 5.47-4.68 7.16l7.18 5.57C43.44 37.3 46.5 31.34 46.5 24.5z"/>
              <path fill="#FBBC05" d="M10.7 28.22A14.6 14.6 0 0 1 9.5 24c0-1.47.25-2.89.7-4.22l-7.1-5.52A23.94 23.94 0 0 0 0 24c0 3.87.93 7.53 2.6 10.74l7.1-5.52z"/>
              <path fill="#34A853" d="M24 47c5.5 0 10.12-1.82 13.5-4.95l-7.18-5.57C28.6 38.3 26.44 39 24 39c-6.25 0-11.57-3.98-13.3-9.52l-7.1 5.52C7.07 42.52 14.82 47 24 47z"/>
            </svg>
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
