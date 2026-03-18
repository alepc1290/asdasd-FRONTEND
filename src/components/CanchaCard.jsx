import React from 'react'
import { Link } from 'react-router'
import { Users, ArrowRight } from 'lucide-react'

const TIPO_LABEL = { futbol5: 'Fútbol 5', futbol7: 'Fútbol 7', futbol11: 'Fútbol 11' }

export default function CanchaCard({ cancha, showReservar = true }) {
  const disponible = cancha.estado === 'disponible'

  return (
    <article className="card group flex flex-col">
      {/* Image */}
      <div className="relative overflow-hidden h-48">
        {cancha.imagen ? (
          <img
            src={cancha.imagen}
            alt={cancha.nombre}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-carbon-700 flex items-center justify-center">
            <div className="w-16 h-16 border-2 border-verde-500/30 flex items-center justify-center">
              <Users size={28} className="text-verde-500/50" />
            </div>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-carbon-900/80 to-transparent" />

        <span className={`absolute top-3 right-3 font-mono text-xs px-2 py-1 uppercase tracking-widest ${
          disponible ? 'bg-verde-500 text-carbon-900' : 'bg-carbon-600 text-carbon-300'
        }`}>
          {disponible ? 'Disponible' : cancha.estado}
        </span>

        <span className="absolute bottom-3 left-3 tag">
          {TIPO_LABEL[cancha.tipo] || cancha.tipo}
        </span>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-display font-black text-white text-xl uppercase tracking-wide mb-1">
          {cancha.nombre}
        </h3>
        {cancha.descripcion && (
          <p className="text-carbon-300 text-xs mb-3 leading-relaxed">{cancha.descripcion}</p>
        )}

        <div className="mt-auto flex items-center justify-between gap-3">
          <div>
            <span className="font-mono text-xs text-carbon-400 block">Precio / hora</span>
            <span className="font-display font-black text-verde-400 text-2xl">
              ${cancha.precio?.toLocaleString('es-AR')}
            </span>
          </div>

          {showReservar && disponible ? (
            <Link
              to="/reservas"
              state={{ canchaId: cancha._id }}
              className="btn-primary text-xs py-2 px-4 flex items-center gap-1"
            >
              Reservar <ArrowRight size={12} />
            </Link>
          ) : (
            <button disabled className="btn-outline text-xs py-2 px-4 opacity-40 cursor-not-allowed">
              No disponible
            </button>
          )}
        </div>
      </div>
    </article>
  )
}
