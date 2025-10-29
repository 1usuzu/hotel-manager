import { useState, useEffect } from 'react'

export function BlurImage({ src, alt = '', className = '' }) {
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const img = new Image()
    img.src = src
    img.onload = () => setLoaded(true)
  }, [src])

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <div
        className={`
          absolute inset-0 bg-cover bg-center transition-transform duration-7000 ease-out
          ${loaded ? 'scale-110' : 'scale-100'}
        `}
        style={{ backgroundImage: `url(${src})` }}
      />
      <div
        className={`
          absolute inset-0 bg-black/50 backdrop-blur transition-opacity duration-1000
          ${loaded ? 'opacity-0' : 'opacity-100'}
        `}
      />
    </div>
  )
}

export function ParallaxImage({ src, alt = '', className = '', speed = 0.5 }) {
  const [offset, setOffset] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      setOffset(window.pageYOffset)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <div
        className="absolute inset-0 bg-cover bg-center transition-transform duration-100"
        style={{
          backgroundImage: `url(${src})`,
          transform: `translateY(${offset * speed}px)`
        }}
      />
    </div>
  )
}
