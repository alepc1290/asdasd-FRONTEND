function ProductoCard({ producto }) {
  return (
    <div className="card h-100 shadow-sm border-0">
      {producto.imagen ? (
        <img src={producto.imagen} alt={producto.nombre} className="card-img-top" style={{ height: 200, objectFit: 'cover' }} />
      ) : (
        <div className="bg-secondary d-flex align-items-center justify-content-center" style={{ height: 200 }}>
          <i className="bi bi-box-seam text-white" style={{ fontSize: 48 }}></i>
        </div>
      )}
      <div className="card-body d-flex flex-column">
        <h6 className="card-title">{producto.nombre}</h6>
        <p className="text-muted small flex-grow-1">{producto.descripcion}</p>
        <div className="d-flex justify-content-between align-items-center mt-2">
          <span className="fw-bold text-success fs-5">${producto.precio?.toLocaleString()}</span>
          <span className={`badge ${producto.stock > 0 ? 'bg-success' : 'bg-danger'}`}>
            {producto.stock > 0 ? `Stock: ${producto.stock}` : 'Sin stock'}
          </span>
        </div>
      </div>
    </div>
  )
}

export default ProductoCard
