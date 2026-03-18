import React from 'react'
import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router'
import { Zap, Menu, X, LogOut, User, Shield } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { isLogged, isAdmin, auth, logout } = useAuth()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)

  const handleLogout = () => { logout(); navigate('/') }

  const links = [
    { to: '/',         label: 'Inicio',  end: true },
    { to: '/reservas', label: 'Reservar' },
    { to: '/productos', label: 'Tienda' },
    ...(isAdmin ? [{ to: '/admin', label: 'Admin', admin: true }] : []),
  ]

  return (
    <header className="sticky top-0 z-50 bg-carbon-900/95 backdrop-blur border-b border-carbon-700">
      <nav className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <span className="w-8 h-8 bg-verde-500 flex items-center justify-center">
            <Zap size={16} className="text-carbon-900" fill="currentColor" />
          </span>
          <span className="font-display font-black text-white uppercase text-lg tracking-wider">
            Canchas<span className="text-verde-400">&Deportes</span>
          </span>
        </Link>

        {/* Desktop links */}
        <ul className="hidden md:flex items-center gap-1">
          {links.map(({ to, label, end, admin }) => (
            <li key={to}>
              <NavLink
                to={to}
                end={end}
                className={({ isActive }) =>
                  `px-4 py-2 font-body text-sm transition-colors duration-200 uppercase tracking-wider ${
                    admin
                      ? isActive ? 'text-yellow-400 border-b border-yellow-500' : 'text-yellow-500/70 hover:text-yellow-400'
                      : isActive ? 'text-verde-400 border-b border-verde-500' : 'text-carbon-300 hover:text-white'
                  }`
                }
              >
                {admin && <Shield size={12} className="inline mr-1" />}{label}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Auth + hamburger */}
        <div className="flex items-center gap-3">
          {isLogged ? (
            <div className="hidden md:flex items-center gap-3">
              <span className="flex items-center gap-1.5 text-carbon-300 text-sm font-mono">
                <User size={14} className="text-verde-500" />
                {auth?.user?.nombre}
                {isAdmin && <span className="badge-warning ml-1">admin</span>}
              </span>
              <button onClick={handleLogout} className="btn-outline py-1.5 px-3 text-xs flex items-center gap-1">
                <LogOut size={12} /> Salir
              </button>
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-2">
              <Link to="/login" className="btn-ghost px-4 py-2">Iniciar sesión</Link>
              <Link to="/register" className="btn-primary py-2 px-4 text-xs">Registrarse</Link>
            </div>
          )}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden text-carbon-300 hover:text-white transition-colors"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-carbon-800 border-t border-carbon-700 animate-fade-in">
          <ul className="flex flex-col py-2">
            {links.map(({ to, label, end, admin }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  end={end}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    `block px-6 py-3 font-body text-sm uppercase tracking-wider transition-colors ${
                      isActive ? 'text-verde-400 bg-carbon-700' : 'text-carbon-300 hover:text-white hover:bg-carbon-700'
                    }`
                  }
                >
                  {admin && <Shield size={12} className="inline mr-1" />}{label}
                </NavLink>
              </li>
            ))}
          </ul>
          <div className="px-6 py-3 border-t border-carbon-700">
            {isLogged ? (
              <button onClick={() => { handleLogout(); setOpen(false) }} className="btn-outline w-full text-center text-xs flex items-center justify-center gap-1">
                <LogOut size={12} /> Salir
              </button>
            ) : (
              <div className="flex flex-col gap-2">
                <Link to="/login" onClick={() => setOpen(false)} className="btn-ghost text-center py-2">Iniciar sesión</Link>
                <Link to="/register" onClick={() => setOpen(false)} className="btn-primary text-center text-xs">Registrarse</Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
