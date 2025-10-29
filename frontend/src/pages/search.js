import Header from '@/layouts/Header'
import Footer from '@/layouts/Footer'
import { hotels } from '../data/hotels'
import RoomCard from '../components/RoomCard'
import { useRouter } from 'next/router'

function flattenRooms() {
  const list = []
  for (const h of hotels) {
    for (const r of h.rooms) {
      list.push({ room: r, hotel: h })
    }
  }
  return list
}

export default function Search() {
  const router = useRouter()
  const { destination = '' } = router.query
  const all = flattenRooms()

  const filtered = all.filter(({ hotel }) => {
    if (!destination) return true
    const d = String(destination).toLowerCase()
    return (
      hotel.name.toLowerCase().includes(d) ||
      hotel.location.toLowerCase().includes(d)
    )
  })

  return (
    <div className="relative min-h-screen bg-[url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80')] bg-cover bg-center text-white">
      {/* Overlay mờ sang trọng */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-[2px]"></div>

      {/* 🏨 Header y hệt trang Home */}
      <Header />

      {/* Nội dung trang */}
      <main className="relative z-10 container mx-auto px-6 py-28">
        <h1 className="text-4xl md:text-5xl font-[Playfair_Display] font-semibold text-amber-400 mb-4 drop-shadow-[0_2px_8px_rgba(251,191,36,0.6)]">
          Kết quả tìm phòng
        </h1>

        <p className="text-gray-300 mb-10 text-lg">
          Hiển thị{' '}
          <span className="text-amber-400 font-semibold">{filtered.length}</span>{' '}
          phòng phù hợp với:{' '}
          <strong className="text-white">{destination || 'Tất cả địa điểm'}</strong>
        </p>

        {/* Kết quả phòng hiển thị */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {filtered.length === 0 ? (
            <div className="col-span-full text-center text-gray-400 italic">
              Không tìm thấy phòng phù hợp 😢
            </div>
          ) : (
            filtered.map(({ room, hotel }) => (
              <div
                key={room.id}
                className="bg-white/10 backdrop-blur-md border border-amber-400/30 rounded-2xl overflow-hidden shadow-[0_0_15px_rgba(251,191,36,0.15)] hover:shadow-[0_0_25px_rgba(251,191,36,0.35)] transition-all duration-300"
              >
                <div className="h-56 overflow-hidden">
                  <img
                    src={room.image || hotel.image}
                    alt={room.name}
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                  />
                </div>

                <div className="p-5">
                  <h3 className="text-xl font-semibold text-amber-400 mb-2">
                    {room.name}
                  </h3>
                  <p className="text-gray-300 text-sm mb-2">
                    {hotel.name} – {hotel.location}
                  </p>
                  <div className="flex justify-between items-center">
                    <div className="text-lg font-bold text-white">
                      ${room.price}
                      <span className="text-sm text-gray-400"> /đêm</span>
                    </div>
                    <button className="px-4 py-2 rounded-lg bg-gradient-to-r from-amber-400 to-yellow-500 text-black font-semibold hover:scale-[1.05] hover:shadow-[0_0_15px_rgba(251,191,36,0.4)] transition-all duration-300">
                      Đặt ngay
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
