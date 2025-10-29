import Header from '@/layouts/Header'
import Footer from '@/layouts/Footer'
import HeroSection from '@/features/home/components/HeroSection'
import RoomSection from '@/features/home/components/RoomSection'
import { hotels } from '@/features/hotels/data'
import { useRouter } from 'next/router'

function Stars({ value = 4 }) {
  return (
    <div className="flex items-center text-amber-400">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          className={`w-4 h-4 ${i < value ? 'opacity-100' : 'opacity-30'}`}
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.97a1 1 0 00.95.69h4.173c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.287 3.97c.3.921-.755 1.688-1.54 1.118l-3.38-2.455a1 1 0 00-1.176 0l-3.38 2.455c-.785.57-1.84-.197-1.54-1.118l1.287-3.97a1 1 0 00-.364-1.118L2.06 9.397c-.783-.57-.38-1.81.588-1.81h4.173a1 1 0 00.95-.69l1.286-3.97z" />
        </svg>
      ))}
    </div>
  )
}

function HotelCard({ hotel }) {
  function createRipple(e) {
    const el = e.currentTarget
    const rect = el.getBoundingClientRect()
    const circle = document.createElement('span')
    const size = Math.max(rect.width, rect.height)
    circle.style.width = circle.style.height = `${size}px`
    circle.style.left = `${e.clientX - rect.left - size / 2}px`
    circle.style.top = `${e.clientY - rect.top - size / 2}px`
    circle.className = 'ripple'
    el.classList.add('ripple-wrapper')
    el.appendChild(circle)
    setTimeout(() => {
      circle.remove()
    }, 650)
  }

  return (
    <div
      className="bg-white rounded-lg shadow overflow-hidden hover:shadow-lg transition relative clickable-card"
      onMouseDown={createRipple}
    >
      <div className="h-48 bg-gray-200 overflow-hidden">
        <img
          src={hotel.image}
          alt={hotel.name}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-semibold text-lg">{hotel.name}</h3>
            <p className="text-sm text-gray-500">{hotel.location}</p>
          </div>
          <div className="text-right">
            <div className="text-lg font-bold">${hotel.price}</div>
            <div className="text-sm text-gray-500">/night</div>
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between">
          <Stars value={hotel.rating} />
          <a href={`/hotels/${hotel.id}`} className="btn-primary">
            Xem phòng
          </a>
        </div>
      </div>
    </div>
  )
}

export default function Home() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-dark-900">
      {/* ✅ Header nằm trên cùng */}
      <Header />

      {/* === HERO SECTION === */}
      <div className="relative">
        <HeroSection />

        {/* Hero content text */}
        <div className="absolute inset-0 flex items-center justify-center z-20 pt-20">
          <div className="text-center">
            <h1 className="luxury-header mb-6">Trải Nghiệm Đẳng Cấp</h1>
            <p className="luxury-subheader max-w-2xl mx-auto">
              Khám phá không gian nghỉ dưỡng sang trọng với dịch vụ đẳng cấp 5 sao
            </p>
          </div>
        </div>

        {/* Search card nằm giữa hero */}
        <div className="absolute left-0 right-0 bottom-12 flex justify-center z-30">
          <div className="hero-search-card bg-white/10 backdrop-blur-lg p-6 rounded-xl border border-white/20 shadow-lg flex flex-col sm:flex-row gap-6 items-center w-[90%] max-w-4xl">
            <div className="flex items-center gap-3 flex-1">
              <div className="text-2xl text-amber-400">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <div className="text-sm text-gray-200 mb-1">Ngày đến</div>
                <input type="date" className="search-field w-full text-black rounded px-2 py-1" />
              </div>
            </div>

            <div className="flex items-center gap-3 flex-1">
              <div className="text-2xl text-amber-400">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <div className="text-sm text-gray-200 mb-1">Ngày đi</div>
                <input type="date" className="search-field w-full text-black rounded px-2 py-1" />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-2xl text-amber-400">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <div>
                <div className="text-sm text-gray-200 mb-1">Số phòng</div>
                <select className="search-field w-32 text-black rounded px-2 py-1">
                  <option>1 Phòng</option>
                  <option>2 Phòng</option>
                  <option>3 Phòng</option>
                </select>
              </div>
            </div>

            <button className="luxury-button bg-amber-500 hover:bg-amber-400 text-black px-6 py-2 rounded-lg font-medium">
              Tìm Phòng
            </button>
          </div>
        </div>
      </div>

      {/* === ROOM SECTION === */}
      <main className="bg-dark-900">
        <section className="container py-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="luxury-header text-3xl">Đề xuất cho bạn</h2>
            <button className="luxury-button-outline">Xem tất cả</button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {hotels.map((h) => (
              <HotelCard key={h.id} hotel={h} />
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
