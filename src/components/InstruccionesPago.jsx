import { useEffect, useState } from 'react'
import { getDatosTransferencia } from '../services/api'

const ESTADO_CONFIG = {
  pendiente: { color: 'warning', icon: 'bi-clock-fill', label: 'Pago pendiente' },
  confirmado: { color: 'success', icon: 'bi-check-circle-fill', label: 'Pago confirmado' },
  cancelado: { color: 'danger', icon: 'bi-x-circle-fill', label: 'Cancelado' },
}

// Badge de estado reutilizable
export function EstadoPagoBadge({ estado }) {
  const cfg = ESTADO_CONFIG[estado] || ESTADO_CONFIG.pendiente
  return (
    <span className={`badge bg-${cfg.color} d-inline-flex align-items-center gap-1`}>
      <i className={`bi ${cfg.icon}`} style={{ fontSize: 11 }}></i>
      {cfg.label}
    </span>
  )
}

// Panel completo de instrucciones (se muestra tras crear una reserva)
function InstruccionesPago({ reserva, onClose }) {
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
    ? `$${(reserva.precio * (parseInt(reserva.horaFin) - parseInt(reserva.horaInicio))).toLocaleString()}`
    : ''

  if (loading) {
    return (
      <div className="text-center py-4">
        <div className="spinner-border spinner-border-sm text-success"></div>
      </div>
    )
  }

  return (
    <div className="card border-success border-2 shadow">
      {/* Header */}
      <div className="card-header bg-success text-white d-flex justify-content-between align-items-center">
        <span className="fw-bold">
          <i className="bi bi-bank me-2"></i>
          Instrucciones de pago
        </span>
        {onClose && (
          <button className="btn btn-sm btn-outline-light py-0" onClick={onClose}>
            <i className="bi bi-x-lg"></i>
          </button>
        )}
      </div>

      <div className="card-body p-4">
        {/* Resumen reserva */}
        {reserva && (
          <div className="alert alert-success border-0 py-2 mb-4 small">
            <i className="bi bi-calendar-check me-2"></i>
            <strong>{reserva.cancha}</strong> — {reserva.fecha} · {reserva.horaInicio}–{reserva.horaFin} hs
            <span className="ms-2 fw-bold">{totalPago}</span>
          </div>
        )}

        {/* Paso a paso */}
        <p className="fw-semibold mb-3">
          <i className="bi bi-info-circle text-success me-2"></i>
          Para confirmar tu reserva, realizá una transferencia bancaria:
        </p>

        {datos && (
          <div className="d-flex flex-column gap-3 mb-4">
            {/* CBU */}
            <div className="d-flex justify-content-between align-items-center p-3 bg-light rounded">
              <div>
                <div className="text-muted small mb-1">CBU</div>
                <div className="fw-bold font-monospace">123124124123123</div>
              </div>
              <button
                className={`btn btn-sm ${copiado === 'cbu' ? 'btn-success' : 'btn-outline-secondary'}`}
                onClick={() => copiar(datos.cbu, 'cbu')}
              >
                {copiado === 'cbu'
                  ? <><i className="bi bi-check-lg me-1"></i>Copiado</>
                  : <><i className="bi bi-clipboard me-1"></i>Copiar</>
                }
              </button>
            </div>

            {/* Alias */}
            <div className="d-flex justify-content-between align-items-center p-3 bg-light rounded">
              <div>
                <div className="text-muted small mb-1">Alias</div>
                <div className="fw-bold">{datos.alias}</div>
              </div>
              <button
                className={`btn btn-sm ${copiado === 'alias' ? 'btn-success' : 'btn-outline-secondary'}`}
                onClick={() => copiar(datos.alias, 'alias')}
              >
                {copiado === 'alias'
                  ? <><i className="bi bi-check-lg me-1"></i>Copiado</>
                  : <><i className="bi bi-clipboard me-1"></i>Copiar</>
                }
              </button>
            </div>

            {/* Titular y banco */}
            <div className="row g-3">
              <div className="col-6">
                <div className="p-3 bg-light rounded h-100">
                  <div className="text-muted small mb-1">Titular</div>
                  <div className="fw-semibold small">{datos.titular}</div>
                </div>
              </div>
              <div className="col-6">
                <div className="p-3 bg-light rounded h-100">
                  <div className="text-muted small mb-1">Banco</div>
                  <div className="fw-semibold small">{datos.banco}</div>
                </div>
              </div>
            </div>

            {/* Monto */}
            {reserva && (
              <div className="d-flex justify-content-between align-items-center p-3 border border-success rounded">
                <div>
                  <div className="text-muted small mb-1">Monto a transferir</div>
                  <div className="fw-bold text-success fs-5">{totalPago}</div>
                </div>
                <button
                  className={`btn btn-sm ${copiado === 'monto' ? 'btn-success' : 'btn-outline-success'}`}
                  onClick={() => copiar(totalPago.replace('$', '').replace('.', ''), 'monto')}
                >
                  {copiado === 'monto'
                    ? <><i className="bi bi-check-lg me-1"></i>Copiado</>
                    : <><i className="bi bi-clipboard me-1"></i>Copiar</>
                  }
                </button>
              </div>
            )}
          </div>
        )}

        {/* Pasos */}
        <div className="border rounded p-3 mb-4">
          <p className="fw-semibold small mb-2">
            <i className="bi bi-list-ol me-2 text-success"></i>Pasos a seguir
          </p>
          <ol className="mb-0 ps-3 small text-muted">
            <li className="mb-1">Realizá la transferencia por el monto exacto</li>
            <li className="mb-1">Guardá el comprobante</li>
            <li className="mb-1">Envialo por WhatsApp para confirmar</li>
            <li>El admin confirmará tu pago y la reserva quedará activa</li>
          </ol>
        </div>

        {/* WhatsApp CTA */}
        {datos?.whatsapp && (
          <a
            href={`https://wa.me/5493812155521?text=${encodeURIComponent(
              reserva
                ? `Hola! Acabo de hacer una reserva:\n• Cancha: ${reserva.cancha}\n• Fecha: ${reserva.fecha}\n• Horario: ${reserva.horaInicio}–${reserva.horaFin} hs\n• Monto: ${totalPago}\nAdjunto comprobante de transferencia.`
                : 'Hola! Quiero confirmar el pago de mi reserva. Adjunto comprobante.'
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-success w-100 fw-bold"
          >
            <i className="bi bi-whatsapp me-2"></i>
            Enviar comprobante por WhatsApp
          </a>
        )}
      </div>
    </div>
  )
}

export default InstruccionesPago
