import React from 'react'
import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { toast } from 'sonner'
import { UserPlus, Zap, CheckCircle, Mail } from 'lucide-react'
import { registerUser } from '../services/api'
import { useAuth } from '../context/AuthContext'
import logo from "../components/img/LogoImagen.png"

function Register() {
  const { isLogged } = useAuth()
  const navigate = useNavigate()
  const [loading,    setLoading]    = useState(false)
  const [error,      setError]      = useState('')
  const [enviado,    setEnviado]    = useState(false)
  const [emailUsado, setEmailUsado] = useState('')
  const [form,       setForm]       = useState({ nombre: '', email: '', password: '', confirmar: '' })

  useEffect(() => { if (isLogged) navigate('/', { replace: true }) }, [isLogged])

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault(); setError('')
    if (form.password !== form.confirmar) { setError('Las contraseñas no coinciden'); return }
    if (form.password.length < 6) { setError('La contraseña debe tener al menos 6 caracteres'); return }
    setLoading(true)
    try {
      await registerUser({ nombre: form.nombre, email: form.email, password: form.password })
      setEmailUsado(form.email)
      setEnviado(true)
    } catch (err) {
      const msg = err.response?.data?.message || 'Error al registrarse'
      setError(msg); toast.error(msg)
    } finally { setLoading(false) }
  }

  // ── Post registro ──
  if (enviado) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-carbon-900 py-12 px-4">
        <div className="w-full max-w-md bg-carbon-800 border border-carbon-600 p-8 text-center">
          <div className="w-16 h-16 bg-verde-500/20 border border-verde-500 flex items-center justify-center mx-auto mb-6">
            <Mail size={32} className="text-verde-400" />
          </div>
          <p className="section-label mb-2">Último paso</p>
          <h2 className="font-display font-black text-white uppercase text-3xl mb-3">Revisá tu correo</h2>
          <p className="text-carbon-300 text-sm mb-1">Te enviamos un email de verificación a:</p>
          <p className="font-mono text-verde-400 text-sm mb-6">{emailUsado}</p>
          <div className="border border-carbon-600 bg-carbon-700 px-4 py-3 text-carbon-300 text-xs font-mono mb-6">
            Hacé clic en el enlace del correo para activar tu cuenta. Si no llegó, revisá spam.
          </div>
          <Link to="/login" className="btn-primary w-full flex items-center justify-center gap-2">
            <CheckCircle size={16} /> Ir a iniciar sesión
          </Link>
          <button
            className="btn-ghost w-full mt-3 text-center"
            onClick={() => { setEnviado(false); setForm({ nombre: '', email: '', password: '', confirmar: '' }) }}
          >
            Volver al registro
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-carbon-900 py-12 px-4">
      <div className="w-full max-w-md">

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
          <h1 className="font-display font-black text-white uppercase text-4xl">Registrarse</h1>
          <p className="text-carbon-300 text-sm mt-2">Registrate gratis y empezá a reservar</p>
        </div>

        <div className="bg-carbon-800 border border-carbon-600 p-8">

          {error && (
            <div className="border border-red-800 bg-red-900/20 px-4 py-3 text-red-400 text-sm font-mono mb-5">
              ⚠ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {[
              { name: 'nombre',    label: 'Nombre completo',      type: 'text',     placeholder: 'Juan García' },
              { name: 'email',     label: 'Email',                type: 'email',    placeholder: 'ejemplo@email.com' },
              { name: 'password',  label: 'Contraseña',           type: 'password', placeholder: 'Mínimo 6 caracteres' },
              { name: 'confirmar', label: 'Confirmar contraseña', type: 'password', placeholder: 'Repetí tu contraseña' },
            ].map(({ name, label, type, placeholder }) => (
              <div key={name}>
                <label className="font-mono text-xs text-carbon-400 uppercase tracking-widest block mb-1.5">{label}</label>
                <input
                  type={type}
                  name={name}
                  className="input-field"
                  placeholder={placeholder}
                  value={form[name]}
                  onChange={handleChange}
                  required
                />
              </div>
            ))}

            <button
              type="submit"
              className="btn-primary w-full flex items-center justify-center gap-2 mt-2"
              disabled={loading}
            >
              {loading
                ? <><div className="w-4 h-4 border-2 border-carbon-900/40 border-t-carbon-900 rounded-full animate-spin" /> Creando cuenta...</>
                : <><UserPlus size={16} /> Crear cuenta</>
              }
            </button>
          </form>

          <div className="border-t border-carbon-600 mt-6 pt-5 text-center">
            <p className="text-carbon-400 text-sm">
              ¿Ya tenés cuenta?{' '}
              <Link to="/login" className="text-verde-400 hover:text-verde-300 font-semibold transition-colors">
                Iniciá sesión
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register