import React from 'react'
import { useEffect, useState, useRef } from 'react'
import { Link, useSearchParams, useNavigate } from 'react-router'
import { CheckCircle, XCircle, Link2Off, Loader } from 'lucide-react'
import { verificarEmail } from '../services/api'

const ESTADO = { CARGANDO: 'cargando', EXITO: 'exito', ERROR: 'error', SIN_TOKEN: 'sin_token' }

export default function VerifyEmail() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [estado,   setEstado]   = useState(ESTADO.CARGANDO)
  const [mensaje,  setMensaje]  = useState('')
  const [contador, setContador] = useState(5)
  const token  = searchParams.get('token')
  const called = useRef(false)

  useEffect(() => {
    if (!token) { setEstado(ESTADO.SIN_TOKEN); return }
    if (called.current) return
    called.current = true
    verificarEmail(token)
      .then(() => setEstado(ESTADO.EXITO))
      .catch((err) => {
        setMensaje(err.response?.data?.message || 'El enlace es inválido o ya expiró')
        setEstado(ESTADO.ERROR)
      })
  }, [token])

  useEffect(() => {
    if (estado !== ESTADO.EXITO) return
    if (contador <= 0) { navigate('/login', { state: { verificado: true } }); return }
    const t = setTimeout(() => setContador((c) => c - 1), 1000)
    return () => clearTimeout(t)
  }, [estado, contador])

  const Wrapper = ({ children }) => (
    <div className="min-h-screen flex items-center justify-center bg-carbon-900 px-4">
      <div className="w-full max-w-md bg-carbon-800 border border-carbon-600 p-8 text-center">
        {children}
      </div>
    </div>
  )

  if (estado === ESTADO.CARGANDO) return (
    <Wrapper>
      <div className="w-16 h-16 border-2 border-carbon-600 border-t-verde-500 rounded-full animate-spin mx-auto mb-6" />
      <p className="font-mono text-carbon-400 text-xs uppercase tracking-widest">Verificando correo...</p>
    </Wrapper>
  )

  if (estado === ESTADO.EXITO) return (
    <Wrapper>
      <div className="w-16 h-16 bg-verde-500/20 border border-verde-500 flex items-center justify-center mx-auto mb-6">
        <CheckCircle size={32} className="text-verde-400" />
      </div>
      <p className="section-label mb-2">Verificación exitosa</p>
      <h2 className="font-display font-black text-white uppercase text-3xl mb-3">¡Email verificado!</h2>
      <p className="text-carbon-300 text-sm mb-8">
        Tu cuenta está activa. Ya podés iniciar sesión y empezar a reservar canchas.
      </p>
      <Link to="/login" state={{ verificado: true }} className="btn-primary w-full flex items-center justify-center gap-2 mb-4">
        <CheckCircle size={16} /> Iniciar sesión
      </Link>
      <p className="text-carbon-400 text-xs font-mono">
        Redirigiendo en <span className="text-verde-400">{contador}</span> segundos...
      </p>
    </Wrapper>
  )

  if (estado === ESTADO.SIN_TOKEN) return (
    <Wrapper>
      <div className="w-16 h-16 bg-yellow-500/20 border border-yellow-700 flex items-center justify-center mx-auto mb-6">
        <Link2Off size={32} className="text-yellow-400" />
      </div>
      <p className="section-label mb-2">Enlace inválido</p>
      <h2 className="font-display font-black text-white uppercase text-3xl mb-3">Sin token</h2>
      <p className="text-carbon-300 text-sm mb-8">
        Este enlace de verificación no es válido. Asegurate de haber copiado correctamente la URL del correo.
      </p>
      <Link to="/register" className="btn-primary w-full flex items-center justify-center gap-2 mb-3">
        Volver al registro
      </Link>
      <Link to="/login" className="btn-outline w-full flex items-center justify-center gap-2">
        Iniciar sesión
      </Link>
    </Wrapper>
  )

  return (
    <Wrapper>
      <div className="w-16 h-16 bg-red-500/20 border border-red-800 flex items-center justify-center mx-auto mb-6">
        <XCircle size={32} className="text-red-400" />
      </div>
      <p className="section-label mb-2">Error de verificación</p>
      <h2 className="font-display font-black text-white uppercase text-3xl mb-3">No se pudo verificar</h2>
      <p className="text-carbon-300 text-sm mb-2">{mensaje}</p>
      <p className="text-carbon-400 text-xs mb-8">Los enlaces expiran. Si el tuyo expiró, registrate nuevamente.</p>
      <Link to="/register" className="btn-primary w-full flex items-center justify-center gap-2 mb-3">
        Registrarme de nuevo
      </Link>
      <Link to="/login" className="btn-outline w-full flex items-center justify-center gap-2">
        Ir a iniciar sesión
      </Link>
    </Wrapper>
  )
}
