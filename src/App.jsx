import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router'
import { Toaster } from 'sonner'
import { AuthProvider } from './context/AuthContext'
import Navbar           from './components/Navbar'
import Footer           from './components/Footer'
import PrivateRoute     from './components/PrivateRoute'
import AdminRoute       from './components/AdminRoute'
import Home             from './pages/Home'
import Login            from './pages/Login'
import Register         from './pages/Register'
import Reservas         from './pages/Reservas'
import Productos        from './pages/Productos'
import AdminPanel       from './pages/AdminPanel'
import VerifyEmail      from './pages/VerifyEmail'
import GoogleAuthSuccess from './pages/GoogleAuthSuccess'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="flex flex-col min-h-screen bg-carbon-900">
          <Navbar />
          <main className="flex-1">
            <Routes>
              {/* Públicas */}
              <Route path="/"                       element={<Home />} />
              <Route path="/login"                  element={<Login />} />
              <Route path="/register"               element={<Register />} />
              <Route path="/productos"              element={<Productos />} />
              <Route path="/verify-email"           element={<VerifyEmail />} />
              <Route path="/auth/google/success"    element={<GoogleAuthSuccess />} />

              {/* Requieren login */}
              <Route element={<PrivateRoute />}>
                <Route path="/reservas" element={<Reservas />} />
              </Route>

              {/* Solo admin */}
              <Route element={<AdminRoute />}>
                <Route path="/admin" element={<AdminPanel />} />
              </Route>

              {/* 404 */}
              <Route path="*" element={
                <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
                  <p className="section-label mb-3">Error 404</p>
                  <h2 className="font-display font-black text-white uppercase text-6xl mb-4">No encontrado</h2>
                  <p className="text-carbon-400 text-sm mb-8">La página que buscás no existe.</p>
                  <a href="/" className="btn-primary flex items-center gap-2">Volver al inicio</a>
                </div>
              } />
            </Routes>
          </main>
          <Footer />
        </div>
        <Toaster
          richColors
          position="top-right"
          toastOptions={{
            style: {
              background: '#1a1a1a',
              border: '1px solid #222222',
              color: '#fff',
              fontFamily: 'DM Sans, sans-serif',
            },
          }}
        />
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
