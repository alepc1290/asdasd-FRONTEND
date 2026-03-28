import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, X, ChevronLeft, ChevronRight, ZoomIn, Image } from 'lucide-react'

const CATEGORIAS = ['Todas', 'Canchas', 'Instalaciones', 'Eventos', 'Nocturnas']


// imagenes hardcodeadas 

const FOTOS = [
  {
    id: 1,
    src: 'https://res.cloudinary.com/proyecto3/image/upload/v1774668920/Captura_de_pantalla_2026-03-28_003424_wlohvq.png',
    thumb: 'https://res.cloudinary.com/proyecto3/image/upload/v1774668920/Captura_de_pantalla_2026-03-28_003424_wlohvq.png',
    categoria: 'Canchas',
    featured: true,
  },
  {
    id: 2,
    src: 'https://res.cloudinary.com/proyecto3/image/upload/v1774668886/WhatsApp_Image_2026-03-28_at_12.12.13_AM_jpmvvs.jpg',
    thumb: 'https://res.cloudinary.com/proyecto3/image/upload/v1774668886/WhatsApp_Image_2026-03-28_at_12.12.13_AM_jpmvvs.jpg',
    categoria: 'Canchas',
    titulo: 'Cancha 2 — Fútbol 5',
    desc: 'Iluminación LED de alta potencia. Disponible de noche.',
  },
  {
    id: 3,
    src: 'https://res.cloudinary.com/proyecto3/image/upload/v1774670517/WhatsApp_Image_2026-03-27_at_11.52.59_PM_1_shbdkt.jpg',
    thumb: 'https://res.cloudinary.com/proyecto3/image/upload/v1774670517/WhatsApp_Image_2026-03-27_at_11.52.59_PM_1_shbdkt.jpg',
    categoria: 'Nocturnas',
  },
  {
    id: 4,
    src: 'https://res.cloudinary.com/proyecto3/image/upload/v1774669192/WhatsApp_Image_2026-03-27_at_11.52.59_PM_lonwtj.jpg',
    thumb: 'https://res.cloudinary.com/proyecto3/image/upload/v1774669192/WhatsApp_Image_2026-03-27_at_11.52.59_PM_lonwtj.jpg',
    categoria: 'Canchas',
  },
  {
    id: 5,
    src: 'https://res.cloudinary.com/proyecto3/image/upload/v1774669431/WhatsApp_Image_2026-03-28_at_12.40.46_AM_tvfz3s.jpg',
    thumb: 'https://res.cloudinary.com/proyecto3/image/upload/v1774669431/WhatsApp_Image_2026-03-28_at_12.40.46_AM_tvfz3s.jpg',
    categoria: 'Instalaciones',
  },
  {
    id: 6,
    src: 'https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?w=1200&q=80',
    thumb: 'https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?w=600&q=75',
    categoria: 'Eventos',
    featured: true,
  },
  {
    id: 7,
    src: 'https://res.cloudinary.com/proyecto3/image/upload/v1774669602/WhatsApp_Image_2026-03-28_at_12.46.22_AM_ni6wyx.jpg',
    thumb: 'https://res.cloudinary.com/proyecto3/image/upload/v1774669602/WhatsApp_Image_2026-03-28_at_12.46.22_AM_ni6wyx.jpg',
    categoria: 'Eventos',
  },
  {
    id: 8,
    src: 'https://images.unsplash.com/photo-1518604666860-9ed391f76460?w=1200&q=80',
    thumb: 'https://images.unsplash.com/photo-1518604666860-9ed391f76460?w=600&q=75',
    categoria: 'Nocturnas',
  },
  {
    id: 9,
    src: 'https://images.unsplash.com/photo-1553778263-73a83bab9b0c?w=1200&q=80',
    thumb: 'https://images.unsplash.com/photo-1553778263-73a83bab9b0c?w=600&q=75',
    categoria: 'Instalaciones',
  },
  {
    id: 10,
    src: 'https://images.unsplash.com/photo-1526232761682-d26e03ac148e?w=1200&q=80',
    thumb: 'https://images.unsplash.com/photo-1526232761682-d26e03ac148e?w=600&q=75',
    categoria: 'Canchas',
  },
  {
    id: 11,
    src: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1200&q=80',
    thumb: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=600&q=75',
    categoria: 'Eventos',
  },
  {
    id: 12,
    src: 'https://images.unsplash.com/photo-1487466365202-1afdb86c764e?w=1200&q=80',
    thumb: 'https://images.unsplash.com/photo-1487466365202-1afdb86c764e?w=600&q=75',
    categoria: 'Nocturnas',
    featured: true,
  },
]

