import { useEffect, useState, useCallback } from 'react'
import { useLocation } from 'react-router'
import { toast } from 'sonner'
import {
  getCanchas, createReserva, getReservas,
  deleteReserva, getDisponibilidad,
} from '../services/api'
import { useAuth } from '../context/AuthContext'
import InstruccionesPago, { EstadoPagoBadge } from '../components/InstruccionesPago'

const DURACIONES = [1, 2, 3]

function Reservas() {
  const { auth }  = useAuth()
  const location  = useLocation()

  const [canchas,      setCanchas]      = useState([])
  const [misReservas,  setMisReservas]  = useState([])
  const [loadingCanchas,  setLoadingCanchas]  = useState(true)
  const [loadingReservas, setLoadingReservas] = useState(true)

  const [canchaId,   setCanchaId]   = useState(location.state?.canchaId || '')
  const [fecha,      setFecha]      = useState('')
  const [duracion,   setDuracion]   = useState(1)
  const [horaInicio, setHoraInicio] = useState('')

  const [disponibilidad, setDisponibilidad] = useState(null)
  const [loadingDisp,    setLoadingDisp]    = useState(false)

  const [submitting,        setSubmitting]        = useState(false)
  const [reservaCreada,     setReservaCreada]     = useState(null)   // datos para InstruccionesPago
  const [mostrarInstruc,    setMostrarInstruc]    = useState(false)

  const hoy = new Date().toISOString().split('T')[0]
  const canchaSeleccionada = canchas.find((c) => c._id === canchaId)

  // ── Carga inicial ──
  useEffect(() => {
    getCanchas()
      .then((res) => setCanchas(res.data.data.filter((c) => c.estado === 'disponible')))
      .catch(console.error)
      .finally(() => setLoadingCanchas(false))
    fetchMisReservas()
  }, [])

  // ── Disponibilidad al cambiar cancha o fecha ──
  useEffect(() => {
    setHoraInicio('')
    setReservaCreada(null)
    setMostrarInstruc(false)
    if (!canchaId || !fecha) { setDisponibilidad(null); return }
    setLoadingDisp(true)
    getDisponibilidad(canchaId, fecha)
      .then((res) => setDisponibilidad(res.data.data))
      .catch((err) => { console.error(err); toast.error('No se pudo cargar la disponibilidad'); setDisponibilidad(null) })
      .finally(() => setLoadingDisp(false))
  }, [canchaId, fecha])

  const fetchMisReservas = () => {
    setLoadingReservas(true)
    getReservas()
      .then((res) => {
        const userId = auth?.user?.id
        setMisReservas(res.data.data.filter((r) => (r.userId?._id || r.userId) === userId))
      })
      .catch(console.error)
      .finally(() => setLoadingReservas(false))
  }

  const slotEsSeleccionable = useCallback((slot) => {
    if (!disponibilidad) return false
    for (let i = 0; i < duracion; i++) {
      const s = `${String(parseInt(slot) + i).padStart(2, '0')}:00`
      if (!disponibilidad.horariosDisponibles.includes(s)) return false
    }
    return true
  }, [disponibilidad, duracion])

  const horaFin = horaInicio
    ? `${String(parseInt(horaInicio) + duracion).padStart(2, '0')}:00`
    : ''

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!canchaId || !fecha || !horaInicio) {
      toast.error('Seleccioná cancha, fecha y horario')
      return
    }
    setSubmitting(true)
    try {
      const res = await createReserva({ canchaId, fecha, horaInicio, horaFin })
      const nuevaReserva = res.data.data

      // Guardar datos para mostrar instrucciones de pago
      setReservaCreada({
        _id:        nuevaReserva._id,
        cancha:     canchaSeleccionada?.nombre,
        fecha,
        horaInicio,
        horaFin,
        precio:     canchaSeleccionada?.precio || 0,
        estadoPago: nuevaReserva.estadoPago,
        tieneCalendar: !!nuevaReserva.googleEventId,
      })
      setMostrarInstruc(true)
      toast.success('¡Reserva creada! Realizá la transferencia para confirmarla.')

      // Limpiar formulario y refrescar
      setHoraInicio(''); setFecha(''); setCanchaId(''); setDisponibilidad(null)
      fetchMisReservas()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error al crear la reserva')
    } finally {
      setSubmitting(false)
    }
  }

  const handleEliminar = async (id) => {
    if (!confirm('¿Cancelar esta reserva?')) return
    try {
      await deleteReserva(id)
      toast.success('Reserva cancelada')
      fetchMisReservas()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error al eliminar')
    }
  }

  const formatFecha = (f) =>
    new Date(f + 'T12:00:00').toLocaleDateString('es-AR', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
    })

  const todosLosSlots = Array.from({ length: 15 }, (_, i) =>
    `${String(i + 8).padStart(2, '0')}:00`
  )

  const getSlotEstado = (slot) => {
    if (!disponibilidad) return 'sin-datos'
    if (slot === horaInicio) return 'seleccionado'
    if (disponibilidad.horariosOcupados.includes(slot)) return 'ocupado'
    if (!slotEsSeleccionable(slot)) return 'no-aplica'
    return 'disponible'
  }

  return (
    <div className="py-5">
      <div className="container">

        <div className="text-center mb-5">
          <i className="bi bi-calendar-week text-success" style={{ fontSize: 48 }}></i>
          <h1 className="fw-bold mt-2">Reservar cancha</h1>
          <p className="text-muted">Elegí cancha, fecha y horario — pagás por transferencia</p>
        </div>

        <div className="row g-4">

          {/* ══════════ COLUMNA IZQUIERDA ══════════ */}
          <div className="col-lg-5">

            {/* Instrucciones de pago (aparecen tras reservar) */}
            {mostrarInstruc && reservaCreada && (
              <div className="mb-4">
                <InstruccionesPago
                  reserva={reservaCreada}
                  onClose={() => setMostrarInstruc(false)}
                />
              </div>
            )}

            {/* Formulario */}
            <div className="card shadow-sm border-0 sticky-top" style={{ top: 80 }}>
              <div className="card-body p-4">
                <h5 className="fw-bold mb-4">
                  <i className="bi bi-pencil-square me-2 text-success"></i>
                  Nueva reserva
                </h5>

                <form onSubmit={handleSubmit}>

                  {/* Paso 1: Cancha */}
                  <div className="mb-3">
                    <label className="form-label fw-semibold">
                      <span className="badge bg-success me-2">1</span>Cancha
                    </label>
                    {loadingCanchas ? (
                      <div className="text-muted small">
                        <span className="spinner-border spinner-border-sm me-2"></span>Cargando...
                      </div>
                    ) : (
                      <select className="form-select form-select-lg" value={canchaId}
                        onChange={(e) => { setCanchaId(e.target.value); setHoraInicio('') }} required>
                        <option value="">Seleccioná una cancha</option>
                        {canchas.map((c) => (
                          <option key={c._id} value={c._id}>
                            {c.nombre} — {c.tipo === 'futbol5' ? 'Fútbol 5' : 'Fútbol 7'} (${c.precio?.toLocaleString()}/h)
                          </option>
                        ))}
                      </select>
                    )}
                    {canchaSeleccionada?.descripcion && (
                      <div className="mt-2 px-2 py-1 bg-light rounded small text-muted">
                        <i className="bi bi-geo-alt-fill text-success me-1"></i>
                        {canchaSeleccionada.descripcion}
                      </div>
                    )}
                  </div>

                  {/* Paso 2: Fecha */}
                  <div className="mb-3">
                    <label className="form-label fw-semibold">
                      <span className="badge bg-success me-2">2</span>Fecha
                    </label>
                    <input type="date" className="form-control form-control-lg" min={hoy}
                      value={fecha} onChange={(e) => { setFecha(e.target.value); setHoraInicio('') }} required />
                  </div>

                  {/* Paso 3: Duración */}
                  <div className="mb-3">
                    <label className="form-label fw-semibold">
                      <span className="badge bg-success me-2">3</span>Duración del turno
                    </label>
                    <div className="d-flex gap-2">
                      {DURACIONES.map((d) => (
                        <button key={d} type="button"
                          className={`btn flex-fill ${duracion === d ? 'btn-success' : 'btn-outline-secondary'}`}
                          onClick={() => { setDuracion(d); setHoraInicio('') }}>
                          {d}h
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Paso 4: Horario */}
                  <div className="mb-4">
                    <label className="form-label fw-semibold">
                      <span className="badge bg-success me-2">4</span>Horario de inicio
                    </label>

                    {!canchaId || !fecha ? (
                      <div className="alert alert-light border text-muted small text-center py-3">
                        <i className="bi bi-arrow-up-circle me-1"></i>
                        Seleccioná una cancha y una fecha
                      </div>
                    ) : loadingDisp ? (
                      <div className="text-center py-3">
                        <div className="spinner-border spinner-border-sm text-success me-2"></div>
                        <span className="text-muted small">Cargando disponibilidad...</span>
                      </div>
                    ) : disponibilidad ? (
                      <>
                        <div className="d-flex flex-wrap gap-3 mb-2">
                          {[
                            { color: 'success', label: 'Disponible' },
                            { color: 'danger',  label: 'Ocupado' },
                            { color: 'secondary', label: `No alcanza ${duracion}h` },
                          ].map(({ color, label }) => (
                            <span key={label} className="d-flex align-items-center gap-1 small">
                              <span className={`badge bg-${color}`}>&nbsp;</span>{label}
                            </span>
                          ))}
                        </div>
                        <div className="d-flex flex-wrap gap-2">
                          {todosLosSlots.map((slot) => {
                            const estado = getSlotEstado(slot)
                            const finSlot = `${String(parseInt(slot) + duracion).padStart(2, '0')}:00`
                            const clases = {
                              seleccionado: 'btn btn-success btn-sm',
                              disponible:   'btn btn-outline-success btn-sm',
                              ocupado:      'btn btn-danger btn-sm',
                              'no-aplica':  'btn btn-outline-secondary btn-sm',
                              'sin-datos':  'btn btn-outline-secondary btn-sm',
                            }
                            return (
                              <button key={slot} type="button"
                                className={clases[estado]}
                                style={{ minWidth: 64 }}
                                disabled={estado === 'ocupado' || estado === 'no-aplica' || estado === 'sin-datos'}
                                title={estado === 'disponible' ? `Reservar ${slot}–${finSlot}` : estado === 'ocupado' ? 'Ocupado' : `Sin ${duracion}h consecutivas`}
                                onClick={() => setHoraInicio(slot === horaInicio ? '' : slot)}>
                                {slot}
                                {estado === 'seleccionado' && <i className="bi bi-check-lg ms-1"></i>}
                              </button>
                            )
                          })}
                        </div>
                        {horaInicio && (
                          <div className="alert alert-success py-2 mt-3 small d-flex justify-content-between">
                            <span>
                              <i className="bi bi-clock-fill me-2"></i>
                              <strong>{horaInicio} – {horaFin} hs</strong>
                            </span>
                            {canchaSeleccionada && (
                              <strong>${(canchaSeleccionada.precio * duracion).toLocaleString()}</strong>
                            )}
                          </div>
                        )}
                      </>
                    ) : null}
                  </div>

                  {/* Info pago */}
                  <div className="alert alert-light border small py-2 mb-3 d-flex gap-2 align-items-center">
                    <i className="bi bi-bank text-success flex-shrink-0"></i>
                    <span>El pago se realiza por <strong>transferencia bancaria</strong> tras confirmar la reserva.</span>
                  </div>

                  <button type="submit" className="btn btn-success w-100 btn-lg fw-bold"
                    disabled={submitting || !horaInicio}>
                    {submitting
                      ? <><span className="spinner-border spinner-border-sm me-2"></span>Reservando...</>
                      : <><i className="bi bi-calendar-plus me-2"></i>Confirmar reserva</>}
                  </button>
                </form>
              </div>
            </div>
          </div>

          {/* ══════════ COLUMNA DERECHA ══════════ */}
          <div className="col-lg-7">

            {/* Selector visual canchas */}
            <h5 className="fw-bold mb-3">
              <i className="bi bi-grid me-2 text-success"></i>Canchas disponibles
            </h5>
            {loadingCanchas ? (
              <div className="text-center py-4"><div className="spinner-border text-success"></div></div>
            ) : canchas.length === 0 ? (
              <div className="text-center py-4 text-muted">
                <i className="bi bi-emoji-frown" style={{ fontSize: 40 }}></i>
                <p className="mt-2">No hay canchas disponibles</p>
              </div>
            ) : (
              <div className="row g-3 mb-5">
                {canchas.map((c) => {
                  const sel = canchaId === c._id
                  return (
                    <div className="col-12 col-sm-6 col-md-4" key={c._id}>
                      <div role="button"
                        onClick={() => { setCanchaId(c._id); setHoraInicio('') }}
                        className={`card h-100 shadow-sm border-2 ${sel ? 'border-success' : 'border-0'}`}
                        style={{ cursor: 'pointer', transition: 'border-color .15s' }}>
                        {c.imagen ? (
                          <img src={c.imagen} alt={c.nombre} className="card-img-top" style={{ height: 100, objectFit: 'cover' }} />
                        ) : (
                          <div className="bg-success d-flex align-items-center justify-content-center" style={{ height: 100 }}>
                            <i className="bi bi-dribbble text-white" style={{ fontSize: 36 }}></i>
                          </div>
                        )}
                        <div className="card-body p-3">
                          <div className="d-flex justify-content-between align-items-start">
                            <h6 className="card-title mb-1">{c.nombre}</h6>
                            {sel && <i className="bi bi-check-circle-fill text-success"></i>}
                          </div>
                          <p className="text-muted small mb-1">{c.tipo === 'futbol5' ? 'Fútbol 5' : 'Fútbol 7'}</p>
                          <p className="fw-bold text-success mb-0">${c.precio?.toLocaleString()}/h</p>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}

            {/* Mis reservas */}
            <h5 className="fw-bold mb-3">
              <i className="bi bi-clock-history me-2 text-success"></i>Mis reservas
            </h5>

            {loadingReservas ? (
              <div className="text-center py-3">
                <div className="spinner-border spinner-border-sm text-success"></div>
              </div>
            ) : misReservas.length === 0 ? (
              <div className="text-center py-4 text-muted">
                <i className="bi bi-calendar-x" style={{ fontSize: 40 }}></i>
                <p className="mt-2 small">Todavía no tenés reservas</p>
              </div>
            ) : (
              <div className="d-flex flex-column gap-3">
                {misReservas.map((r) => (
                  <div key={r._id} className={`card border-0 shadow-sm border-start border-4 border-${
                    r.estadoPago === 'confirmado' ? 'success' :
                    r.estadoPago === 'cancelado'  ? 'danger'  : 'warning'
                  }`}>
                    <div className="card-body p-3">
                      <div className="d-flex justify-content-between align-items-start flex-wrap gap-2">
                        <div>
                          <div className="d-flex align-items-center gap-2 mb-1 flex-wrap">
                            <p className="fw-semibold mb-0">
                              <i className="bi bi-dribbble text-success me-1"></i>
                              {r.canchaId?.nombre || 'Cancha'}
                            </p>
                            <EstadoPagoBadge estado={r.estadoPago} />
                          </div>
                          <p className="text-muted small mb-1">
                            <i className="bi bi-calendar3 me-1"></i>{formatFecha(r.fecha)}
                          </p>
                          <p className="text-muted small mb-0">
                            <i className="bi bi-clock me-1"></i>
                            {r.horaInicio} – {r.horaFin} hs
                            <span className="ms-2 text-success fw-semibold">
                              ({parseInt(r.horaFin) - parseInt(r.horaInicio)}h
                              {r.canchaId?.precio && (
                                <> · ${(r.canchaId.precio * (parseInt(r.horaFin) - parseInt(r.horaInicio))).toLocaleString()}</>
                              )})
                            </span>
                          </p>
                          {r.googleEventId && (
                            <span className="badge bg-light text-success border border-success mt-2 small">
                              <i className="bi bi-google me-1"></i>En Calendar
                            </span>
                          )}
                        </div>

                        <div className="d-flex flex-column gap-2 align-items-end">
                          {/* Botón ver instrucciones si está pendiente */}
                          {r.estadoPago === 'pendiente' && (
                            <button
                              className="btn btn-outline-success btn-sm"
                              onClick={() => {
                                setReservaCreada({
                                  _id:        r._id,
                                  cancha:     r.canchaId?.nombre,
                                  fecha:      r.fecha,
                                  horaInicio: r.horaInicio,
                                  horaFin:    r.horaFin,
                                  precio:     r.canchaId?.precio || 0,
                                  estadoPago: r.estadoPago,
                                })
                                setMostrarInstruc(true)
                                window.scrollTo({ top: 0, behavior: 'smooth' })
                              }}
                            >
                              <i className="bi bi-bank me-1"></i>Ver pago
                            </button>
                          )}
                          <button
                            className="btn btn-outline-danger btn-sm"
                            onClick={() => handleEliminar(r._id)}
                            title="Cancelar reserva"
                          >
                            <i className="bi bi-trash"></i>
                          </button>
                        </div>
                      </div>

                      {/* Aviso pendiente */}
                      {r.estadoPago === 'pendiente' && (
                        <div className="alert alert-warning py-1 px-2 mt-2 mb-0 small d-flex align-items-center gap-2">
                          <i className="bi bi-exclamation-triangle-fill flex-shrink-0"></i>
                          <span>Reserva pendiente de pago. Realizá la transferencia y enviá el comprobante.</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  )
}

export default Reservas
