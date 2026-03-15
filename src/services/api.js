import { axiosClient } from '../helpers/axiosClient'

// ─── AUTH ────────────────────────────────────────────────────────────────────
export const registerUser   = (data)  => axiosClient.post('/auth/register', data)
export const loginUser      = (data)  => axiosClient.post('/auth/login', data)
export const verificarEmail = (token) => axiosClient.get('/auth/verify-email', { params: { token } })

// ─── CANCHAS ─────────────────────────────────────────────────────────────────
export const getCanchas    = ()         => axiosClient.get('/canchas')
export const getCancha     = (id)       => axiosClient.get(`/canchas/${id}`)
export const createCancha  = (data)     => axiosClient.post('/canchas', data)
export const updateCancha  = (id, data) => axiosClient.put(`/canchas/${id}`, data)
export const deleteCancha  = (id)       => axiosClient.delete(`/canchas/${id}`)

// ─── PRODUCTOS ────────────────────────────────────────────────────────────────
export const getProductos   = ()         => axiosClient.get('/productos')
export const getProducto    = (id)       => axiosClient.get(`/productos/${id}`)
export const createProducto = (data)     => axiosClient.post('/productos', data)
export const updateProducto = (id, data) => axiosClient.put(`/productos/${id}`, data)
export const deleteProducto = (id)       => axiosClient.delete(`/productos/${id}`)

// ─── RESERVAS ────────────────────────────────────────────────────────────────
export const getReservas           = ()                => axiosClient.get('/reservas')
export const getReserva            = (id)              => axiosClient.get(`/reservas/${id}`)
export const createReserva         = (data)            => axiosClient.post('/reservas', data)
export const deleteReserva         = (id)              => axiosClient.delete(`/reservas/${id}`)
export const getDisponibilidad     = (canchaId, fecha) => axiosClient.get('/reservas/disponibilidad', { params: { canchaId, fecha } })
export const getReservasAdmin      = ()                => axiosClient.get('/reservas/admin')
export const getDatosTransferencia = ()                => axiosClient.get('/reservas/datos-transferencia')
export const confirmarPago         = (id)              => axiosClient.patch(`/reservas/${id}/confirmar-pago`)
export const cancelarPago          = (id)              => axiosClient.patch(`/reservas/${id}/cancelar-pago`)

// ─── USUARIOS (admin) ────────────────────────────────────────────────────────
export const getUsers    = ()   => axiosClient.get('/users')
export const deleteUser  = (id) => axiosClient.delete(`/users/${id}`)