/* ─── Lightbox ──────────────────────────────────────────── */
function Lightbox({ foto, onClose, onPrev, onNext, total, index }) {
  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape')     onClose()
      if (e.key === 'ArrowLeft')  onPrev()
      if (e.key === 'ArrowRight') onNext()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose, onPrev, onNext])

  return (
    <div
      className="fixed inset-0 z-50 bg-carbon-900/97 backdrop-blur flex flex-col animate-fade-in"
      onClick={onClose}
    >
      {/* Top bar */}
      <div
        className="flex items-center justify-between px-6 py-4 border-b border-carbon-700 flex-shrink-0"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3">
          <span className="tag">{foto.categoria}</span>
          <span className="font-display font-700 text-white uppercase text-sm tracking-wide hidden sm:block">
            {foto.titulo}
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span className="font-mono text-carbon-400 text-xs">
            {index + 1} / {total}
          </span>
          <button
            onClick={onClose}
            className="w-8 h-8 border border-carbon-600 hover:border-verde-600 flex items-center justify-center text-carbon-300 hover:text-white transition-colors"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {/* Image area */}
      <div
        className="flex-1 flex items-center justify-center p-4 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Prev */}
        <button
          onClick={onPrev}
          className="absolute left-4 z-10 w-10 h-10 border border-carbon-600 hover:border-verde-600 bg-carbon-800/80 flex items-center justify-center text-carbon-300 hover:text-white transition-colors"
        >
          <ChevronLeft size={20} />
        </button>

        <img
          key={foto.id}
          src={foto.src}
          alt={foto.titulo}
          className="max-h-[70vh] max-w-full object-contain border border-carbon-700 animate-fade-in"
        />

        {/* Next */}
        <button
          onClick={onNext}
          className="absolute right-4 z-10 w-10 h-10 border border-carbon-600 hover:border-verde-600 bg-carbon-800/80 flex items-center justify-center text-carbon-300 hover:text-white transition-colors"
        >
          <ChevronRight size={20} />
        </button>
      </div>

    </div>
  )
}

/* ─── Thumb card ────────────────────────────────────────── */
function FotoCard({ foto, onOpen, index }) {
  const isFeatured = foto.featured

  return (
    <div
      className={`group relative overflow-hidden border border-carbon-600 hover:border-verde-600 transition-all duration-300 cursor-pointer bg-carbon-800 ${
        isFeatured ? 'md:col-span-2 md:row-span-2' : ''
      }`}
      style={{ animationDelay: `${index * 60}ms` }}
      onClick={() => onOpen(foto)}
    >
      <img
        src={foto.thumb}
        alt={foto.titulo}
        className={`w-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 group-hover:scale-105 ${
          isFeatured ? 'h-64 md:h-full md:min-h-[340px]' : 'h-48'
        }`}
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-carbon-900/90 via-carbon-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Category tag */}
      <div className="absolute top-3 left-3 opacity-0 group-hover:opacity-100 transition-all duration-200 -translate-y-1 group-hover:translate-y-0">
        <span className="tag text-[10px]">{foto.categoria}</span>
      </div>

      {/* Bottom green line on hover */}
      <div className="absolute inset-x-0 bottom-0 h-px bg-verde-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
    </div>
  )
}

