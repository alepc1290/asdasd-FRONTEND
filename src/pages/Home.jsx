import { useEffect, useState } from "react";
import { Link } from "react-router";
import { ArrowRight, Zap, Clock, Shield, Star } from "lucide-react";
import { getCanchas, getProductos } from "../services/api";
import CanchaCard from "../components/CanchaCard";
import ProductoCard from "../components/ProductoCard";
import Carousel from "../components/Carousel";

const CARACTERISTICAS = [
  {
    icon: Zap,
    title: "Reserva Instantánea",
    desc: "Confirmación inmediata sin llamadas",
  },
  {
    icon: Clock,
    title: "Horarios Flexibles",
    desc: "Abierto todos los días de 8 a 23 hs",
  },
  {
    icon: Shield,
    title: "Cancelás sin cargo",
    desc: "Hasta 2 horas antes del turno",
  },
  {
    icon: Star,
    title: "Calidad Premium",
    desc: "Césped sintético certificado FIFA",
  },
];

function Home() {
  const [canchas, setCanchas] = useState([]);
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getCanchas(), getProductos()])
      .then(([c, p]) => {
        setCanchas(c.data.data.slice(0, 3));
        setProductos(p.data.data.slice(0, 4));
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      {/* ── HERO ── */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1529900748604-07564a03e7a6?w=1600&q=80')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-carbon-900 via-carbon-900/90 to-carbon-900/40" />
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-verde-500/50 to-transparent" />
        <div className="absolute bottom-0 left-0 w-1/2 h-px bg-gradient-to-r from-verde-500/30 to-transparent" />
        <div className="absolute left-8 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-verde-500/20 to-transparent hidden lg:block" />

        <div className="relative max-w-6xl mx-auto px-4 py-24">
          <p
            className="section-label mb-4 animate-fade-up opacity-0"
            style={{ animationFillMode: "forwards" }}
          >
            — Complejo Deportivo Canchas & Deportes
          </p>
          <h1
            className="font-display font-black text-white uppercase leading-none text-6xl md:text-8xl lg:text-9xl mb-6 animate-fade-up opacity-0"
            style={{ animationDelay: "100ms", animationFillMode: "forwards" }}
          >
            Jugá en
            <br />
            <span className="text-verde-400">otro nivel.</span>
          </h1>
          <p
            className="text-carbon-300 text-lg max-w-lg mb-10 animate-fade-up opacity-0"
            style={{ animationDelay: "200ms", animationFillMode: "forwards" }}
          >
            Reservá tu cancha de fútbol 5 o fútbol 7 en segundos. Sin llamadas,
            sin complicaciones.
          </p>
          <div
            className="flex flex-col sm:flex-row gap-3 animate-fade-up opacity-0"
            style={{ animationDelay: "300ms", animationFillMode: "forwards" }}
          >
            <Link
              to="/reservas"
              className="btn-primary flex items-center justify-center gap-2"
            >
              Reservar cancha ahora <ArrowRight size={16} />
            </Link>
            <Link
              to="/productos"
              className="btn-outline flex items-center justify-center gap-2"
            >
              Ver tienda
            </Link>
          </div>

          {/* Stats */}
          <div
            className="flex gap-8 mt-16 animate-fade-up opacity-0"
            style={{ animationDelay: "400ms", animationFillMode: "forwards" }}
          >
            {[
              { num: "4", label: "canchas" },
              { num: "500+", label: "reservas / mes" },
              { num: "98%", label: "satisfacción" },
            ].map(({ num, label }) => (
              <div key={label}>
                <div className="font-display font-black text-verde-400 text-3xl">
                  {num}
                </div>
                <div className="font-mono text-carbon-400 text-xs uppercase tracking-widest">
                  {label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CARACTERISTICAS ── */}
      <section className="py-16 border-y border-carbon-700 bg-carbon-800">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {CARACTERISTICAS.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex flex-col gap-3 group">
                <div className="w-10 h-10 bg-carbon-700 border border-carbon-600 group-hover:border-verde-600 flex items-center justify-center transition-colors">
                  <Icon size={18} className="text-verde-500" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-white text-sm uppercase tracking-wide">
                    {title}
                  </h3>
                  <p className="text-green-400 text-xs mt-0.5">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CANCHAS ── */}
      <section className="py-20 max-w-6xl mx-auto px-4">
        <div className="flex items-end justify-between mb-10 flex-wrap gap-4">
          <div>
            <p className="section-label mb-2">Ahora mismo</p>
            <h2 className="section-title text-4xl md:text-5xl">
              Nuestras canchas
            </h2>
            <p className="text-green-300 mt-3 text-sm max-w-xl">
              Elegí tu cancha y reservá el horario que más te convenga.
            </p>
          </div>
          <Link
            to="/reservas"
            className="btn-ghost flex items-center gap-1 mb-10"
          >
            Ver todas <ArrowRight size={14} />
          </Link>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div className="w-12 h-12 border-2 border-carbon-600 border-t-verde-500 rounded-full animate-spin" />
            <p className="font-mono text-carbon-400 text-xs uppercase tracking-widest">
              Cargando canchas...
            </p>
          </div>
        ) : canchas.length === 0 ? (
          <p className="text-carbon-400 text-sm">
            No hay canchas disponibles todavía.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {canchas.map((c) => (
              <CanchaCard key={c._id} cancha={c} />
            ))}
          </div>
        )}
      </section>
      <Carousel/>
      {/* ── CTA BANNER ── */}

      {/* ── PRODUCTOS ── */}
      {productos.length > 0 && (
        <section className="py-20 max-w-6xl mx-auto px-4">
          <div className="flex items-end justify-between mb-10 flex-wrap gap-4">
            <div>
              <p className="section-label mb-2">Equipate</p>
              <h2 className="section-title text-4xl md:text-5xl">
                Tienda deportiva
              </h2>
              <p className="text-carbon-300 mt-3 text-sm max-w-xl">
                Todo lo que necesitás para jugar al máximo.
              </p>
            </div>
            <Link
              to="/productos"
              className="btn-ghost flex items-center gap-1 mb-10"
            >
              Ver todo <ArrowRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {productos.map((p) => (
              <ProductoCard key={p._id} producto={p} />
            ))}
          </div>
        </section>
      )}

      
    </>
  );
}

export default Home