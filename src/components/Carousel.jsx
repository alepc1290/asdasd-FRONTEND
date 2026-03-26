import React, { useState, useEffect, useRef, useCallback } from 'react'
import { ArrowLeft, ArrowRight, Zap, Clock, Shield, Star, Users, Trophy } from 'lucide-react'
import publi1 from "./img/publi1.png"
import publi2 from "./img/publi2.png"
import publi3 from "./img/publi3.png"

/* ─────────────────────────────────────────────
   Demo slides — reemplazá con tus datos reales
───────────────────────────────────────────── */
const SLIDES = [
  {
    id: 1,
    label: 'Cancha destacada',
    title: 'La mejor\ncancha del\ncomplejo.',
    desc: 'Césped sintético certificado FIFA con iluminación LED de alta intensidad para partidos nocturnos.',
    tag: 'Fútbol 5',
    stat: { num: '4.9', label: 'Rating promedio' },
    badge: 'disponible',
    icon: Star,
    image: 'https://res.cloudinary.com/proyecto3/image/upload/v1774500595/Cartel_Cancha_de_Futbol_Llamativo_Amarillo_y_Verde_c911ul.png',
  },
  {
    id: 2,
    label: 'Infraestructura',
    title: 'Vestuarios\nde primera\ncategoría.',
    desc: 'Instalaciones modernas con duchas calientes, casilleros individuales y zona de descanso.',
    tag: 'Instalaciones',
    stat: { num: '500+', label: 'Reservas / mes' },
    badge: 'nuevo',
    icon: Shield,
    image: 'https://res.cloudinary.com/proyecto3/image/upload/v1774502076/Post_para_Instagram_promocion_cancha_de_futbol_minimalista_moderno_simple_ver_y_blanco_h1f3h9.png',
  },
  {
    id: 3,
    label: 'Horarios',
    title: 'Abierto\ntodos los\ndías.',
    desc: 'De 8 a 23 hs sin excepción. Reservá tu turno en segundos desde cualquier dispositivo.',
    tag: 'Fútbol 7',
    stat: { num: '15 hs', label: 'Disponibles / día' },
    badge: 'disponible',
    icon: Clock,
    image: 'https://res.cloudinary.com/proyecto3/image/upload/v1774500555/cld-sample-3.jpg',
  },
  {
    id: 4,
    label: 'Comunidad',
    title: 'Más de 2k\njugadores\nconfían.',
    desc: 'Torneos semanales, ligas amateur y eventos especiales para toda la familia.',
    tag: 'Fútbol 11',
    stat: { num: '98%', label: 'Satisfacción' },
    badge: 'popular',
    icon: Trophy,
    image: 'https://images.unsplash.com/photo-1553778263-73a83bab9b0c?w=900&q=80',
  },
]

const BADGE_STYLES = {
  disponible: 'bg-verde-500 text-carbon-900',
  nuevo:      'bg-blue-500 text-white',
  popular:    'bg-yellow-400 text-carbon-900',
}

