import React from 'react'
import { Link } from 'react-router'
import { Zap, MapPin, Phone, Mail } from 'lucide-react'
import logo from "./img/LogoImagen.png"

export default function Footer() {
  return (
    <footer className="bg-carbon-800 border-t border-carbon-700 mt-20">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

          <div>
            <Link to="/" className="flex items-center gap-2 mb-4">
              <span className="w-auto h-8 flex items-center justify-center">
                <img
                            src={logo}
                            alt="RC Sport Logo"
                            className="h-12 w-auto "
                          />
              </span>
            </Link>
            <p className="text-carbon-300 text-sm leading-relaxed">
              El mejor complejo deportivo de la ciudad. Canchas de primer nivel para tu próximo partido.
            </p>
          </div>

          <div>
            <h4 className="section-label mb-4">Navegación</h4>
            <ul className="space-y-2">
              {[
                { to: '/',          label: 'Inicio' },
                { to: '/reservas',  label: 'Reservar turno' },
                { to: '/productos', label: 'Tienda' },
              ].map(({ to, label }) => (
                <li key={to}>
                  <Link to={to} className="text-carbon-300 hover:text-verde-400 text-sm transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="section-label mb-4">Contacto</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-carbon-300 text-sm">
                <MapPin size={14} className="text-verde-500 flex-shrink-0" />
                General Paz 576, San Miguel de Tucumán.
              </li>
              <li className="flex items-center gap-2 text-carbon-300 text-sm">
                <Phone size={14} className="text-verde-500 flex-shrink-0" />
                +54 9 381 365 7948
              </li>
              <li className="flex items-center gap-2 text-carbon-300 text-sm">
                <Mail size={14} className="text-verde-500 flex-shrink-0" />
                gestiondecanchaproyecto@gmail.com
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-carbon-700 mt-10 pt-6 flex flex-col md:flex-row justify-between items-center gap-2">
          <p className="text-carbon-400 text-xs font-mono">
            © {new Date().getFullYear()} RC SPORT — Todos los derechos reservados
          </p>
          <p className="text-carbon-400 text-xs">
            Lunes a Domingo · 08:00 – 23:00 hs
          </p>
        </div>
      </div>
    </footer>
  )
}
