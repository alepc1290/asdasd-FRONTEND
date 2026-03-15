import { BrowserRouter, Route, Routes } from 'react-router'
import { Toaster } from 'sonner'
import { AuthProvider } from './context/AuthContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import PrivateRoute from './components/PrivateRoute'
import AdminRoute from './components/AdminRoute'
import Home      from './pages/Home'
import Login     from './pages/Login'
import Register  from './pages/Register'
import Reservas  from './pages/Reservas'
import Productos from './pages/Productos'
import AdminPanel  from './pages/AdminPanel'
import VerifyEmail from './pages/VerifyEmail'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="d-flex flex-column min-vh-100">
          <Navbar />
          <main className="flex-grow-1">
            <Routes>
              {/* Públicas */}
              <Route path="/"          element={<Home />} />
              <Route path="/login"     element={<Login />} />
              <Route path="/register"  element={<Register />} />
              <Route path="/productos"     element={<Productos />} />
              <Route path="/verify-email"  element={<VerifyEmail />} />

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
                <div className="text-center py-5">
                  <i className="bi bi-exclamation-triangle text-warning" style={{ fontSize: 64 }}></i>
                  <h2 className="mt-3">Página no encontrada</h2>
                  <a href="/" className="btn btn-success mt-3">Volver al inicio</a>
                </div>
              } />
            </Routes>
          </main>
          <Footer />
        </div>
        <Toaster richColors position="top-right" />
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
