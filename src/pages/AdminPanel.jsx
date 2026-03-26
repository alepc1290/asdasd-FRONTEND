import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { Plus, Pencil, Trash2, RefreshCw, X, Check, Shield } from 'lucide-react'
import {
  getCanchas, createCancha, updateCancha, deleteCancha,
  getProductos, createProducto, updateProducto, deleteProducto,
  getUsers, deleteUser,
  getReservasAdmin, confirmarPago, cancelarPago,
} from '../services/api'
import { EstadoPagoBadge } from '../components/InstruccionesPago'

const CANCHA_VACIA   = { nombre: '', tipo: 'futbol5', precio: '', descripcion: '', imagen: '', estado: 'disponible' }
const PRODUCTO_VACIO = { nombre: '', precio: '', stock: '', descripcion: '', imagen: '' }

const TABS = ['canchas', 'productos', 'usuarios', 'reservas']

function Spinner() {
  return <div className="w-8 h-8 border-2 border-carbon-600 border-t-verde-500 rounded-full animate-spin mx-auto" />
}

function FieldLabel({ children }) {
  return <label className="font-mono text-xs text-carbon-400 uppercase tracking-widest block mb-1.5">{children}</label>
}

export default function AdminPanel() {
  const [tab, setTab] = useState('canchas')

  const [canchas,      setCanchas]      = useState([])
  const [loadingC,     setLoadingC]     = useState(true)
  const [formCancha,   setFormCancha]   = useState(CANCHA_VACIA)
  const [editandoC,    setEditandoC]    = useState(null)
  const [submittingC,  setSubmittingC]  = useState(false)

  const [productos,    setProductos]    = useState([])
  const [loadingP,     setLoadingP]     = useState(true)
  const [formProducto, setFormProducto] = useState(PRODUCTO_VACIO)
  const [editandoP,    setEditandoP]    = useState(null)
  const [submittingP,  setSubmittingP]  = useState(false)

  const [usuarios,  setUsuarios]  = useState([])
  const [loadingU,  setLoadingU]  = useState(true)

  const [reservasAdmin, setReservasAdmin] = useState([])
  const [loadingR,      setLoadingR]      = useState(true)

  useEffect(() => { fetchCanchas(); fetchProductos(); fetchUsuarios(); fetchReservasAdmin() }, [])

  const fetchCanchas       = () => { setLoadingC(true);  getCanchas().then(r => setCanchas(r.data.data)).catch(console.error).finally(() => setLoadingC(false)) }
  const fetchProductos     = () => { setLoadingP(true); getProductos().then(r => setProductos(r.data.data)).catch(console.error).finally(() => setLoadingP(false)) }
  const fetchUsuarios      = () => { setLoadingU(true); getUsers().then(r => setUsuarios(r.data.data)).catch(console.error).finally(() => setLoadingU(false)) }
  const fetchReservasAdmin = () => { setLoadingR(true); getReservasAdmin().then(r => setReservasAdmin(r.data.reservas)).catch(console.error).finally(() => setLoadingR(false)) }

  // ==== Canchas ====
  const handleChangeC    = (e) => setFormCancha({ ...formCancha, [e.target.name]: e.target.value })
  const handleEditCancha = (c) => { setEditandoC(c._id); setFormCancha({ nombre: c.nombre, tipo: c.tipo, precio: c.precio, descripcion: c.descripcion || '', imagen: c.imagen || '', estado: c.estado }) }
  const cancelarEditC    = () => { setEditandoC(null); setFormCancha(CANCHA_VACIA) }

  const handleSubmitCancha = async (e) => {
    e.preventDefault()
    if (!formCancha.nombre || !formCancha.precio) { toast.error('Nombre y precio son requeridos'); return }
    setSubmittingC(true)
    try {
      if (editandoC) { await updateCancha(editandoC, formCancha); toast.success('Cancha actualizada') }
      else           { await createCancha(formCancha); toast.success('Cancha creada') }
      cancelarEditC(); fetchCanchas()
    } catch (err) { toast.error(err.response?.data?.message || 'Error') }
    finally { setSubmittingC(false) }
  }

  const handleDeleteCancha = async (id) => {
    if (!confirm('¿Eliminar esta cancha?')) return
    try { await deleteCancha(id); toast.success('Cancha eliminada'); fetchCanchas() }
    catch (err) { toast.error(err.response?.data?.message || 'Error') }
  }

  // ==== Productos ====
  const handleChangeP      = (e) => setFormProducto({ ...formProducto, [e.target.name]: e.target.value })
  const handleEditProducto = (p) => { setEditandoP(p._id); setFormProducto({ nombre: p.nombre, precio: p.precio, stock: p.stock, descripcion: p.descripcion || '', imagen: p.imagen || '' }) }
  const cancelarEditP      = () => { setEditandoP(null); setFormProducto(PRODUCTO_VACIO) }

  const handleSubmitProducto = async (e) => {
    e.preventDefault()
    if (!formProducto.nombre || !formProducto.precio) { toast.error('Nombre y precio son requeridos'); return }
    setSubmittingP(true)
    try {
      if (editandoP) { await updateProducto(editandoP, formProducto); toast.success('Producto actualizado') }
      else           { await createProducto(formProducto); toast.success('Producto creado') }
      cancelarEditP(); fetchProductos()
    } catch (err) { toast.error(err.response?.data?.message || 'Error') }
    finally { setSubmittingP(false) }
  }

  const handleDeleteProducto = async (id) => {
    if (!confirm('¿Eliminar este producto?')) return
    try { await deleteProducto(id); toast.success('Producto eliminado'); fetchProductos() }
    catch (err) { toast.error(err.response?.data?.message || 'Error') }
  }

  // ==== Usuarios ====
  const handleDeleteUser = async (id) => {
    if (!confirm('¿Eliminar este usuario?')) return
    try { await deleteUser(id); toast.success('Usuario eliminado'); fetchUsuarios() }
    catch (err) { toast.error(err.response?.data?.message || 'Error') }
  }

  // ==== Reservas admin ====
  const handleConfirmarPago = async (id, nombre) => {
    try { await confirmarPago(id); toast.success(`Pago de ${nombre} confirmado`); fetchReservasAdmin() }
    catch (err) { toast.error(err.response?.data?.message || 'Error') }
  }
  const handleCancelarPago = async (id) => {
    if (!confirm('¿Cancelar este pago?')) return
    try { await cancelarPago(id); toast.success('Cancelado'); fetchReservasAdmin() }
    catch (err) { toast.error(err.response?.data?.message || 'Error') }
  }

  const FormField = ({ label, children }) => (
    <div><FieldLabel>{label}</FieldLabel>{children}</div>
  )

  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      {/* Header */}
      <div className="mb-10">
        <p className="section-label mb-2">Panel de control</p>
        <h1 className="section-title text-5xl md:text-6xl flex items-center gap-3">
          <Shield size={40} className="text-verde-500" /> Admin
        </h1>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-8 border-b border-carbon-700 overflow-x-auto">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-5 py-3 font-display font-bold uppercase tracking-widest text-xs whitespace-nowrap transition-all border-b-2 -mb-px ${
              tab === t
                ? 'text-verde-400 border-verde-500'
                : 'text-carbon-400 border-transparent hover:text-white'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* ====─ TAB CANCHAS ==== */}
      {tab === 'canchas' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-1">
            <div className="bg-carbon-800 border border-carbon-600 p-6">
              <h3 className="font-display font-bold text-white uppercase tracking-wide text-sm mb-5 flex items-center gap-2">
                {editandoC ? <><Pencil size={14} className="text-verde-500" /> Editar cancha</> : <><Plus size={14} className="text-verde-500" /> Nueva cancha</>}
              </h3>
              <form onSubmit={handleSubmitCancha} className="space-y-4">
                <FormField label="Nombre">
                  <input name="nombre" className="input-field" value={formCancha.nombre} onChange={handleChangeC} placeholder="Cancha A" required />
                </FormField>
                <FormField label="Tipo">
                  <select name="tipo" className="input-field" value={formCancha.tipo} onChange={handleChangeC}>
                    <option value="futbol5">Fútbol 5</option>
                    <option value="futbol7">Fútbol 7</option>
                  </select>
                </FormField>
                <FormField label="Precio / hora">
                  <input name="precio" type="number" min="0" className="input-field" value={formCancha.precio} onChange={handleChangeC} placeholder="5000" required />
                </FormField>
                <FormField label="Estado">
                  <select name="estado" className="input-field" value={formCancha.estado} onChange={handleChangeC}>
                    <option value="disponible">Disponible</option>
                    <option value="mantenimiento">Mantenimiento</option>
                    <option value="inactiva">Inactiva</option>
                  </select>
                </FormField>
                <FormField label="Descripción">
                  <textarea name="descripcion" className="input-field resize-none" rows={2} value={formCancha.descripcion} onChange={handleChangeC} placeholder="Cancha de césped sintético..." />
                </FormField>
                <FormField label="URL imagen">
                  <input name="imagen" className="input-field" value={formCancha.imagen} onChange={handleChangeC} placeholder="https://..." />
                </FormField>
                <div className="flex gap-2 pt-1">
                  <button type="submit" className="btn-primary flex-1 flex items-center justify-center gap-2 text-xs py-2" disabled={submittingC}>
                    {submittingC ? <div className="w-4 h-4 border-2 border-carbon-900/40 border-t-carbon-900 rounded-full animate-spin" /> : editandoC ? 'Actualizar' : 'Crear cancha'}
                  </button>
                  {editandoC && (
                    <button type="button" onClick={cancelarEditC} className="btn-outline px-3 py-2 text-xs">
                      <X size={14} />
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>

          {/* Table */}
          <div className="lg:col-span-2">
            {loadingC ? <div className="flex justify-center py-16"><Spinner /></div> : canchas.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 gap-3 bg-carbon-800 border border-carbon-600">
                <p className="text-carbon-400 text-sm">No hay canchas todavía</p>
              </div>
            ) : (
              <div className="bg-carbon-800 border border-carbon-600 overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-carbon-600">
                      <th className="text-left px-4 py-3 font-mono text-xs text-carbon-400 uppercase tracking-widest">Cancha</th>
                      <th className="text-left px-4 py-3 font-mono text-xs text-carbon-400 uppercase tracking-widest">Tipo</th>
                      <th className="text-left px-4 py-3 font-mono text-xs text-carbon-400 uppercase tracking-widest">Precio</th>
                      <th className="text-left px-4 py-3 font-mono text-xs text-carbon-400 uppercase tracking-widest">Estado</th>
                      <th className="px-4 py-3" />
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-carbon-700">
                    {canchas.map((c) => (
                      <tr key={c._id} className="hover:bg-carbon-700/50 transition-colors">
                        <td className="px-4 py-3">
                          <p className="font-display font-bold text-white uppercase text-sm">{c.nombre}</p>
                          <p className="text-carbon-400 text-xs">{c.descripcion}</p>
                        </td>
                        <td className="px-4 py-3"><span className="badge-success">{c.tipo === 'futbol5' ? 'F5' : 'F7'}</span></td>
                        <td className="px-4 py-3 font-mono text-verde-400 font-bold">${c.precio?.toLocaleString()}</td>
                        <td className="px-4 py-3">
                          <span className={c.estado === 'disponible' ? 'badge-success' : c.estado === 'mantenimiento' ? 'badge-warning' : 'badge-danger'}>
                            {c.estado}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex gap-2 justify-end">
                            <button onClick={() => handleEditCancha(c)} className="text-carbon-400 hover:text-verde-400 transition-colors"><Pencil size={14} /></button>
                            <button onClick={() => handleDeleteCancha(c._id)} className="text-carbon-400 hover:text-red-400 transition-colors"><Trash2 size={14} /></button>
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

      {/* ====─ TAB PRODUCTOS ====─ */}
      {tab === 'productos' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <div className="bg-carbon-800 border border-carbon-600 p-6">
              <h3 className="font-display font-bold text-white uppercase tracking-wide text-sm mb-5 flex items-center gap-2">
                {editandoP ? <><Pencil size={14} className="text-verde-500" /> Editar producto</> : <><Plus size={14} className="text-verde-500" /> Nuevo producto</>}
              </h3>
              <form onSubmit={handleSubmitProducto} className="space-y-4">
                <FormField label="Nombre">
                  <input name="nombre" className="input-field" value={formProducto.nombre} onChange={handleChangeP} placeholder="Pelota adidas" required />
                </FormField>
                <FormField label="Precio">
                  <input name="precio" type="number" min="0" className="input-field" value={formProducto.precio} onChange={handleChangeP} placeholder="15000" required />
                </FormField>
                <FormField label="Stock">
                  <input name="stock" type="number" min="0" className="input-field" value={formProducto.stock} onChange={handleChangeP} placeholder="10" required />
                </FormField>
                <FormField label="Descripción">
                  <textarea name="descripcion" className="input-field resize-none" rows={2} value={formProducto.descripcion} onChange={handleChangeP} placeholder="Descripción..." />
                </FormField>
                <FormField label="URL imagen">
                  <input name="imagen" className="input-field" value={formProducto.imagen} onChange={handleChangeP} placeholder="https://..." />
                </FormField>
                <div className="flex gap-2 pt-1">
                  <button type="submit" className="btn-primary flex-1 flex items-center justify-center gap-2 text-xs py-2" disabled={submittingP}>
                    {submittingP ? <div className="w-4 h-4 border-2 border-carbon-900/40 border-t-carbon-900 rounded-full animate-spin" /> : editandoP ? 'Actualizar' : 'Crear producto'}
                  </button>
                  {editandoP && (
                    <button type="button" onClick={cancelarEditP} className="btn-outline px-3 py-2 text-xs"><X size={14} /></button>
                  )}
                </div>
              </form>
            </div>
          </div>
          <div className="lg:col-span-2">
            {loadingP ? <div className="flex justify-center py-16"><Spinner /></div> : productos.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 gap-3 bg-carbon-800 border border-carbon-600">
                <p className="text-carbon-400 text-sm">No hay productos todavía</p>
              </div>
            ) : (
              <div className="bg-carbon-800 border border-carbon-600 overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-carbon-600">
                      {['Producto','Precio','Stock',''].map((h) => (
                        <th key={h} className="text-left px-4 py-3 font-mono text-xs text-carbon-400 uppercase tracking-widest">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-carbon-700">
                    {productos.map((p) => (
                      <tr key={p._id} className="hover:bg-carbon-700/50 transition-colors">
                        <td className="px-4 py-3">
                          <p className="font-display font-bold text-white uppercase text-sm">{p.nombre}</p>
                          <p className="text-carbon-400 text-xs">{p.descripcion}</p>
                        </td>
                        <td className="px-4 py-3 font-mono text-verde-400 font-bold">${p.precio?.toLocaleString()}</td>
                        <td className="px-4 py-3">
                          <span className={p.stock > 0 ? 'badge-success' : 'badge-danger'}>{p.stock}</span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex gap-2 justify-end">
                            <button onClick={() => handleEditProducto(p)} className="text-carbon-400 hover:text-verde-400 transition-colors"><Pencil size={14} /></button>
                            <button onClick={() => handleDeleteProducto(p._id)} className="text-carbon-400 hover:text-red-400 transition-colors"><Trash2 size={14} /></button>
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

      {/* ====─ TAB USUARIOS ====─ */}
      {tab === 'usuarios' && (
        <div>
          {loadingU ? <div className="flex justify-center py-16"><Spinner /></div> : usuarios.length === 0 ? (
            <div className="flex justify-center py-16"><p className="text-carbon-400 text-sm">No hay usuarios todavía</p></div>
          ) : (
            <div className="bg-carbon-800 border border-carbon-600 overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-carbon-600">
                    {['Nombre','Email','Rol','Registro',''].map((h) => (
                      <th key={h} className="text-left px-4 py-3 font-mono text-xs text-carbon-400 uppercase tracking-widest">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-carbon-700">
                  {usuarios.map((u) => (
                    <tr key={u._id} className="hover:bg-carbon-700/50 transition-colors">
                      <td className="px-4 py-3 font-display font-bold text-white uppercase text-sm">{u.nombre}</td>
                      <td className="px-4 py-3 font-mono text-carbon-300 text-xs">{u.email}</td>
                      <td className="px-4 py-3">
                        <span className={u.rol === 'admin' ? 'badge-warning' : 'badge-default'}>{u.rol}</span>
                      </td>
                      <td className="px-4 py-3 font-mono text-carbon-400 text-xs">
                        {new Date(u.createdAt).toLocaleDateString('es-AR')}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button onClick={() => handleDeleteUser(u._id)} className="text-carbon-400 hover:text-red-400 transition-colors">
                          <Trash2 size={14} />
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

      {/* ====─ TAB RESERVAS ====─ */}
      {tab === 'reservas' && (
        <div>
          <div className="flex justify-between items-center mb-5 flex-wrap gap-3">
            <p className="font-mono text-carbon-400 text-xs uppercase tracking-widest">
              {reservasAdmin.length} reserva{reservasAdmin.length !== 1 ? 's' : ''} en total
            </p>
            <button onClick={fetchReservasAdmin} className="btn-ghost flex items-center gap-1 text-xs">
              <RefreshCw size={12} /> Actualizar
            </button>
          </div>

          {loadingR ? <div className="flex justify-center py-16"><Spinner /></div> : reservasAdmin.length === 0 ? (
            <div className="flex justify-center py-16"><p className="text-carbon-400 text-sm">No hay reservas todavía</p></div>
          ) : (
            <div className="bg-carbon-800 border border-carbon-600 overflow-x-auto">
              <table className="w-full text-sm min-w-[700px]">
                <thead>
                  <tr className="border-b border-carbon-600">
                    {['Usuario','Cancha','Fecha','Horario','Estado','Acciones'].map((h) => (
                      <th key={h} className="text-left px-4 py-3 font-mono text-xs text-carbon-400 uppercase tracking-widest">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-carbon-700">
                  {reservasAdmin.map((r) => {
                    const estadoPago = r.estadoPago || 'pendiente'
                    const horas  = parseInt(r.horaFin) - parseInt(r.horaInicio)
                    const total  = r.precio * horas
                    return (
                      <tr key={r._id} className="hover:bg-carbon-700/50 transition-colors">
                        <td className="px-4 py-3">
                          <p className="font-display font-bold text-white uppercase text-xs">{r.usuario}</p>
                          <p className="font-mono text-carbon-400 text-xs">{r.email}</p>
                        </td>
                        <td className="px-4 py-3">
                          <p className="font-display font-bold text-white uppercase text-xs">{r.cancha}</p>
                          <p className="font-mono text-carbon-400 text-xs">${r.precio?.toLocaleString()}/h</p>
                        </td>
                        <td className="px-4 py-3 font-mono text-carbon-300 text-xs">
                          {new Date(r.fecha + 'T12:00:00').toLocaleDateString('es-AR', { weekday:'short', day:'numeric', month:'short' })}
                        </td>
                        <td className="px-4 py-3">
                          <p className="font-mono text-white text-xs">{r.horaInicio} – {r.horaFin} hs</p>
                          <p className="font-mono text-verde-400 text-xs font-bold">${total?.toLocaleString()}</p>
                        </td>
                        <td className="px-4 py-3">
                          <EstadoPagoBadge estado={estadoPago} />
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex flex-col gap-1.5">
                            {estadoPago !== 'confirmado' && estadoPago !== 'cancelado' && (
                              <button
                                onClick={() => handleConfirmarPago(r._id, r.usuario)}
                                className="flex items-center gap-1 text-xs text-verde-400 hover:text-verde-300 font-mono transition-colors"
                              >
                                <Check size={12} /> Confirmar pago
                              </button>
                            )}
                            {estadoPago !== 'cancelado' && (
                              <button
                                onClick={() => handleCancelarPago(r._id)}
                                className="flex items-center gap-1 text-xs text-red-400 hover:text-red-300 font-mono transition-colors"
                              >
                                <X size={12} /> Cancelar
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
