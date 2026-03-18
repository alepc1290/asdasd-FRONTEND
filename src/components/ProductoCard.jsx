import React from 'react'
import { Package } from 'lucide-react'

export default function ProductoCard({ producto }) {
  return (
    <article className="card group flex flex-col">
      <div className="relative overflow-hidden h-48">
        {producto.imagen ? (
          <img
            src={producto.imagen}
            alt={producto.nombre}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-carbon-700 flex items-center justify-center">
            <Package size={40} className="text-carbon-400" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-carbon-900/60 to-transparent" />
        <span className={`absolute top-3 right-3 font-mono text-xs px-2 py-1 uppercase tracking-widest ${
          producto.stock > 0 ? 'bg-verde-500 text-carbon-900' : 'bg-carbon-600 text-carbon-300'
        }`}>
          {producto.stock > 0 ? `Stock: ${producto.stock}` : 'Sin stock'}
        </span>
      </div>

      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-display font-black text-white text-lg uppercase tracking-wide mb-1">
          {producto.nombre}
        </h3>
        {producto.descripcion && (
          <p className="text-carbon-300 text-xs leading-relaxed flex-1 mb-3">{producto.descripcion}</p>
        )}
        <div className="mt-auto">
          <span className="font-mono text-xs text-carbon-400 block">Precio</span>
          <span className="font-display font-black text-verde-400 text-2xl">
            ${producto.precio?.toLocaleString('es-AR')}
          </span>
        </div>
      </div>
    </article>
  )
}
