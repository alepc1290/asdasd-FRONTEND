import React from 'react'
import { useEffect, useRef } from 'react'
import { useNavigate, useSearchParams } from 'react-router'
import { toast } from 'sonner'
import { jwtDecode } from 'jwt-decode'
import { Zap } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function GoogleAuthSuccess() {
  const [searchParams] = useSearchParams()
  const { login, isLogged } = useAuth()
  const navigate  = useNavigate()
  const procesado = useRef(false)

  useEffect(() => {
    if (procesado.current) return
    procesado.current = true

    const token      = searchParams.get('token')
    const errorParam = searchParams.get('error')

    if (errorParam || !token) {
      toast.error('No se pudo iniciar sesión con Google. Intentá de nuevo.')
      navigate('/login', { replace: true })
      return
    }

    try {
      const decoded = jwtDecode(token)
      login({ token, user: { id: decoded.id, nombre: decoded.nombre, email: decoded.email, rol: decoded.rol } })
      toast.success(`¡Bienvenido/a, ${decoded.nombre}!`)
      navigate('/reservas', { replace: true })
    } catch {
      toast.error('Token inválido. Por favor, iniciá sesión nuevamente.')
      navigate('/login', { replace: true })
    }
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center bg-carbon-900">
      <div className="text-center">
        <div className="w-16 h-16 bg-verde-500 flex items-center justify-center mx-auto mb-6 animate-pulse">
          <Zap size={32} className="text-carbon-900" fill="currentColor" />
        </div>
        <div className="w-8 h-8 border-2 border-carbon-600 border-t-verde-500 rounded-full animate-spin mx-auto mb-4" />
        <p className="font-mono text-carbon-400 text-xs uppercase tracking-widest">
          Iniciando sesión con Google...
        </p>
      </div>
    </div>
  )
}
