# 🏟️ Frontend — Canchas & Deportes

Frontend React + Vite + Bootstrap para el sistema de reservas de canchas de fútbol.

---

## 📁 Estructura del proyecto

```
frontend/
│
├── src/
│   ├── config/
│   │   └── env.js                  # Variables de entorno
│   │
│   ├── helpers/
│   │   └── axiosClient.js          # Axios con interceptor JWT
│   │
│   ├── context/
│   │   └── AuthContext.jsx         # Estado global de autenticación
│   │
│   ├── services/
│   │   └── api.js                  # Todas las llamadas al backend
│   │
│   ├── components/
│   │   ├── Navbar.jsx
│   │   ├── Footer.jsx
│   │   ├── PrivateRoute.jsx        # Ruta protegida (requiere JWT)
│   │   ├── AdminRoute.jsx          # Ruta admin (requiere rol admin)
│   │   ├── CanchaCard.jsx
│   │   └── ProductoCard.jsx
│   │
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── Reservas.jsx            # Solo usuarios autenticados
│   │   ├── Productos.jsx
│   │   └── AdminPanel.jsx          # Solo admin
│   │
│   ├── styles/
│   │   └── global.css
│   │
│   ├── App.jsx                     # Router principal
│   └── main.jsx                    # Entry point
│
├── .env.example
├── index.html
├── package.json
└── vite.config.js
```

---

## 🚀 Instalación

### 1. Instalar dependencias

```bash
npm install
```

### 2. Configurar variables de entorno

```bash
cp .env.example .env
```

Editar `.env`:

```env
VITE_API_URL=http://localhost:3000
```

### 3. Ejecutar en desarrollo

```bash
npm run dev
```

El frontend corre en `http://localhost:5173`

---

## 🔗 Rutas

| Ruta | Acceso | Descripción |
|------|--------|-------------|
| `/` | Público | Home con canchas y productos destacados |
| `/login` | Público | Formulario de login |
| `/register` | Público | Formulario de registro |
| `/productos` | Público | Tienda de productos |
| `/reservas` | 🔒 Login | Reservar cancha |
| `/admin` | 🔒 Admin | Panel de administración |

---

## 🔐 Autenticación

- El JWT se guarda en `localStorage` bajo la clave `auth`
- El `axiosClient` adjunta automáticamente el token en cada request: `Authorization: Bearer <token>`
- `PrivateRoute` redirige a `/login` si no hay sesión
- `AdminRoute` redirige a `/` si no es admin
- Tras el login exitoso, el usuario es redirigido a `/reservas`

---

## 📡 Endpoints consumidos

| Acción | Método | Ruta backend |
|--------|--------|--------------|
| Registro | POST | `/api/auth/register` |
| Login | POST | `/api/auth/login` |
| Listar canchas | GET | `/api/canchas` |
| Crear cancha | POST | `/api/canchas` |
| Editar cancha | PUT | `/api/canchas/:id` |
| Eliminar cancha | DELETE | `/api/canchas/:id` |
| Listar productos | GET | `/api/productos` |
| Crear producto | POST | `/api/productos` |
| Editar producto | PUT | `/api/productos/:id` |
| Eliminar producto | DELETE | `/api/productos/:id` |
| Crear reserva | POST | `/api/reservas` |
| Listar reservas | GET | `/api/reservas` |
| Eliminar reserva | DELETE | `/api/reservas/:id` |
| Listar usuarios | GET | `/api/users` |
| Eliminar usuario | DELETE | `/api/users/:id` |

---

## 🔧 Stack

- **React 19** + **Vite**
- **React Router v7**
- **Bootstrap 5** + **Bootstrap Icons**
- **Axios** con interceptores JWT
- **Sonner** para notificaciones toast
