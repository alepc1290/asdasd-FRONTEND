import { useEffect, useState } from 'react'
import { Search, X } from 'lucide-react'
import { getProductos } from '../services/api'
import ProductoCard from '../components/ProductoCard'

function Productos() {
  const [productos, setProductos] = useState([])
  const [loading,   setLoading]   = useState(true)
  const [busqueda,  setBusqueda]  = useState('')

  useEffect(() => {
    getProductos()
      .then((res) => setProductos(res.data.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const filtrados = productos.filter((p) =>
    p.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    (p.descripcion || '').toLowerCase().includes(busqueda.toLowerCase())
  )

  return (
    <div className="max-w-6xl mx-auto px-4 py-16">

      {/* Header */}
      <div className="mb-12">
        <p className="section-label mb-2">Equipate</p>
        <h1 className="section-title text-5xl md:text-6xl">Tienda deportiva</h1>
        <p className="text-carbon-300 mt-3 text-sm max-w-xl">
          Todo lo que necesitás para jugar al máximo.
        </p>
      </div>

      {/* Buscador */}
      <div className="mb-10 max-w-md">
        <div className="relative">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-carbon-400" />
          <input
            type="text"
            className="input-field pl-10 pr-10"
            placeholder="Buscar productos..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
          {busqueda && (
            <button
              onClick={() => setBusqueda('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-carbon-400 hover:text-white transition-colors"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Contenido */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <div className="w-12 h-12 border-2 border-carbon-600 border-t-verde-500 rounded-full animate-spin" />
          <p className="font-mono text-carbon-400 text-xs uppercase tracking-widest">Cargando productos...</p>
        </div>
      ) : filtrados.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
          <div className="w-16 h-16 bg-carbon-800 border border-carbon-600 flex items-center justify-center">
            <Search size={28} className="text-carbon-500" />
          </div>
          <h3 className="font-display font-bold text-white text-lg uppercase tracking-wide">
            {busqueda ? 'Sin resultados' : 'Sin productos'}
          </h3>
          <p className="text-carbon-400 text-sm">
            {busqueda ? `No encontramos productos para "${busqueda}"` : 'No hay productos disponibles todavía.'}
          </p>
          {busqueda && (
            <button onClick={() => setBusqueda('')} className="btn-outline text-xs py-2 px-4">
              Limpiar búsqueda
            </button>
          )}
        </div>
      ) : (
        <>
          {busqueda && (
            <p className="font-mono text-carbon-400 text-xs uppercase tracking-widest mb-6">
              {filtrados.length} resultado{filtrados.length !== 1 ? 's' : ''} para "{busqueda}"
            </p>
          )}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filtrados.map((p) => <ProductoCard key={p._id} producto={p} />)}
          </div>
        </>
      )}
    </div>
  )
}

export default Productos