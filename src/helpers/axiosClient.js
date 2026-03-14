import axios from 'axios'
import { API_URL } from '../config/env'

const axiosClient = axios.create({
  baseURL: `${API_URL}/api`,
})

// Interceptor: adjunta el token JWT en cada request automáticamente
axiosClient.interceptors.request.use((config) => {
  const auth = JSON.parse(localStorage.getItem('auth'))
  if (auth?.token) {
    config.headers.Authorization = `Bearer ${auth.token}`
  }
  return config
})

export { axiosClient }
