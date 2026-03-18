import React from 'react'
import { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('auth')) || null
    } catch {
      return null
    }
  })

  const login = (data) => {
    // data = { token, user: { id, nombre, email, rol } }
    localStorage.setItem('auth', JSON.stringify({ auth: true, ...data }))
    setAuth({ auth: true, ...data })
  }

  const logout = () => {
    localStorage.removeItem('auth')
    setAuth(null)
  }

  const isAdmin = auth?.user?.rol === 'admin'
  const isLogged = !!auth?.auth

  return (
    <AuthContext.Provider value={{ auth, login, logout, isAdmin, isLogged }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
