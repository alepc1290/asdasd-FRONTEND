import React from 'react'
import { useEffect, useState, useCallback } from 'react'
import { useLocation } from 'react-router'
import { toast } from 'sonner'
import { Calendar, Clock, Trash2, CreditCard, CheckCircle, ChevronRight } from 'lucide-react'
import {
  getCanchas, createReserva, getReservas,
  deleteReserva, getDisponibilidad,
} from '../services/api'
import { useAuth } from '../context/AuthContext'
import InstruccionesPago, { EstadoPagoBadge } from '../components/InstruccionesPago'

const DURACIONES = [1, 2, 3]

function Reservas() {
  const { auth } = useAuth()
  const location = useLocation()
  const [canchas, setCanchas] = useState([])
  const [misReservas, setMisReservas] = useState([])
  const [loadingCanchas, setLoadingCanchas] = useState(true)
  const [loadingReservas, setLoadingReservas] = useState(true)
  const [canchaId, setCanchaId] = useState(location.state?.canchaId || '')
  const [fecha, setFecha] = useState('')
  const [duracion, setDuracion] = useState(1)
  const [horaInicio, setHoraInicio] = useState('')
  const [disponibilidad, setDisponibilidad] = useState(null)
  const [loadingDisp, setLoadingDisp] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [reservaCreada, setReservaCreada] = useState(null)
  const [mostrarInstruc, setMostrarInstruc] = useState(false)

  const hoy = new Date().toISOString().split('T')[0]
  const canchaSeleccionada = canchas.find((c) => c._id === canchaId)

  useEffect(() => {
    getCanchas()
      .then((res) => setCanchas(res.data.data.filter((c) => c.estado === 'disponible')))
      .catch(console.error)
      .finally(() => setLoadingCanchas(false))
    fetchMisReservas()
  }, [])

  useEffect(() => {
    setHoraInicio(''); setReservaCreada(null); setMostrarInstruc(false)
    if (!canchaId || !fecha) { setDisponibilidad(null); return }
    setLoadingDisp(true)
    getDisponibilidad(canchaId, fecha)
      .then((res) => setDisponibilidad(res.data.data))
      .catch((err) => { toast.error('No se pudo cargar la disponibilidad'); setDisponibilidad(null) })
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
    if (!canchaId || !fecha || !horaInicio) { toast.error('Seleccioná cancha, fecha y horario'); return }
    setSubmitting(true)
    try {
      const res = await createReserva({ canchaId, fecha, horaInicio, horaFin })
      const nueva = res.data.data
      setReservaCreada({
        _id: nueva._id,
        cancha: canchaSeleccionada?.nombre,
        fecha, horaInicio, horaFin,
        precio: canchaSeleccionada?.precio || 0,
        estadoPago: nueva.estadoPago,
        tieneCalendar: !!nueva.googleEventId,
      })
      setMostrarInstruc(true)
      toast.success('¡Reserva creada! Realizá la transferencia para confirmarla.')
      setHoraInicio(''); setFecha(''); setCanchaId(''); setDisponibilidad(null)
      fetchMisReservas()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error al crear la reserva')
    } finally { setSubmitting(false) }
  }

  const handleEliminar = async (id) => {
    if (!confirm('¿Cancelar esta reserva?')) return
    try {
      await deleteReserva(id)
      toast.success('Reserva cancelada')
      fetchMisReservas()
    } catch (err) { toast.error(err.response?.data?.message || 'Error al eliminar') }
  }

  const formatFecha = (f) =>
    new Date(f + 'T12:00:00').toLocaleDateString('es-AR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })

  const todosLosSlots = Array.from({ length: 15 }, (_, i) => `${String(i + 8).padStart(2, '0')}:00`)

  const getSlotEstado = (slot) => {
    if (!disponibilidad) return 'sin-datos'
    if (slot === horaInicio) return 'seleccionado'
    if (disponibilidad.horariosOcupados.includes(slot)) return 'ocupado'
    if (!slotEsSeleccionable(slot)) return 'no-aplica'
    return 'disponible'
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-16">

      <div className="mb-10">
        <p className="section-label mb-2">Paso a paso</p>
        <h1 className="section-title text-5xl md:text-6xl">Reservar cancha</h1>
        <p className="text-carbon-300 mt-3 text-sm">Elegí cancha, fecha y horario — pagás por transferencia</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">

        {/* ── COLUMNA FORMULARIO ── */}
        <div className="lg:col-span-2 space-y-6">

          {/* Instrucciones de pago */}
          {mostrarInstruc && reservaCreada && (
            <InstruccionesPago reserva={reservaCreada} onClose={() => setMostrarInstruc(false)} />
          )}

          {/* Formulario */}
          <div className="bg-carbon-800 border border-carbon-600 p-6 sticky top-20">
            <h2 className="font-display font-bold text-white uppercase tracking-wide text-sm mb-6 flex items-center gap-2">
              <Calendar size={16} className="text-verde-500" /> Nueva reserva
            </h2>

            <form onSubmit={handleSubmit} className="space-y-5">

              {/* Paso 1 */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="font-mono text-verde-500 text-xs bg-verde-500/10 border border-verde-700 px-2 py-1">01</span>
                  <span className="font-display font-bold text-white uppercase tracking-wide text-xs">Cancha</span>
                </div>
                {loadingCanchas ? (
                  <div className="flex items-center gap-2 text-carbon-400 text-sm">
                    <div className="w-4 h-4 border-2 border-carbon-600 border-t-verde-500 rounded-full animate-spin" />
                    Cargando...
                  </div>
                ) : (
                  <select
                    className="input-field"
                    value={canchaId}
                    onChange={(e) => { setCanchaId(e.target.value); setHoraInicio('') }}
                    required
                  >
                    <option value="">— Elegí una cancha —</option>
                    {canchas.map((c) => (
                      <option key={c._id} value={c._id}>
                        {c.nombre} ({c.tipo === 'futbol5' ? 'F5' : 'F7'}) — ${c.precio?.toLocaleString()}/h
                      </option>
                    ))}
                  </select>
                )}
                {canchaSeleccionada?.descripcion && (
                  <p className="text-carbon-400 text-xs mt-2 pl-1">{canchaSeleccionada.descripcion}</p>
                )}
              </div>

              {/* Paso 2 */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="font-mono text-verde-500 text-xs bg-verde-500/10 border border-verde-700 px-2 py-1">02</span>
                  <span className="font-display font-bold text-white uppercase tracking-wide text-xs">Fecha</span>
                </div>
                <input
                  type="date"
                  className="input-field [color-scheme:dark]"
                  min={hoy}
                  value={fecha}
                  onChange={(e) => { setFecha(e.target.value); setHoraInicio('') }}
                  required
                />
              </div>

              {/* Paso 3 */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="font-mono text-verde-500 text-xs bg-verde-500/10 border border-verde-700 px-2 py-1">03</span>
                  <span className="font-display font-bold text-white uppercase tracking-wide text-xs">Duración</span>
                </div>
                <div className="flex gap-2">
                  {DURACIONES.map((d) => (
                    <button
                      key={d} type="button"
                      onClick={() => { setDuracion(d); setHoraInicio('') }}
                      className={`flex-1 py-2 text-sm font-display font-bold uppercase tracking-wider transition-all ${duracion === d
                          ? 'bg-verde-500 text-carbon-900'
                          : 'bg-carbon-700 border border-carbon-500 text-carbon-300 hover:border-verde-600 hover:text-white'
                        }`}
                    >
                      {d}h
                    </button>
                  ))}
                </div>
              </div>

              {/* Paso 4 */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="font-mono text-verde-500 text-xs bg-verde-500/10 border border-verde-700 px-2 py-1">04</span>
                  <span className="font-display font-bold text-white uppercase tracking-wide text-xs">Horario</span>
                </div>

                {!canchaId || !fecha ? (
                  <p className="text-carbon-500 text-xs italic">Primero seleccioná cancha y fecha</p>
                ) : loadingDisp ? (
                  <div className="flex items-center gap-2 text-carbon-400 text-sm">
                    <div className="w-4 h-4 border-2 border-carbon-600 border-t-verde-500 rounded-full animate-spin" />
                    Cargando disponibilidad...
                  </div>
                ) : disponibilidad ? (
                  <>
                    {/* Leyenda */}
                    <div className="flex gap-3 mb-3 flex-wrap">
                      {[
                        { color: 'bg-verde-500', label: 'Libre' },
                        { color: 'bg-red-700', label: 'Ocupado' },
                        { color: 'bg-carbon-600', label: `No alcanza ${duracion}h` },
                      ].map(({ color, label }) => (
                        <span key={label} className="flex items-center gap-1.5 text-xs text-carbon-400">
                          <span className={`w-2.5 h-2.5 ${color}`} />{label}
                        </span>
                      ))}
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                      {todosLosSlots.map((slot) => {
                        const estado = getSlotEstado(slot)
                        const styles = {
                          seleccionado: 'bg-verde-500 text-carbon-900 font-bold',
                          disponible: 'bg-carbon-700 border border-carbon-500 text-carbon-300 hover:border-verde-500 hover:text-verde-400 cursor-pointer',
                          ocupado: 'bg-red-900/40 border border-red-900 text-red-600 cursor-not-allowed',
                          'no-aplica': 'bg-carbon-800 border border-carbon-600 text-carbon-500 cursor-not-allowed',
                          'sin-datos': 'bg-carbon-800 border border-carbon-600 text-carbon-500 cursor-not-allowed',
                        }
                        return (
                          <button
                            key={slot} type="button"
                            className={`px-2.5 py-1.5 font-mono text-xs transition-all ${styles[estado]}`}
                            disabled={['ocupado', 'no-aplica', 'sin-datos'].includes(estado)}
                            onClick={() => setHoraInicio(slot === horaInicio ? '' : slot)}
                          >
                            {slot}
                            {estado === 'seleccionado' && ' ✓'}
                          </button>
                        )
                      })}
                    </div>

                    {horaInicio && (
                      <div className="mt-3 bg-verde-500/10 border border-verde-700 px-4 py-2 flex justify-between items-center">
                        <span className="text-verde-400 text-sm font-mono">
                          {horaInicio} – {horaFin} hs
                        </span>
                        {canchaSeleccionada && (
                          <span className="font-display font-black text-verde-400 text-lg">
                            ${(canchaSeleccionada.precio * duracion).toLocaleString()}
                          </span>
                        )}
                      </div>
                    )}
                  </>
                ) : null}
              </div>

              {/* Info pago */}
              <div className="bg-carbon-700 border border-carbon-500 px-4 py-3 flex gap-2 items-center">
                <CreditCard size={14} className="text-verde-500 flex-shrink-0" />
                <span className="text-carbon-300 text-xs">El pago se realiza por <strong className="text-white">transferencia bancaria</strong> tras confirmar.</span>
              </div>

              <button
                type="submit"
                className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
                disabled={submitting || !horaInicio}
              >
                {submitting
                  ? <><div className="w-4 h-4 border-2 border-carbon-900/40 border-t-carbon-900 rounded-full animate-spin" /> Reservando...</>
                  : <><CheckCircle size={16} /> Confirmar reserva</>
                }
              </button>
            </form>
          </div>
        </div>

        {/* ── COLUMNA DERECHA ── */}
        <div className="lg:col-span-3 space-y-8">

          {/* Canchas */}
          <div>
            <h2 className="font-display font-bold text-white uppercase tracking-wide text-sm mb-4 flex items-center gap-2">
              <ChevronRight size={14} className="text-verde-500" /> Canchas disponibles
            </h2>
            {loadingCanchas ? (
              <div className="flex items-center justify-center py-12">
                <div className="w-8 h-8 border-2 border-carbon-600 border-t-verde-500 rounded-full animate-spin" />
              </div>
            ) : canchas.length === 0 ? (
              <p className="text-carbon-400 text-sm">No hay canchas disponibles.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {canchas.map((c) => {
                  const sel = canchaId === c._id
                  return (
                    <button
                      key={c._id} type="button"
                      onClick={() => { setCanchaId(c._id); setHoraInicio('') }}
                      className={`text-left bg-carbon-800 border transition-all duration-200 overflow-hidden group ${sel ? 'border-verde-500' : 'border-carbon-600 hover:border-verde-700'
                        }`}
                    >
                      {c.imagen ? (
                        <img src={c.imagen} alt={c.nombre} className="w-full h-24 object-cover" />
                      ) : (
                        <div className={`w-full h-24 flex items-center justify-center ${sel ? 'bg-verde-500/20' : 'bg-carbon-700'}`}>
                          <span className="font-display font-black text-verde-500/50 text-2xl uppercase">
                            {c.tipo === 'futbol5' ? 'F5' : 'F7'}
                          </span>
                        </div>
                      )}
                      <div className="p-3">
                        <div className="flex justify-between items-start">
                          <h3 className="font-display font-bold text-white text-sm uppercase tracking-wide">{c.nombre}</h3>
                          {sel && <CheckCircle size={14} className="text-verde-400 flex-shrink-0" />}
                        </div>
                        <p className="text-carbon-400 text-xs">{c.tipo === 'futbol5' ? 'Fútbol 5' : 'Fútbol 7'}</p>
                        <p className="font-display font-black text-verde-400 text-lg mt-1">${c.precio?.toLocaleString()}/h</p>
                      </div>
                    </button>
                  )
                })}
              </div>
            )}
          </div>

          {/* Mis reservas */}
          <div>
            <h2 className="font-display font-bold text-white uppercase tracking-wide text-sm mb-4 flex items-center gap-2">
              <Clock size={14} className="text-verde-500" /> Mis reservas
            </h2>

            {loadingReservas ? (
              <div className="flex items-center justify-center py-12">
                <div className="w-8 h-8 border-2 border-carbon-600 border-t-verde-500 rounded-full animate-spin" />
              </div>
            ) : misReservas.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 gap-3 text-center bg-carbon-800 border border-carbon-600">
                <Calendar size={28} className="text-carbon-500" />
                <p className="font-display font-bold text-white text-sm uppercase tracking-wide">Sin reservas</p>
                <p className="text-carbon-400 text-xs">Todavía no tenés reservas registradas</p>
              </div>
            ) : (
              <div className="space-y-3">
                {misReservas.map((r) => (
                  <div
                    key={r._id}
                    className={`bg-carbon-800 border-l-4 border border-carbon-600 ${r.estadoPago === 'confirmado' ? 'border-l-verde-500' :
                        r.estadoPago === 'cancelado' ? 'border-l-red-600' : 'border-l-yellow-500'
                      }`}
                  >
                    <div className="p-4">
                      <div className="flex justify-between items-start flex-wrap gap-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 flex-wrap mb-2">
                            <span className="font-display font-bold text-white uppercase tracking-wide text-sm">
                              {r.canchaId?.nombre || 'Cancha'}
                            </span>
                            <EstadoPagoBadge estado={r.estadoPago} />
                            {r.googleEventId && (
                              <span className="badge-success text-xs">
                                <svg width="10" height="10" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="inline">
                                  <path fill="#4285F4" d="M24 9.5c3.14 0 5.95 1.08 8.17 2.85l6.1-6.1C34.46 3.09 29.5 1 24 1 14.82 1 7.07 6.48 3.6 14.26l7.1 5.52C12.43 13.48 17.75 9.5 24 9.5z" />
                                </svg>
                                {' '}Calendar
                              </span>
                            )}
                          </div>
                          <p className="text-carbon-400 text-xs font-mono mb-1">
                            <Calendar size={10} className="inline mr-1" />{formatFecha(r.fecha)}
                          </p>
                          <p className="text-carbon-400 text-xs font-mono">
                            <Clock size={10} className="inline mr-1" />{r.horaInicio} – {r.horaFin} hs
                            {r.canchaId?.precio && (
                              <span className="text-verde-400 ml-2 font-bold">
                                ${(r.canchaId.precio * (parseInt(r.horaFin) - parseInt(r.horaInicio))).toLocaleString()}
                              </span>
                            )}
                          </p>
                        </div>

                        <div className="flex flex-col gap-2 items-end">
                          {r.estadoPago === 'pendiente' && (
                            <button
                              className="btn-outline text-xs py-1.5 px-3 flex items-center gap-1"
                              onClick={() => {
                                setReservaCreada({
                                  _id: r._id, cancha: r.canchaId?.nombre,
                                  fecha: r.fecha, horaInicio: r.horaInicio, horaFin: r.horaFin,
                                  precio: r.canchaId?.precio || 0, estadoPago: r.estadoPago,
                                })
                                setMostrarInstruc(true)
                                window.scrollTo({ top: 0, behavior: 'smooth' })
                              }}
                            >
                              <CreditCard size={12} /> Ver pago
                            </button>
                          )}
                          <button
                            className="btn-danger flex items-center gap-1"
                            onClick={() => handleEliminar(r._id)}
                            title="Cancelar reserva"
                          >
                            <Trash2 size={12} /> Cancelar
                          </button>
                        </div>
                      </div>

                      {r.estadoPago === 'pendiente' && (
                        <div className="mt-3 border border-yellow-900 bg-yellow-900/20 px-3 py-2 text-yellow-400 text-xs font-mono">
                          ⚠ Reserva pendiente de pago. Realizá la transferencia y enviá el comprobante.
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