/* ─────────────────────────────────────────────
   Carousel Component
───────────────────────────────────────────── */
export default function Carousel() {
  const [current, setCurrent] = useState(0)
  const [animating, setAnimating] = useState(false)
  const [direction, setDirection] = useState('next') // 'next' | 'prev'
  const autoplayRef = useRef(null)
  const total = SLIDES.length

  const go = useCallback((index, dir = 'next') => {
    if (animating) return
    setDirection(dir)
    setAnimating(true)
    setTimeout(() => {
      setCurrent(index)
      setAnimating(false)
    }, 350)
  }, [animating])

  const next = useCallback(() => go((current + 1) % total, 'next'), [current, go, total])
  const prev = useCallback(() => go((current - 1 + total) % total, 'prev'), [current, go, total])

  // Autoplay
  useEffect(() => {
    autoplayRef.current = setInterval(next, 5000)
    return () => clearInterval(autoplayRef.current)
  }, [next])

  const resetAutoplay = (fn) => {
    clearInterval(autoplayRef.current)
    fn()
  }

  const slide = SLIDES[current]
  const Icon = slide.icon

  return (
    <section className="relative overflow-hidden bg-carbon-900">

      {/* ── Slides wrapper ── */}
      <div
        className="relative min-h-[85vh] flex flex-col lg:flex-row"
        style={{
          opacity: animating ? 0 : 1,
          transform: animating
            ? `translateX(${direction === 'next' ? '-24px' : '24px'})`
            : 'translateX(0)',
          transition: 'opacity 0.35s ease, transform 0.35s ease',
        }}
      >
        {/* ── LEFT: Content ── */}
        <div className="relative z-10 flex flex-col justify-center px-6 py-20 lg:px-16 lg:w-1/2">
          {/* Vertical accent line */}
          <div className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-verde-500/30 to-transparent hidden lg:block" />

          {/* Label */}
          <p className="section-label mb-4 flex items-center gap-2">
            <span className="inline-block w-4 h-px bg-verde-500" />
            {slide.label}
          </p>

          {/* Icon badge */}
          <div className="w-12 h-12 bg-carbon-700 border border-carbon-600 flex items-center justify-center mb-6 hover:border-verde-600 transition-colors">
            <Icon size={22} className="text-verde-500" />
          </div>

          {/* Title */}
          <h2 className="section-title text-5xl md:text-7xl mb-6 whitespace-pre-line">
            {slide.title.split('\n').map((line, i) => (
              <span key={i} className={i === 1 ? 'text-verde-400' : ''}>
                {line}
                {i < 2 && <br />}
              </span>
            ))}
          </h2>

          {/* Description */}
          <p className="text-carbon-300 text-sm leading-relaxed max-w-md mb-8">
            {slide.desc}
          </p>

          {/* Stat */}
          <div className="flex items-center gap-6 mb-10">
            <div>
              <div className="font-display font-black text-verde-400 text-4xl">
                {slide.stat.num}
              </div>
              <div className="font-mono text-carbon-400 text-xs uppercase tracking-widest">
                {slide.stat.label}
              </div>
            </div>
            <div className="w-px h-10 bg-carbon-600" />
            <span className={`font-mono text-xs px-3 py-1 uppercase tracking-widest ${BADGE_STYLES[slide.badge] || 'bg-carbon-600 text-carbon-300'}`}>
              {slide.badge}
            </span>
          </div>

          {/* CTA */}
          <div className="flex gap-3">
            <button className="btn-primary flex items-center gap-2 text-xs">
              Reservar ahora <ArrowRight size={13} />
            </button>
            <button className="btn-outline text-xs">
              Ver más
            </button>
          </div>
        </div>

        {/* ── RIGHT: Image ── */}
        <div className="relative lg:w-1/2 h-72 lg:h-auto">
          <img
            src={slide.image}
            alt={slide.title}
            className="w-full h-full object-cover"
          />
          {/* Overlays */}
          <div className="absolute inset-0 bg-gradient-to-r from-carbon-900 via-carbon-900/40 to-transparent lg:block hidden" />
          <div className="absolute inset-0 bg-gradient-to-t from-carbon-900/70 to-transparent lg:hidden" />

          {/* Tag badge on image */}
          <span className="absolute top-4 left-4 tag">{slide.tag}</span>

          {/* Slide counter on image */}
          <div className="absolute bottom-4 right-4 font-mono text-xs text-carbon-300 bg-carbon-900/70 px-3 py-1.5 border border-carbon-600">
            {String(current + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
          </div>
        </div>
      </div>

      {/* ── Top accent line ── */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-verde-500/60 to-transparent" />

      {/* ── Controls bar ── */}
      <div className="relative z-20 border-t border-carbon-700 bg-carbon-800 flex items-center justify-between px-6 lg:px-16 py-4">
                
        {/* Arrows */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => resetAutoplay(prev)}
            className="w-9 h-9 border border-carbon-600 hover:border-verde-500 flex items-center justify-center text-carbon-300 hover:text-verde-400 transition-all duration-200 active:scale-95"
            aria-label="Anterior"
          >
            <ArrowLeft size={14} />
          </button>
          <button
            onClick={() => resetAutoplay(next)}
            className="w-9 h-9 bg-verde-500 hover:bg-verde-400 flex items-center justify-center text-carbon-900 transition-all duration-200 active:scale-95"
            aria-label="Siguiente"
          >
            <ArrowRight size={14} />
          </button>
        </div>
      </div>

      {/* ── Keyframe for progress bar ── */}
      <style>{`
        @keyframes progress {
          from { width: 0% }
          to   { width: 100% }
        }
      `}</style>
    </section>
  )
}
