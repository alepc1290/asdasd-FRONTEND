import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { getCanchas, getProductos } from '../services/api'
import CanchaCard from '../components/CanchaCard'
import ProductoCard from '../components/ProductoCard'

function Home() {
  const [canchas, setCanchas]     = useState([])
  const [productos, setProductos] = useState([])
  const [loading, setLoading]     = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [c, p] = await Promise.all([getCanchas(), getProductos()])
        setCanchas(c.data.data.slice(0, 3))
        setProductos(p.data.data.slice(0, 4))
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  return (
    <div>
      {/* Hero */}
      <section className="bg-dark text-white py-5">
        <div className="container py-4 text-center">
          <i className="bi bi-dribbble text-success" style={{ fontSize: 64 }}></i>
          <h1 className="display-4 fw-bold mt-3">Canchas & Deportes</h1>
          <p className="lead text-secondary mb-4">
            Reservá tu cancha de fútbol en segundos. Pagá, jugá y disfrutá.
          </p>
          <div className="d-flex gap-3 justify-content-center flex-wrap">
            <Link to="/reservas" className="btn btn-success btn-lg px-5">
              <i className="bi bi-calendar-plus me-2"></i>Reservar ahora
            </Link>
            <Link to="/productos" className="btn btn-outline-light btn-lg px-5">
              <i className="bi bi-bag me-2"></i>Ver tienda
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-5 bg-light">
        <div className="container">
          <div className="row g-4 text-center">
            {[
              { icon: 'bi-lightning-charge', color: 'warning', title: 'Reserva rápida', text: 'En 3 pasos tenés tu cancha confirmada.' },
              { icon: 'bi-google',           color: 'danger',  title: 'Google Calendar', text: 'Tu reserva se agrega automáticamente a tu calendario.' },
              { icon: 'bi-shield-check',     color: 'success', title: 'Sin superposición', text: 'El sistema evita reservas duplicadas en el mismo horario.' },
            ].map((f) => (
              <div className="col-md-4" key={f.title}>
                <div className="card border-0 shadow-sm h-100 p-3">
                  <i className={`bi ${f.icon} text-${f.color} mb-3`} style={{ fontSize: 40 }}></i>
                  <h5 className="fw-bold">{f.title}</h5>
                  <p className="text-muted mb-0">{f.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Canchas destacadas */}
      <section className="py-5">
        <div className="container">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="fw-bold mb-0">Nuestras canchas</h2>
            <Link to="/reservas" className="btn btn-outline-success btn-sm">Ver todas</Link>
          </div>
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-success"></div>
            </div>
          ) : canchas.length === 0 ? (
            <p className="text-muted">No hay canchas disponibles todavía.</p>
          ) : (
            <div className="row g-4">
              {canchas.map((c) => (
                <div className="col-md-4" key={c._id}>
                  <CanchaCard cancha={c} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Productos destacados */}
      <section className="py-5 bg-light">
        <div className="container">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="fw-bold mb-0">Tienda deportiva</h2>
            <Link to="/productos" className="btn btn-outline-success btn-sm">Ver todo</Link>
          </div>
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-success"></div>
            </div>
          ) : productos.length === 0 ? (
            <p className="text-muted">No hay productos disponibles todavía.</p>
          ) : (
            <div className="row g-4">
              {productos.map((p) => (
                <div className="col-6 col-md-3" key={p._id}>
                  <ProductoCard producto={p} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

export default Home
