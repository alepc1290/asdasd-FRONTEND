import { useEffect, useState } from 'react'
import { getDatosTransferencia } from '../services/api'
import { X, Copy, Check, Banknote, Clock, CheckCircle, XCircle } from 'lucide-react'

const ESTADO_CONFIG = {
  pendiente:  { cls: 'badge-warning', icon: Clock,         label: 'Pago pendiente' },
  confirmado: { cls: 'badge-success', icon: CheckCircle,   label: 'Pago confirmado' },
  cancelado:  { cls: 'badge-danger',  icon: XCircle,       label: 'Cancelado' },
}

export function EstadoPagoBadge({ estado }) {
  const cfg = ESTADO_CONFIG[estado] || ESTADO_CONFIG.pendiente
  const Icon = cfg.icon
  return (
    <span className={cfg.cls}>
      <Icon size={10} />
      {cfg.label}
    </span>
  )
}

export default function InstruccionesPago({ reserva, onClose }) {
  const [datos, setDatos] = useState(null)
  const [loading, setLoading] = useState(true)
  const [copiado, setCopiado] = useState('')

  useEffect(() => {
    getDatosTransferencia()
      .then((res) => setDatos(res.data.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const copiar = (texto, campo) => {
    navigator.clipboard.writeText(texto)
    setCopiado(campo)
    setTimeout(() => setCopiado(''), 2000)
  }

  const totalPago = reserva
    ? `$${(reserva.precio * (parseInt(reserva.horaFin) - parseInt(reserva.horaInicio))).toLocaleString('es-AR')}`
    : ''

  if (loading) {
    return (
      <div className="bg-carbon-800 border border-carbon-600 p-6 flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-carbon-600 border-t-verde-500 rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="bg-carbon-800 border border-verde-700 overflow-hidden">
      {/* Header */}
      <div className="bg-verde-600 px-5 py-3 flex justify-between items-center">
        <span className="font-display font-bold text-carbon-900 uppercase tracking-widest text-sm flex items-center gap-2">
          <Banknote size={16} /> Instrucciones de pago
        </span>
        {onClose && (
          <button onClick={onClose} className="text-carbon-900/70 hover:text-carbon-900 transition-colors">
            <X size={18} />
          </button>
        )}
      </div>

      <div className="p-5 space-y-4">
        {/* Resumen reserva */}
        <div className="bg-carbon-700 border border-carbon-500 p-4 space-y-1">
          <p className="section-label mb-2">Detalle de la reserva</p>
          <p className="text-white text-sm"><span className="text-carbon-400">Cancha:</span> {reserva?.cancha}</p>
          <p className="text-white text-sm"><span className="text-carbon-400">Fecha:</span> {reserva?.fecha}</p>
          <p className="text-white text-sm"><span className="text-carbon-400">Horario:</span> {reserva?.horaInicio} – {reserva?.horaFin} hs</p>
          <div className="pt-2 border-t border-carbon-500 flex justify-between items-center">
            <span className="font-mono text-xs text-carbon-400 uppercase">Total a transferir</span>
            <span className="font-display font-black text-verde-400 text-2xl">{totalPago}</span>
          </div>
        </div>

        {/* Datos bancarios */}
        {datos && (
          <div className="space-y-3">
            <p className="section-label">Datos bancarios</p>
            {[
              { label: 'Titular', value: datos.titular },
              { label: 'Banco', value: datos.banco },
              { label: 'CBU', value: datos.cbu, copiable: true },
              { label: 'Alias', value: datos.alias, copiable: true },
            ].map(({ label, value, copiable }) => value && (
              <div key={label} className="flex items-center justify-between bg-carbon-700 border border-carbon-500 px-4 py-2">
                <div>
                  <span className="font-mono text-xs text-carbon-400 uppercase block">{label}</span>
                  <span className="text-white text-sm font-mono">{value}</span>
                </div>
                {copiable && (
                  <button onClick={() => copiar(value, label)} className="text-carbon-400 hover:text-verde-400 transition-colors ml-3">
                    {copiado === label ? <Check size={16} className="text-verde-400" /> : <Copy size={16} />}
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

        {datos?.whatsapp && (
          <a
            href={`https://wa.me/${datos.whatsapp}?text=Hola! Realicé la transferencia para mi reserva del ${reserva?.fecha} a las ${reserva?.horaInicio} hs. Adjunto comprobante.`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary w-full text-center block text-xs"
          >
            Enviar comprobante por WhatsApp
          </a>
        )}
      </div>
    </div>
  )
}
