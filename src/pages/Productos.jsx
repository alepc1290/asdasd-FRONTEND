import { useEffect, useState } from 'react'
import { getProductos } from '../services/api'
import ProductoCard from '../components/ProductoCard'

function Productos() {
  const [productos, setProductos] = useState([])
  const [loading, setLoading]     = useState(true)
  const [busqueda, setBusqueda]   = useState('')

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
    <div className="py-5">
      <div className="container">
        {/* Header */}
        <div className="text-center mb-5">
          <i className="bi bi-bag-heart text-success" style={{ fontSize: 48 }}></i>
          <h1 className="fw-bold mt-2">Tienda deportiva</h1>
          <p className="text-muted">Todo lo que necesitás para jugar al máximo</p>
        </div>

        {/* Buscador */}
        <div className="row justify-content-center mb-4">
          <div className="col-md-6">
            <div className="input-group input-group-lg shadow-sm">
              <span className="input-group-text bg-white border-end-0">
                <i className="bi bi-search text-muted"></i>
              </span>
              <input
                type="text"
                className="form-control border-start-0"
                placeholder="Buscar productos..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
              />
              {busqueda && (
                <button className="btn btn-outline-secondary" onClick={() => setBusqueda('')}>
                  <i className="bi bi-x-lg"></i>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Resultados */}
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-success" style={{ width: 48, height: 48 }}></div>
            <p className="text-muted mt-3">Cargando productos...</p>
          </div>
        ) : filtrados.length === 0 ? (
          <div className="text-center py-5">
            <i className="bi bi-box-seam text-muted" style={{ fontSize: 64 }}></i>
            <h4 className="mt-3 text-muted">
              {busqueda ? 'Sin resultados para tu búsqueda' : 'No hay productos disponibles'}
            </h4>
            {busqueda && (
              <button className="btn btn-outline-success mt-2" onClick={() => setBusqueda('')}>
                Limpiar búsqueda
              </button>
            )}
          </div>
        ) : (
          <>
            <p className="text-muted small mb-3">
              {filtrados.length} producto{filtrados.length !== 1 ? 's' : ''} encontrado{filtrados.length !== 1 ? 's' : ''}
            </p>
            <div className="row g-4">
              {filtrados.map((p) => (
                <div className="col-6 col-md-4 col-lg-3" key={p._id}>
                  <ProductoCard producto={p} />
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default Productos
