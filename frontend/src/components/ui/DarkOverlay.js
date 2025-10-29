export function DarkOverlay({ opacity = 40, className = '' }) {
  return (
    <div
      className={`absolute inset-0 bg-gradient-to-b from-black/${opacity} to-black/60 ${className}`}
      style={{
        backdropFilter: 'blur(1px)',
        WebkitBackdropFilter: 'blur(1px)'
      }}
    />
  )
}

export function HeroContent({ children, className = '' }) {
  return (
    <div className={`relative z-20 container mx-auto px-4 text-white ${className}`}>
      {children}
    </div>
  )
}

export function LuxuryContainer({ children, backgroundImage, className = '' }) {
  return (
    <div
      className={`relative min-h-screen bg-cover bg-center bg-no-repeat ${className}`}
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <DarkOverlay />
      {children}
    </div>
  )
}
