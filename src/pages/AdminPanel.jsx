import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import {
  getCanchas, createCancha, updateCancha, deleteCancha,
  getProductos, createProducto, updateProducto, deleteProducto,
  getUsers, deleteUser,
} from '../services/api'

const CANCHA_VACIA = { nombre: '', tipo: 'futbol5', precio: '', descripcion: '', imagen: '', estado: 'disponible' }
const PRODUCTO_VACIO = { nombre: '', precio: '', stock: '', descripcion: '', imagen: '' }

function AdminPanel() {
  const [tab, setTab] = useState('canchas')

  // ── CANCHAS ──
  const [canchas, setCanchas] = useState([])
  const [loadingC, setLoadingC] = useState(true)
  const [formCancha, setFormCancha] = useState(CANCHA_VACIA)
  const [editandoC, setEditandoC] = useState(null)
  const [submittingC, setSubmittingC] = useState(false)

  // ── PRODUCTOS ──
  const [productos, setProductos] = useState([])
  const [loadingP, setLoadingP] = useState(true)
  const [formProducto, setFormProducto] = useState(PRODUCTO_VACIO)
  const [editandoP, setEditandoP] = useState(null)
  const [submittingP, setSubmittingP] = useState(false)

  // ── USUARIOS ──
  const [usuarios, setUsuarios] = useState([])
  const [loadingU, setLoadingU] = useState(true)

  useEffect(() => { fetchCanchas(); fetchProductos(); fetchUsuarios() }, [])

  const fetchCanchas = () => { setLoadingC(true); getCanchas().then(r => setCanchas(r.data.data)).catch(console.error).finally(() => setLoadingC(false)) }
  const fetchProductos = () => { setLoadingP(true); getProductos().then(r => setProductos(r.data.data)).catch(console.error).finally(() => setLoadingP(false)) }
  const fetchUsuarios = () => { setLoadingU(true); getUsers().then(r => setUsuarios(r.data.data)).catch(console.error).finally(() => setLoadingU(false)) }

  // ────────────────── CANCHAS ──────────────────
  const handleChangeC = (e) => setFormCancha({ ...formCancha, [e.target.name]: e.target.value })

  const handleEditCancha = (c) => { setEditandoC(c._id); setFormCancha({ nombre: c.nombre, tipo: c.tipo, precio: c.precio, descripcion: c.descripcion || '', imagen: c.imagen || '', estado: c.estado }) }
  const cancelarEditC = () => { setEditandoC(null); setFormCancha(CANCHA_VACIA) }

  const handleSubmitCancha = async (e) => {
    e.preventDefault()
    if (!formCancha.nombre || !formCancha.precio) { toast.error('Nombre y precio son requeridos'); return }
    setSubmittingC(true)
    try {
      if (editandoC) {
        await updateCancha(editandoC, formCancha)
        toast.success('Cancha actualizada')
      } else {
        await createCancha(formCancha)
        toast.success('Cancha creada')
      }
      cancelarEditC()
      fetchCanchas()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error')
    } finally {
      setSubmittingC(false)
    }
  }

  const handleDeleteCancha = async (id) => {
    if (!confirm('¿Eliminar esta cancha?')) return
    try { await deleteCancha(id); toast.success('Cancha eliminada'); fetchCanchas() }
    catch (err) { toast.error(err.response?.data?.message || 'Error') }
  }

  // ────────────────── PRODUCTOS ──────────────────
  const handleChangeP = (e) => setFormProducto({ ...formProducto, [e.target.name]: e.target.value })

  const handleEditProducto = (p) => { setEditandoP(p._id); setFormProducto({ nombre: p.nombre, precio: p.precio, stock: p.stock, descripcion: p.descripcion || '', imagen: p.imagen || '' }) }
  const cancelarEditP = () => { setEditandoP(null); setFormProducto(PRODUCTO_VACIO) }

  const handleSubmitProducto = async (e) => {
    e.preventDefault()
    if (!formProducto.nombre || !formProducto.precio || formProducto.stock === '') { toast.error('Nombre, precio y stock son requeridos'); return }
    setSubmittingP(true)
    try {
      if (editandoP) {
        await updateProducto(editandoP, formProducto)
        toast.success('Producto actualizado')
      } else {
        await createProducto(formProducto)
        toast.success('Producto creado')
      }
      cancelarEditP()
      fetchProductos()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error')
    } finally {
      setSubmittingP(false)
    }
  }

  const handleDeleteProducto = async (id) => {
    if (!confirm('¿Eliminar este producto?')) return
    try { await deleteProducto(id); toast.success('Producto eliminado'); fetchProductos() }
    catch (err) { toast.error(err.response?.data?.message || 'Error') }
  }

  // ────────────────── USUARIOS ──────────────────
  const handleDeleteUser = async (id) => {
    if (!confirm('¿Eliminar este usuario?')) return
    try { await deleteUser(id); toast.success('Usuario eliminado'); fetchUsuarios() }
    catch (err) { toast.error(err.response?.data?.message || 'Error') }
  }

  return (
    <div className="py-5">
      <div className="container">
        {/* Header */}
        <div className="d-flex align-items-center gap-3 mb-4">
          <i className="bi bi-gear-fill text-warning" style={{ fontSize: 40 }}></i>
          <div>
            <h1 className="fw-bold mb-0">Panel de administración</h1>
            <p className="text-muted mb-0 small">Gestioná canchas, productos y usuarios</p>
          </div>
        </div>

        {/* Stats rápidas */}
        <div className="row g-3 mb-4">
          {[
            { label: 'Canchas', val: canchas.length, icon: 'bi-dribbble', color: 'success' },
            { label: 'Productos', val: productos.length, icon: 'bi-box-seam', color: 'primary' },
            { label: 'Usuarios', val: usuarios.length, icon: 'bi-people', color: 'warning' },
          ].map((s) => (
            <div className="col-4" key={s.label}>
              <div className={`card border-0 shadow-sm text-center py-3`}>
                <i className={`bi ${s.icon} text-${s.color} mb-1`} style={{ fontSize: 28 }}></i>
                <h3 className="fw-bold mb-0">{s.val}</h3>
                <p className="text-muted small mb-0">{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <ul className="nav nav-tabs mb-4">
          {['canchas', 'productos', 'usuarios'].map((t) => (
            <li className="nav-item" key={t}>
              <button
                className={`nav-link text-capitalize fw-semibold ${tab === t ? 'active' : ''}`}
                onClick={() => setTab(t)}
              >
                {t === 'canchas' && <i className="bi bi-dribbble me-2"></i>}
                {t === 'productos' && <i className="bi bi-box-seam me-2"></i>}
                {t === 'usuarios' && <i className="bi bi-people me-2"></i>}
                {t}
              </button>
            </li>
          ))}
        </ul>

        {/* ─── TAB CANCHAS ─── */}
        {tab === 'canchas' && (
          <div className="row g-4">
            {/* Formulario */}
            <div className="col-lg-4">
              <div className="card border-0 shadow-sm">
                <div className="card-body p-4">
                  <h6 className="fw-bold mb-3">
                    {editandoC ? <><i className="bi bi-pencil me-2"></i>Editar cancha</> : <><i className="bi bi-plus-circle me-2"></i>Nueva cancha</>}
                  </h6>
                  <form onSubmit={handleSubmitCancha}>
                    <div className="mb-3">
                      <label className="form-label small fw-semibold">Nombre</label>
                      <input name="nombre" className="form-control" value={formCancha.nombre} onChange={handleChangeC} placeholder="Cancha A" required />
                    </div>
                    <div className="mb-3">
                      <label className="form-label small fw-semibold">Tipo</label>
                      <select name="tipo" className="form-select" value={formCancha.tipo} onChange={handleChangeC}>
                        <option value="futbol5" disabled>Seleccionar</option>
                        <option value="futbol5">Fútbol sala</option>
                        <option value="futbol5">Fútbol 5</option>
                        <option value="futbol7">Fútbol 7</option>
                        <option value="futbol7">Fútbol 11</option>
                      </select>
                    </div>
                    <div className="mb-3">
                      <label className="form-label small fw-semibold">Precio / hora</label>
                      <div className="input-group">
                        <span className="input-group-text">$</span>
                        <input name="precio" type="number" min="0" className="form-control" value={formCancha.precio} onChange={handleChangeC} placeholder="5000" required />
                      </div>
                    </div>
                    <div className="mb-3">
                      <label className="form-label small fw-semibold">Estado</label>
                      <select name="estado" className="form-select" value={formCancha.estado} onChange={handleChangeC}>
                        <option value="disponible">Disponible</option>
                        <option value="mantenimiento">Mantenimiento</option>
                        <option value="inactiva">Inactiva</option>
                      </select>
                    </div>
                    <div className="mb-3">
                      <label className="form-label small fw-semibold">Descripción</label>
                      <textarea name="descripcion" className="form-control" rows={2} value={formCancha.descripcion} onChange={handleChangeC} placeholder="Cancha de césped sintético..." />
                    </div>
                    <div className="mb-3">
                      <label className="form-label small fw-semibold">URL imagen</label>
                      <input name="imagen" className="form-control" value={formCancha.imagen} onChange={handleChangeC} placeholder="https://..." />
                    </div>
                    <div className="d-flex gap-2">
                      <button type="submit" className="btn btn-success flex-grow-1" disabled={submittingC}>
                        {submittingC ? <span className="spinner-border spinner-border-sm"></span> : editandoC ? 'Actualizar' : 'Crear cancha'}
                      </button>
                      {editandoC && (
                        <button type="button" className="btn btn-outline-secondary" onClick={cancelarEditC}>
                          <i className="bi bi-x-lg"></i>
                        </button>
                      )}
                    </div>
                  </form>
                </div>
              </div>
            </div>

            {/* Tabla */}
            <div className="col-lg-8">
              {loadingC ? (
                <div className="text-center py-5"><div className="spinner-border text-success"></div></div>
              ) : canchas.length === 0 ? (
                <div className="text-center py-5 text-muted"><i className="bi bi-dribbble" style={{ fontSize: 48 }}></i><p className="mt-2">No hay canchas todavía</p></div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover align-middle">
                    <thead className="table-dark">
                      <tr><th>Cancha</th><th>Tipo</th><th>Precio</th><th>Estado</th><th>Acciones</th></tr>
                    </thead>
                    <tbody>
                      {canchas.map((c) => (
                        <tr key={c._id}>
                          <td>
                            <div className="fw-semibold">{c.nombre}</div>
                            <div className="text-muted small">{c.descripcion}</div>
                          </td>
                          <td><span className="badge bg-success">{c.tipo === 'futbol5' ? 'F5' : 'F7'}</span></td>
                          <td className="fw-bold">${c.precio?.toLocaleString()}</td>
                          <td>
                            <span className={`badge bg-${c.estado === 'disponible' ? 'success' : c.estado === 'mantenimiento' ? 'warning' : 'danger'}`}>
                              {c.estado}
                            </span>
                          </td>
                          <td>
                            <div className="d-flex gap-2">
                              <button className="btn btn-outline-primary btn-sm" onClick={() => handleEditCancha(c)}>
                                <i className="bi bi-pencil"></i>
                              </button>
                              <button className="btn btn-outline-danger btn-sm" onClick={() => handleDeleteCancha(c._id)}>
                                <i className="bi bi-trash"></i>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ─── TAB PRODUCTOS ─── */}
        {tab === 'productos' && (
          <div className="row g-4">
            {/* Formulario */}
            <div className="col-lg-4">
              <div className="card border-0 shadow-sm">
                <div className="card-body p-4">
                  <h6 className="fw-bold mb-3">
                    {editandoP ? <><i className="bi bi-pencil me-2"></i>Editar producto</> : <><i className="bi bi-plus-circle me-2"></i>Nuevo producto</>}
                  </h6>
                  <form onSubmit={handleSubmitProducto}>
                    <div className="mb-3">
                      <label className="form-label small fw-semibold">Nombre</label>
                      <input name="nombre" className="form-control" value={formProducto.nombre} onChange={handleChangeP} placeholder="Pelota adidas" required />
                    </div>
                    <div className="mb-3">
                      <label className="form-label small fw-semibold">Precio</label>
                      <div className="input-group">
                        <span className="input-group-text">$</span>
                        <input name="precio" type="number" min="0" className="form-control" value={formProducto.precio} onChange={handleChangeP} placeholder="15000" required />
                      </div>
                    </div>
                    <div className="mb-3">
                      <label className="form-label small fw-semibold">Stock</label>
                      <input name="stock" type="number" min="0" className="form-control" value={formProducto.stock} onChange={handleChangeP} placeholder="10" required />
                    </div>
                    <div className="mb-3">
                      <label className="form-label small fw-semibold">Descripción</label>
                      <textarea name="descripcion" className="form-control" rows={2} value={formProducto.descripcion} onChange={handleChangeP} placeholder="Descripción del producto..." />
                    </div>
                    <div className="mb-3">
                      <label className="form-label small fw-semibold">URL imagen</label>
                      <input name="imagen" className="form-control" value={formProducto.imagen} onChange={handleChangeP} placeholder="https://..." />
                    </div>
                    <div className="d-flex gap-2">
                      <button type="submit" className="btn btn-success flex-grow-1" disabled={submittingP}>
                        {submittingP ? <span className="spinner-border spinner-border-sm"></span> : editandoP ? 'Actualizar' : 'Crear producto'}
                      </button>
                      {editandoP && (
                        <button type="button" className="btn btn-outline-secondary" onClick={cancelarEditP}>
                          <i className="bi bi-x-lg"></i>
                        </button>
                      )}
                    </div>
                  </form>
                </div>
              </div>
            </div>

            {/* Tabla */}
            <div className="col-lg-8">
              {loadingP ? (
                <div className="text-center py-5"><div className="spinner-border text-success"></div></div>
              ) : productos.length === 0 ? (
                <div className="text-center py-5 text-muted"><i className="bi bi-box-seam" style={{ fontSize: 48 }}></i><p className="mt-2">No hay productos todavía</p></div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover align-middle">
                    <thead className="table-dark">
                      <tr><th>Producto</th><th>Precio</th><th>Stock</th><th>Acciones</th></tr>
                    </thead>
                    <tbody>
                      {productos.map((p) => (
                        <tr key={p._id}>
                          <td>
                            <div className="fw-semibold">{p.nombre}</div>
                            <div className="text-muted small">{p.descripcion}</div>
                          </td>
                          <td className="fw-bold">${p.precio?.toLocaleString()}</td>
                          <td>
                            <span className={`badge ${p.stock > 0 ? 'bg-success' : 'bg-danger'}`}>{p.stock}</span>
                          </td>
                          <td>
                            <div className="d-flex gap-2">
                              <button className="btn btn-outline-primary btn-sm" onClick={() => handleEditProducto(p)}>
                                <i className="bi bi-pencil"></i>
                              </button>
                              <button className="btn btn-outline-danger btn-sm" onClick={() => handleDeleteProducto(p._id)}>
                                <i className="bi bi-trash"></i>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ─── TAB USUARIOS ─── */}
        {tab === 'usuarios' && (
          <div>
            {loadingU ? (
              <div className="text-center py-5"><div className="spinner-border text-warning"></div></div>
            ) : usuarios.length === 0 ? (
              <div className="text-center py-5 text-muted"><i className="bi bi-people" style={{ fontSize: 48 }}></i><p className="mt-2">No hay usuarios todavía</p></div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover align-middle">
                  <thead className="table-dark">
                    <tr><th>Nombre</th><th>Email</th><th>Rol</th><th>Registro</th><th>Acciones</th></tr>
                  </thead>
                  <tbody>
                    {usuarios.map((u) => (
                      <tr key={u._id}>
                        <td className="fw-semibold">{u.nombre}</td>
                        <td className="text-muted">{u.email}</td>
                        <td>
                          <span className={`badge ${u.rol === 'admin' ? 'bg-warning text-dark' : 'bg-secondary'}`}>
                            {u.rol}
                          </span>
                        </td>
                        <td className="text-muted small">
                          {new Date(u.createdAt).toLocaleDateString('es-AR')}
                        </td>
                        <td>
                          <button className="btn btn-outline-danger btn-sm" onClick={() => handleDeleteUser(u._id)}>
                            <i className="bi bi-trash"></i>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminPanel
