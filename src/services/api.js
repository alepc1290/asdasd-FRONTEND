import { axiosClient } from '../helpers/axiosClient'

// ─── AUTH ────────────────────────────────────────────────────────────────────
const registerUser = (data) => axiosClient.post('/auth/register', data)
const loginUser = (data) => axiosClient.post('/auth/login', data)
const verificarEmail = (token) => axiosClient.get('/auth/verify-email', { params: { token } })

// ─── CANCHAS ─────────────────────────────────────────────────────────────────
const getCanchas = () => axiosClient.get('/canchas')
const getCancha = (id) => axiosClient.get(`/canchas/${id}`)
const createCancha = (data) => axiosClient.post('/canchas', data)
const updateCancha = (id, data) => axiosClient.put(`/canchas/${id}`, data)
const deleteCancha = (id) => axiosClient.delete(`/canchas/${id}`)

// ─── PRODUCTOS ────────────────────────────────────────────────────────────────
const getProductos = () => axiosClient.get('/productos')
const getProducto = (id) => axiosClient.get(`/productos/${id}`)
const createProducto = (data) => axiosClient.post('/productos', data)
const updateProducto = (id, data) => axiosClient.put(`/productos/${id}`, data)
const deleteProducto = (id) => axiosClient.delete(`/productos/${id}`)

// ─── RESERVAS ────────────────────────────────────────────────────────────────
const getReservas = () => axiosClient.get('/reservas')
const getReserva = (id) => axiosClient.get(`/reservas/${id}`)
const createReserva = (data) => axiosClient.post('/reservas', data)
const deleteReserva = (id) => axiosClient.delete(`/reservas/${id}`)
const getDisponibilidad = (canchaId, fecha) => axiosClient.get('/reservas/disponibilidad', { params: { canchaId, fecha } })
const getReservasAdmin = () => axiosClient.get('/reservas/admin')
const getDatosTransferencia = () => axiosClient.get('/reservas/datos-transferencia')
const confirmarPago = (id) => axiosClient.patch(`/reservas/${id}/confirmar-pago`)
const cancelarPago = (id) => axiosClient.patch(`/reservas/${id}/cancelar-pago`)

// ─── USUARIOS (admin) ────────────────────────────────────────────────────────
const getUsers = () => axiosClient.get('/users')
const deleteUser = (id) => axiosClient.delete(`/users/${id}`)

export {
    registerUser,
    loginUser,
    verificarEmail,
    getCanchas,
    getCancha,
    createCancha,
    updateCancha,
    deleteCancha,
    getProductos,
    getProducto,
    createProducto,
    updateProducto,
    deleteProducto,
    getReservas,
    getReserva,
    createReserva,
    deleteReserva,
    getDisponibilidad,
    getReservasAdmin,
    getDatosTransferencia,
    confirmarPago,
    cancelarPago,
    getUsers,
    deleteUser
}