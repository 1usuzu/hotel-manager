import { useState, useEffect, useRef } from 'react'

const IMAGES = [
  '/images/hotel1.jpg',  // Update these paths to match where you save the images
  '/images/hotel2.jpg',
  '/images/hotel3.jpg'
]

export default function HeroCarousel() {
  const [idx, setIdx] = useState(0)
  const timeoutRef = useRef(null)

  function resetTimeout() {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
  }

  useEffect(() => {
    resetTimeout()
    timeoutRef.current = setTimeout(() => {
      setIdx((prevIndex) => (prevIndex + 1) % IMAGES.length)
    }, 6000) // Change image every 6 seconds for a more luxurious pace

    return () => resetTimeout()
  }, [idx])

  function go(n) {
    setIdx((idx + n + IMAGES.length) % IMAGES.length)
  }

  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* Carousel images */}
      {IMAGES.map((src, i) => (
        <div
          key={i}
          className={`absolute inset-0 transition-all duration-1000 transform ${
            i === idx
              ? 'opacity-100 z-10 scale-100'
              : 'opacity-0 z-0 scale-110'
          }`}
        >
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${src})` }}
          />
          <div className="absolute inset-0 bg-black/40" /> {/* Luxurious dark overlay */}
        </div>
      ))}

      {/* Elegant navigation arrows */}
      <div className="absolute inset-0 flex items-center justify-between p-8 z-20">
        <button
          onClick={() => go(-1)}
          className="p-3 rounded-full bg-black/30 text-white hover:bg-black/50 transition-all transform hover:scale-105"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          onClick={() => go(1)}
          className="p-3 rounded-full bg-black/30 text-white hover:bg-black/50 transition-all transform hover:scale-105"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Elegant dots indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-4 z-20">
        {IMAGES.map((_, i) => (
          <button
            key={i}
            onClick={() => setIdx(i)}
            className={`w-3 h-3 rounded-full transition-colors duration-300 ${
              i === idx
                ? 'bg-white w-6' // Active dot is wider
                : 'bg-white/50 hover:bg-white/75'
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
