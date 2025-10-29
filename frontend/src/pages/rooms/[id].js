import { useRouter } from 'next/router'
import { useEffect } from 'react'
import AOS from 'aos'
import 'aos/dist/aos.css'
import Header from '@/layouts/Header'
import Footer from '@/layouts/Footer'
import { hotels } from '@/features/hotels/data'

export default function RoomDetail() {
  const router = useRouter()
  const { id } = router.query

  useEffect(() => {
    AOS.init({ duration: 800, once: true })
  }, [])

  let selectedRoom = null
  for (const h of hotels) {
    const found = h.rooms.find((r) => r.id.toString() === id)
    if (found) {
      selectedRoom = { room: found, hotel: h }
      break
    }
  }

  if (!selectedRoom)
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400 text-lg">
        <p>⚠️ Không tìm thấy thông tin phòng.</p>
      </div>
    )

  const { room, hotel } = selectedRoom

  return (
    <div className="relative min-h-screen bg-[url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80')] bg-cover bg-center text-white">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm"></div>
      <Header />

      <section className="relative z-10 text-center pt-32 pb-12 px-6">
        <h1 className="text-5xl font-[Playfair_Display] text-amber-400 font-bold mb-4" data-aos="fade-down">
          {room.name}
        </h1>
        <p className="text-gray-300 text-lg" data-aos="fade-up">
          {hotel.name} – {hotel.location}
        </p>
      </section>

      <section className="relative z-10 container mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-10 pb-20">
        <div data-aos="fade-right" className="space-y-4">
          {room.images?.length ? (
            room.images.map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt={`Room ${idx}`}
                className="rounded-2xl shadow-[0_0_25px_rgba(251,191,36,0.2)] hover:scale-[1.02] transition-transform duration-500"
              />
            ))
          ) : (
            <img
              src={hotel.image}
              alt="Room"
              className="rounded-2xl shadow-[0_0_25px_rgba(251,191,36,0.2)]"
            />
          )}
        </div>

        <div data-aos="fade-left" className="space-y-6">
          <h2 className="text-3xl font-[Playfair_Display] text-amber-400">Mô tả chi tiết</h2>
          <p className="text-gray-300 leading-relaxed">{room.description}</p>

          <div>
            <h3 className="text-xl font-semibold text-amber-400 mb-2">Tiện nghi nổi bật</h3>
            <ul className="grid grid-cols-2 gap-3 text-gray-300 text-sm">
              {room.amenities?.length ? (
                room.amenities.map((a, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span className="text-amber-400">•</span> {a}
                  </li>
                ))
              ) : (
                <>
                  <li>Wi-Fi tốc độ cao</li>
                  <li>Smart TV 50”</li>
                  <li>Mini bar & Trà/Cà phê</li>
                  <li>View thành phố</li>
                  <li>Bồn tắm & Shower riêng</li>
                  <li>Điều hòa & két sắt cá nhân</li>
                </>
              )}
            </ul>
          </div>

          <div className="pt-4">
            <h3 className="text-xl font-semibold text-amber-400">Giá phòng</h3>
            <p className="text-3xl font-bold text-white mt-1">${room.price} / đêm</p>
          </div>

          <div className="pt-6">
            <button
              onClick={() => router.push(`/payment?room=${room.id}&price=${room.price}`)}
              className="px-10 py-3 bg-gradient-to-r from-amber-400 to-yellow-500 text-black font-semibold rounded-lg hover:scale-105 hover:shadow-[0_0_25px_rgba(251,191,36,0.6)] transition-all duration-300"
            >
              Đặt phòng ngay
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
