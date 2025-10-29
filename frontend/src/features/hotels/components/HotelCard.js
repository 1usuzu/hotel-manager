export function HotelCard({ hotel }) {
  function createRipple(e) {
    const el = e.currentTarget
    const rect = el.getBoundingClientRect()
    const circle = document.createElement('span')
    const size = Math.max(rect.width, rect.height)
    circle.style.width = circle.style.height = `${size}px`
    circle.style.left = `${e.clientX - rect.left - size/2}px`
    circle.style.top = `${e.clientY - rect.top - size/2}px`
    circle.className = 'ripple'
    el.classList.add('ripple-wrapper')
    el.appendChild(circle)
    setTimeout(() => circle.remove(), 650)
  }

  return (
    <div
      className="luxury-card group cursor-pointer overflow-hidden"
      onMouseDown={createRipple}
    >
      <div className="h-64 overflow-hidden rounded-lg relative">
        <div
          className="w-full h-full bg-cover bg-center transform transition-transform duration-700 group-hover:scale-110"
          style={{ backgroundImage: `url(${hotel.image})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

        {/* Price tag */}
        <div className="absolute top-4 right-4 bg-brand-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
          ${hotel.price}
          <span className="text-xs font-normal ml-1">/đêm</span>
        </div>

        {/* Star rating */}
        <div className="absolute bottom-4 right-4 flex items-center bg-black/50 backdrop-blur-sm rounded-full px-2 py-1">
          <span className="text-amber-400 mr-1">{hotel.rating}</span>
          <svg className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.97a1 1 0 00.95.69h4.173c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.287 3.97c.3.921-.755 1.688-1.54 1.118l-3.38-2.455a1 1 0 00-1.176 0l-3.38 2.455c-.785.57-1.84-.197-1.54-1.118l1.287-3.97a1 1 0 00-.364-1.118L2.06 9.397c-.783-.57-.38-1.81.588-1.81h4.173a1 1 0 00.95-.69l1.286-3.97z" />
          </svg>
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-serif text-xl text-white group-hover:text-brand-500 transition-colors">
              {hotel.name}
            </h3>
            <p className="text-sm text-gray-400 mt-1">
              {hotel.location}
            </p>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <span className="text-sm text-gray-400">
            {hotel.rooms.length} phòng
          </span>
          <a
            href={`/hotels/${hotel.id}`}
            className="luxury-button text-sm px-4 py-2"
          >
            Xem chi tiết
          </a>
        </div>
      </div>
    </div>
  )
}