/* ─── Page ──────────────────────────────────────────────── */
 function GaleriaPage() {
  const [categoriaActiva, setCategoriaActiva] = useState('Todas')
  const [lightbox, setLightbox] = useState(null)

  const fotosFiltradas = categoriaActiva === 'Todas'
    ? FOTOS
    : FOTOS.filter((f) => f.categoria === categoriaActiva)

  const abrirLightbox = useCallback((foto) => {
    setLightbox(fotosFiltradas.findIndex((f) => f.id === foto.id))
    document.body.style.overflow = 'hidden'
  }, [fotosFiltradas])

  const cerrarLightbox = useCallback(() => {
    setLightbox(null)
    document.body.style.overflow = ''
  }, [])

  const irAPrev = useCallback(() => {
    setLightbox((i) => (i - 1 + fotosFiltradas.length) % fotosFiltradas.length)
  }, [fotosFiltradas.length])

  const irANext = useCallback(() => {
    setLightbox((i) => (i + 1) % fotosFiltradas.length)
  }, [fotosFiltradas.length])

  return (
    <>
      {/* ── HERO ──────────────────────────────────────────── */}
      <section className="relative py-24 overflow-hidden border-b border-carbon-700">
        <div className="absolute inset-0 bg-gradient-to-br from-carbon-900 via-carbon-800 to-carbon-900" />
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-verde-500/50 to-transparent" />
        <div className="absolute left-8 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-verde-500/20 to-transparent hidden lg:block" />

        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage:
              'linear-gradient(rgba(34,197,94,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(34,197,94,0.5) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />

        <div className="relative max-w-6xl mx-auto px-4">
          <p
            className="section-label mb-4 animate-fade-up opacity-0"
            style={{ animationFillMode: 'forwards' }}
          >
            — Mirá lo que te espera
          </p>
          <h1
            className="font-display font-900 text-white uppercase leading-none text-6xl md:text-8xl mb-6 animate-fade-up opacity-0"
            style={{ animationDelay: '100ms', animationFillMode: 'forwards' }}
          >
            Nuestras
            <br />
            <span className="text-verde-400">instalaciones.</span>
          </h1>
          <p
            className="text-carbon-300 text-lg max-w-lg animate-fade-up opacity-0"
            style={{ animationDelay: '200ms', animationFillMode: 'forwards' }}
          >
            Canchas de primer nivel, vestuarios modernos y un ambiente que te va a hacer
            querer volver cada semana.
          </p>
        </div>
      </section>

      {/* ── FILTROS ───────────────────────────────────────── */}
      <section className="border-b border-carbon-700 bg-carbon-800 sticky top-16 z-30">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center gap-1 overflow-x-auto py-3 scrollbar-hide">
            {CATEGORIAS.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoriaActiva(cat)}
                className={`flex-shrink-0 px-4 py-2 font-mono text-xs uppercase tracking-widest transition-all duration-200 border ${
                  categoriaActiva === cat
                    ? 'bg-verde-500 text-carbon-900 border-verde-500'
                    : 'border-carbon-600 text-carbon-300 hover:border-verde-600 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}

            <span className="ml-auto font-mono text-carbon-500 text-xs flex-shrink-0 pl-4">
              {fotosFiltradas.length} foto{fotosFiltradas.length !== 1 ? 's' : ''}
            </span>
          </div>
        </div>
      </section>

      {/* ── GALERÍA ───────────────────────────────────────── */}
      <section className="py-12 max-w-6xl mx-auto px-4">
        {fotosFiltradas.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
            <div className="w-12 h-12 border border-carbon-600 flex items-center justify-center">
              <Image size={20} className="text-carbon-500" />
            </div>
            <p className="font-display font-700 text-carbon-400 uppercase text-sm tracking-widest">
              No hay fotos en esta categoría
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 auto-rows-auto">
            {fotosFiltradas.map((foto, i) => (
              <FotoCard
                key={foto.id}
                foto={foto}
                index={i}
                onOpen={abrirLightbox}
              />
            ))}
          </div>
        )}
      </section>

      {/* ── CTA ───────────────────────────────────────────── */}
      <section className="bg-verde-600 py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="font-mono text-white-900/70 text-xs uppercase tracking-widest mb-3">
            ¿Te convenciste?
          </p>
          <h2 className="font-display font-900 text-carbon-900 text-5xl md:text-6xl uppercase leading-none mb-6">
            Reservá tu cancha<br />y viví la experiencia.
          </h2>
          <Link
            to="/reservar"
            className="inline-flex items-center gap-2 bg-carbon-900 text-white font-display font-700 uppercase tracking-widest px-8 py-4 text-sm hover:bg-carbon-700 transition-colors"
          >
            Reservar ahora <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* ── LIGHTBOX ──────────────────────────────────────── */}
      {lightbox !== null && (
        <Lightbox
          foto={fotosFiltradas[lightbox]}
          index={lightbox}
          total={fotosFiltradas.length}
          onClose={cerrarLightbox}
          onPrev={irAPrev}
          onNext={irANext}
        />
      )}
    </>
  )
}
export default GaleriaPage;