import { Link } from 'react-router'

const TIPO_LABEL = { futbol5: 'Fútbol 5', futbol7: 'Fútbol 7', futbol7: 'Fútbol 11' }
const ESTADO_COLOR = { disponible: 'success', mantenimiento: 'warning', inactiva: 'danger' }

function CanchaCard({ cancha, showReservar = true }) {
  return (
    <div className="card h-100 shadow-sm border-0">
      {cancha.imagen ? (
        <img src={cancha.imagen} alt={cancha.nombre} className="card-img-top" style={{ height: 180, objectFit: 'cover' }} />
      ) : (
        <div className="bg-success d-flex align-items-center justify-content-center" style={{ height: 180 }}>
          <i className="bi bi-dribbble text-white" style={{ fontSize: 64 }}></i>
        </div>
      )}
      <div className="card-body d-flex flex-column">
        <div className="d-flex justify-content-between align-items-start mb-2">
          <h5 className="card-title mb-0">{cancha.nombre}</h5>
          <span className={`badge bg-${ESTADO_COLOR[cancha.estado] || 'secondary'}`}>
            {cancha.estado}
          </span>
        </div>
        <p className="text-muted small mb-1">
          <i className="bi bi-tag me-1"></i>{TIPO_LABEL[cancha.tipo] || cancha.tipo}
        </p>
        <p className="text-muted small mb-2">{cancha.descripcion}</p>
        <p className="fw-bold text-success fs-5 mb-3">
          ${cancha.precio?.toLocaleString()} / hora
        </p>
        {showReservar && cancha.estado === 'disponible' && (
          <Link to="/reservas" state={{ canchaId: cancha._id }} className="btn btn-success mt-auto">
            <i className="bi bi-calendar-plus me-2"></i>Reservar
          </Link>
        )}
        {cancha.estado !== 'disponible' && (
          <button className="btn btn-secondary mt-auto" disabled>No disponible</button>
        )}
      </div>
    </div>
  )
}

export default CanchaCard
