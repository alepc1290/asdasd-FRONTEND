import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Zap,
  Shield,
  Clock,
  Star,
  MapPin,
  Users,
  Trophy,
  Heart,
  Target,
} from "lucide-react";

/* ─── Data ─────────────────────────────────────────────── */
const VALORES = [
  {
    icon: Trophy,
    label: "Excelencia",
    desc: "Cada cancha está mantenida bajo estándares FIFA para que juegues siempre en las mejores condiciones.",
  },
  {
    icon: Users,
    label: "Comunidad",
    desc: "Somos el punto de encuentro de cientos de equipos locales. El fútbol nos une.",
  },
  {
    icon: Heart,
    label: "Pasión",
    desc: "Nacimos del amor por el fútbol. Cada decisión que tomamos tiene ese fuego adentro.",
  },
  {
    icon: Target,
    label: "Innovación",
    desc: "Reservas online, confirmación instantánea. Tecnología al servicio del juego.",
  },
];

const TEAM = [
  { name: "Martín Rodríguez", role: "Fundador & CEO", initial: "M" },
  { name: "Lucía Ferreyra", role: "Operaciones", initial: "L" },
  { name: "Diego Salinas", role: "Mantenimiento", initial: "D" },
  { name: "Ana Torres", role: "Atención al Cliente", initial: "A" },
];

const STATS = [
  { num: "2018", label: "Año de fundación" },
  { num: "4", label: "Canchas premium" },
  { num: "500+", label: "Reservas / mes" },
  { num: "98%", label: "Satisfacción" },
];

/* ─── Counter animation ─────────────────────────────────── */
function useCountUp(target, duration = 1400) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    const isNum = !isNaN(parseInt(target));
    if (!isNum) {
      setVal(target);
      return;
    }
    const end = parseInt(target);
    const suffix = target.replace(String(end), "");
    const step = Math.ceil(end / (duration / 30));
    let current = 0;
    const t = setInterval(() => {
      current = Math.min(current + step, end);
      setVal(current + suffix);
      if (current >= end) clearInterval(t);
    }, 30);
    return () => clearInterval(t);
  }, [target, duration]);
  return val;
}

