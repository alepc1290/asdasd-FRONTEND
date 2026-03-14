import { useEffect, useState } from 'react'
import { useLocation } from 'react-router'
import { toast } from 'sonner'
import { getCanchas, createReserva, getReservas, deleteReserva } from '../services/api'
import { useAuth } from '../context/AuthContext'
import CanchaCard from '../components/CanchaCard'

const HORARIOS = [
  '08:00','09:00','10:00','11:00','12:00','13:00',
  '14:00','15:00','16:00','17:00','18:00','19:00',
  '20:00','21:00','22:00',
]

function Reservas() {
  const { auth } = useAuth()
  const location = useLocation()

  const [canchas, setCanchas]       = useState([])
  const [misReservas, setMisReservas] = useState([])
  const [loadingCanchas, setLoadingCanchas] = useState(true)
  const [loadingReservas, setLoadingReservas] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [confirmacion, setConfirmacion] = useState(null)

  const [form, setForm] = useState({
    canchaId: location.state?.canchaId || '',
    fecha: '',
    horaInicio: '',
    horaFin: '',
  })

  const hoy = new Date().toISOString().split('T')[0]

  useEffect(() => {
    getCanchas()
      .then((res) => setCanchas(res.data.data.filter((c) => c.estado === 'disponible')))
      .catch(console.error)
      .finally(() => setLoadingCanchas(false))

    fetchMisReservas()
  }, [])

  const fetchMisReservas = () => {
    setLoadingReservas(true)
    getReservas()
      .then((res) => {
        // Filtrar solo las reservas del usuario actual
        const userId = auth?.user?.id
        const mias = res.data.data.filter((r) =>
          (r.userId?._id || r.userId) === userId
        )
        setMisReservas(mias)
      })
      .catch(console.error)
      .finally(() => setLoadingReservas(false))
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => {
      const updated = { ...prev, [name]: value }
      // Reset horaFin si cambia horaInicio
      if (name === 'horaInicio') updated.horaFin = ''
      return updated
    })
  }

  const horaFinOptions = form.horaInicio
    ? HORARIOS.filter((h) => h > form.horaInicio)
    : []

  const canchaSeleccionada = canchas.find((c) => c._id === form.canchaId)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.canchaId || !form.fecha || !form.horaInicio || !form.horaFin) {
      toast.error('Completá todos los campos')
      return
    }
    setSubmitting(true)
    setConfirmacion(null)
    try {
      const res = await createReserva(form)
      const reserva = res.data.data
      setConfirmacion({
        cancha: canchaSeleccionada?.nombre,
        fecha: form.fecha,
        horaInicio: form.horaInicio,
        horaFin: form.horaFin,
        tieneCalendar: !!reserva.googleEventId,
      })
      toast.success('¡Reserva creada exitosamente!')
      setForm({ canchaId: '', fecha: '', horaInicio: '', horaFin: '' })
      fetchMisReservas()
    } catch (err) {
      const msg = err.response?.data?.message || 'Error al crear la reserva'
      toast.error(msg)
    } finally {
      setSubmitting(false)
    }
  }

  const handleEliminar = async (id) => {
    if (!confirm('¿Eliminar esta reserva?')) return
    try {
      await deleteReserva(id)
      toast.success('Reserva eliminada')
      fetchMisReservas()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error al eliminar')
    }
  }

  const formatFecha = (f) =>
    new Date(f + 'T12:00:00').toLocaleDateString('es-AR', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
    })

  return (
    <div className="py-5">
      <div className="container">
        <div className="text-center mb-5">
          <i className="bi bi-calendar-week text-success" style={{ fontSize: 48 }}></i>
          <h1 className="fw-bold mt-2">Reservar cancha</h1>
          <p className="text-muted">Elegí tu cancha, fecha y horario disponible</p>
        </div>

        <div className="row g-5">
          {/* ── Formulario ── */}
          <div className="col-lg-6">
            <div className="card shadow-sm border-0">
              <div className="card-body p-4">
                <h5 className="fw-bold mb-4">
                  <i className="bi bi-pencil-square me-2 text-success"></i>
                  Nueva reserva
                </h5>

                {/* Confirmación */}
                {confirmacion && (
                  <div className="alert alert-success border-0 rounded-3 mb-4" role="alert">
                    <div className="d-flex align-items-start gap-3">
                      <i className="bi bi-check-circle-fill fs-3 mt-1"></i>
                      <div>
                        <h6 className="fw-bold mb-1">¡Reserva confirmada!</h6>
                        <p className="mb-1 small">
                          <strong>{confirmacion.cancha}</strong> — {formatFecha(confirmacion.fecha)}
                        </p>
                        <p className="mb-1 small">
                          <i className="bi bi-clock me-1"></i>
                          {confirmacion.horaInicio} a {confirmacion.horaFin} hs
                        </p>
                        {confirmacion.tieneCalendar && (
                          <p className="mb-0 small">
                            <i className="bi bi-google me-1"></i>
                            Evento agregado a tu Google Calendar
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  {/* Selector de cancha */}
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Cancha</label>
                    {loadingCanchas ? (
                      <div className="text-muted small">Cargando canchas...</div>
                    ) : (
                      <select
                        name="canchaId"
                        className="form-select form-select-lg"
                        value={form.canchaId}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Seleccioná una cancha</option>
                        {canchas.map((c) => (
                          <option key={c._id} value={c._id}>
                            {c.nombre} — {c.tipo === 'futbol5' ? 'Fútbol 5' : 'Fútbol 7'} (${c.precio?.toLocaleString()}/h)
                          </option>
                        ))}
                      </select>
                    )}
                  </div>

                  {/* Preview de cancha seleccionada */}
                  {canchaSeleccionada && (
                    <div className="alert alert-light border rounded-3 py-2 mb-3 small">
                      <i className="bi bi-geo-alt-fill text-success me-1"></i>
                      <strong>{canchaSeleccionada.nombre}</strong> —{' '}
                      {canchaSeleccionada.descripcion || 'Sin descripción'}
                    </div>
                  )}

                  {/* Fecha */}
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Fecha</label>
                    <input
                      type="date"
                      name="fecha"
                      className="form-control form-control-lg"
                      min={hoy}
                      value={form.fecha}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  {/* Horario */}
                  <div className="row g-3 mb-4">
                    <div className="col-6">
                      <label className="form-label fw-semibold">Hora inicio</label>
                      <select
                        name="horaInicio"
                        className="form-select form-select-lg"
                        value={form.horaInicio}
                        onChange={handleChange}
                        required
                      >
                        <option value="">-- Desde --</option>
                        {HORARIOS.slice(0, -1).map((h) => (
                          <option key={h} value={h}>{h} hs</option>
                        ))}
                      </select>
                    </div>
                    <div className="col-6">
                      <label className="form-label fw-semibold">Hora fin</label>
                      <select
                        name="horaFin"
                        className="form-select form-select-lg"
                        value={form.horaFin}
                        onChange={handleChange}
                        disabled={!form.horaInicio}
                        required
                      >
                        <option value="">-- Hasta --</option>
                        {horaFinOptions.map((h) => (
                          <option key={h} value={h}>{h} hs</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Resumen precio */}
                  {canchaSeleccionada && form.horaInicio && form.horaFin && (
                    <div className="alert alert-success py-2 mb-4 small">
                      <i className="bi bi-cash-coin me-2"></i>
                      <strong>Total estimado:</strong>{' '}
                      ${(
                        canchaSeleccionada.precio *
                        (parseInt(form.horaFin) - parseInt(form.horaInicio))
                      ).toLocaleString()}
                    </div>
                  )}

                  <button
                    type="submit"
                    className="btn btn-success w-100 btn-lg fw-bold"
                    disabled={submitting}
                  >
                    {submitting
                      ? <><span className="spinner-border spinner-border-sm me-2"></span>Reservando...</>
                      : <><i className="bi bi-calendar-plus me-2"></i>Confirmar reserva</>
                    }
                  </button>
                </form>
              </div>
            </div>
          </div>

          {/* ── Canchas disponibles ── */}
          <div className="col-lg-6">
            <h5 className="fw-bold mb-3">
              <i className="bi bi-grid me-2 text-success"></i>
              Canchas disponibles
            </h5>
            {loadingCanchas ? (
              <div className="text-center py-4">
                <div className="spinner-border text-success"></div>
              </div>
            ) : canchas.length === 0 ? (
              <div className="text-center py-4 text-muted">
                <i className="bi bi-emoji-frown" style={{ fontSize: 40 }}></i>
                <p className="mt-2">No hay canchas disponibles en este momento</p>
              </div>
            ) : (
              <div className="row g-3">
                {canchas.map((c) => (
                  <div className="col-12 col-sm-6" key={c._id}>
                    <div
                      className={`card h-100 border-2 cursor-pointer ${form.canchaId === c._id ? 'border-success' : 'border-0'} shadow-sm`}
                      style={{ cursor: 'pointer' }}
                      onClick={() => setForm((p) => ({ ...p, canchaId: c._id }))}
                    >
                      <div className="card-body p-3">
                        <div className="d-flex justify-content-between align-items-start mb-1">
                          <h6 className="card-title mb-0">{c.nombre}</h6>
                          {form.canchaId === c._id && (
                            <i className="bi bi-check-circle-fill text-success"></i>
                          )}
                        </div>
                        <p className="text-muted small mb-1">
                          {c.tipo === 'futbol5' ? 'Fútbol 5' : 'Fútbol 7'}
                        </p>
                        <p className="fw-bold text-success mb-0">${c.precio?.toLocaleString()}/h</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Mis reservas */}
            <div className="mt-5">
              <h5 className="fw-bold mb-3">
                <i className="bi bi-clock-history me-2 text-success"></i>
                Mis reservas
              </h5>
              {loadingReservas ? (
                <div className="text-center py-3">
                  <div className="spinner-border spinner-border-sm text-success"></div>
                </div>
              ) : misReservas.length === 0 ? (
                <p className="text-muted small">Todavía no tenés reservas.</p>
              ) : (
                <div className="d-flex flex-column gap-3">
                  {misReservas.map((r) => (
                    <div key={r._id} className="card border-0 shadow-sm">
                      <div className="card-body p-3 d-flex justify-content-between align-items-center">
                        <div>
                          <p className="fw-semibold mb-0">
                            {r.canchaId?.nombre || 'Cancha'}
                          </p>
                          <p className="text-muted small mb-0">
                            <i className="bi bi-calendar3 me-1"></i>
                            {formatFecha(r.fecha)}{' '}
                            <i className="bi bi-clock ms-2 me-1"></i>
                            {r.horaInicio} – {r.horaFin} hs
                          </p>
                          {r.googleEventId && (
                            <span className="badge bg-light text-success border border-success mt-1 small">
                              <i className="bi bi-google me-1"></i>En Calendar
                            </span>
                          )}
                        </div>
                        <button
                          className="btn btn-outline-danger btn-sm"
                          onClick={() => handleEliminar(r._id)}
                          title="Cancelar reserva"
                        >
                          <i className="bi bi-trash"></i>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Reservas
