import Link from 'next/link'

export default function RoomCard({ room, hotel }) {
  return (
    <div
      className="bg-white/10 backdrop-blur-md border border-amber-400/20 rounded-2xl shadow-[0_0_20px_rgba(251,191,36,0.15)]
                 hover:shadow-[0_0_35px_rgba(251,191,36,0.3)] overflow-hidden transition-all duration-500 transform hover:-translate-y-1"
      data-aos="fade-up"
    >
      {/* Ảnh phòng */}
      <div className="h-56 overflow-hidden">
        <img
          src={`/images/${room.id}-1.svg`}
          alt={room.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          onError={(e) => {
            e.currentTarget.src = room.images?.[0]
          }}
        />
      </div>

      {/* Nội dung */}
      <div className="p-5">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold text-amber-400">{room.name}</h3>
            <p className="text-sm text-gray-300">
              {hotel.name} • {hotel.location}
            </p>
          </div>
          <div className="text-right">
            <div className="text-xl font-bold text-white">${room.price}</div>
            <div className="text-sm text-gray-400">/đêm</div>
          </div>
        </div>

        {/* Thông tin phụ */}
        <div className="mt-3 flex items-center justify-between text-gray-400 text-sm">
          <span>
            🛏 {room.beds} • 📏 {room.size}
          </span>
          <Link
            href={`/rooms/${room.id}`}
            className="px-4 py-2 bg-gradient-to-r from-amber-400 to-yellow-500 text-black font-semibold rounded-lg
                       hover:scale-105 hover:shadow-[0_0_20px_rgba(251,191,36,0.6)] transition-all duration-300"
          >
            Xem chi tiết
          </Link>
        </div>
      </div>
    </div>
  )
}