function StatItem({ num, label }) {
  const [started, setStarted] = useState(false);
  const val = useCountUp(started ? num : "0", 1200);

  useEffect(() => {
    const timer = setTimeout(() => setStarted(true), 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex flex-col items-center text-center p-6 border border-carbon-600 hover:border-verde-600 transition-colors group">
      <div className="font-display font-900 text-verde-400 text-4xl md:text-5xl leading-none mb-1 group-hover:text-verde-300 transition-colors">
        {val || "0"}
      </div>
      <div className="font-mono text-carbon-400 text-xs uppercase tracking-widest">
        {label}
      </div>
    </div>
  );
}

/* ─── Page ──────────────────────────────────────────────── */
export default function NosotrosPage() {
  return (
    <>
      {/* ── HERO ─────────────────────────────────────────── */}
      <section className="relative min-h-[60vh] flex items-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1529900748604-07564a03e7a6?w=1600&q=80')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-carbon-900 via-carbon-900/90 to-carbon-900/50" />

        {/* Decorative lines */}
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-verde-500/50 to-transparent" />
        <div className="absolute bottom-0 left-0 w-1/2 h-px bg-gradient-to-r from-verde-500/30 to-transparent" />
        <div className="absolute left-8 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-verde-500/20 to-transparent hidden lg:block" />

        <div className="relative max-w-6xl mx-auto px-4 py-24 w-full">
          <p
            className="section-label mb-4 animate-fade-up opacity-0"
            style={{ animationFillMode: "forwards" }}
          >
            — Quiénes somos
          </p>

          <h1
            className="font-display font-900 text-white uppercase leading-none text-6xl md:text-8xl lg:text-9xl mb-6 animate-fade-up opacity-0"
            style={{ animationDelay: "100ms", animationFillMode: "forwards" }}
          >
            Hechos
            <br />
            <span className="text-verde-400">para jugar.</span>
          </h1>

          <p
            className="text-carbon-300 text-lg max-w-xl mb-0 animate-fade-up opacity-0"
            style={{ animationDelay: "200ms", animationFillMode: "forwards" }}
          >
            Canchas5 nació en 2018 con una misión simple: darle a los jugadores
            de la ciudad un espacio de primer nivel donde el fútbol sea siempre
            el protagonista.
          </p>
        </div>
      </section>

      {/* ── STATS ────────────────────────────────────────── */}
      <section className="border-y border-carbon-700 bg-carbon-800">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4">
            {STATS.map(({ num, label }) => (
              <StatItem key={label} num={num} label={label} />
            ))}
          </div>
        </div>
      </section>

      {/* ── HISTORIA ─────────────────────────────────────── */}
      <section className="py-24 max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Text */}
          <div>
            <p className="section-label mb-3">Nuestra historia</p>
            <h2 className="section-title text-4xl md:text-5xl mb-6">
              Del sueño
              <br />
              <span className="text-verde-400">al verde.</span>
            </h2>
            <div className="space-y-4 text-carbon-300 leading-relaxed">
              <p>
                Todo empezó con un grupo de amigos que buscaban un lugar donde
                jugar sin complicaciones. Las canchas que encontraban eran
                difíciles de reservar, mal mantenidas o simplemente demasiado
                lejos.
              </p>
              <p>
                En 2018, Martín Rodríguez decidió transformar ese problema en
                una solución. Con una sola cancha y muchas ganas, abrió las
                puertas de Canchas5 en el corazón de la ciudad.
              </p>
              <p>
                Hoy contamos con cuatro canchas de césped sintético certificado,
                un sistema de reservas online 24/7 y una comunidad de más de 500
                equipos que confían en nosotros cada mes.
              </p>
            </div>

            <div className="mt-8 flex items-center gap-3">
              <div className="w-10 h-10 bg-verde-500 flex items-center justify-center flex-shrink-0">
                <MapPin size={16} className="text-carbon-900" />
              </div>
              <div>
                <div className="font-display font-700 text-white uppercase text-sm tracking-wider">
                  Av. Siempreviva 742
                </div>
                <div className="text-carbon-400 text-xs font-mono">
                  Springfield · Abierto todos los días
                </div>
              </div>
            </div>
          </div>

          {/* Visual card */}
          <div className="relative">
            <div className="relative overflow-hidden border border-carbon-600 group">
              <img
                src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80"
                alt="Cancha de fútbol 5"
                className="w-full h-80 object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
              />
              {/* Green overlay line */}
              <div className="absolute inset-x-0 bottom-0 h-1 bg-verde-500" />
              <div className="absolute top-4 left-4">
                <span className="tag">Desde 2018</span>
              </div>
            </div>

            {/* Floating stat */}
            <div className="absolute -bottom-5 -right-4 bg-verde-500 px-5 py-4 shadow-lg hidden md:block">
              <div className="font-display font-900 text-carbon-900 text-3xl leading-none">
                4
              </div>
              <div className="font-mono text-carbon-900/70 text-xs uppercase tracking-widest">
                canchas
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── VALORES ──────────────────────────────────────── */}
      <section className="py-20 bg-carbon-800 border-y border-carbon-700">
        <div className="max-w-6xl mx-auto px-4">
          <div className="mb-12 text-center">
            <p className="section-label mb-3">Lo que nos mueve</p>
            <h2 className="section-title text-4xl md:text-5xl">
              Nuestros <span className="text-verde-400">valores</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-carbon-600">
            {VALORES.map(({ icon: Icon, label, desc }) => (
              <div
                key={label}
                className="bg-carbon-800 p-8 flex flex-col gap-4 group hover:bg-carbon-700 transition-colors"
              >
                <div className="w-12 h-12 border border-carbon-600 group-hover:border-verde-600 flex items-center justify-center transition-colors">
                  <Icon size={20} className="text-verde-500" />
                </div>
                <div>
                  <h3 className="font-display font-700 text-white uppercase text-sm tracking-widest mb-2">
                    {label}
                  </h3>
                  <p className="text-carbon-400 text-sm leading-relaxed">
                    {desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── EQUIPO ───────────────────────────────────────── */}
      <section className="py-24 max-w-6xl mx-auto px-4">
        <div className="mb-12">
          <p className="section-label mb-3">Las personas detrás</p>
          <h2 className="section-title text-4xl md:text-5xl mb-2">
            Nuestro <span className="text-verde-400">equipo</span>
          </h2>
          <p className="text-carbon-400 text-sm max-w-md">
            Un equipo pequeño con un compromiso enorme. Cada uno de nosotros
            juega fútbol — sabemos exactamente lo que un jugador necesita.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {TEAM.map(({ name, role, initial }) => (
            <div key={name} className="group">
              <div className="aspect-square bg-carbon-700 border border-carbon-600 group-hover:border-verde-600 flex items-center justify-center transition-colors mb-3 relative overflow-hidden">
                <span className="font-display font-900 text-carbon-500 text-7xl group-hover:text-verde-900 transition-colors select-none">
                  {initial}
                </span>
                <div className="absolute inset-x-0 bottom-0 h-px bg-verde-500 scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
              </div>
              <div className="font-display font-700 text-white uppercase text-sm tracking-wide">
                {name}
              </div>
              <div className="font-mono text-verde-500 text-xs uppercase tracking-widest">
                {role}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────── */}
      <section className="bg-verde-600 py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="font-mono text-verde-900/70 text-xs uppercase tracking-widest mb-3">
            ¿Querés ser parte?
          </p>
          <h2 className="font-display font-900 text-carbon-900 text-5xl md:text-6xl uppercase leading-none mb-6">
            Venís a jugar
            <br />o quedás afuera.
          </h2>
          <Link
            to="/reservar"
            className="inline-flex items-center gap-2 bg-carbon-900 text-white font-display font-700 uppercase tracking-widest px-8 py-4 text-sm hover:bg-carbon-700 transition-colors"
          >
            Reservar cancha ahora <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </>
  );
}
