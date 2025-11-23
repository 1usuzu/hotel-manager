// src/pages/HomePage.jsx
import { Link, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import Header from '@/layouts/Header'
import Footer from '@/layouts/Footer'
import HeroSection from '@/features/home/HeroSection'
import { hotels } from '@/features/hotels/data'
import { FaCalendar } from 'react-icons/fa'
import { HiUsers } from 'react-icons/hi'

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
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.97a1 1 0 0 0 .95.69h4.173c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 0 0-.364 1.118l1.287 3.97c.3.921-.755 1.688-1.54 1.118l-3.38-2.455a1 1 0 0 0-1.176 0l-3.38 2.455c-.785.57-1.84-.197-1.54-1.118l1.287-3.97a1 1 0 0 0-.364-1.118L2.06 9.397c-.783-.57-.38-1.81.588-1.81h4.173a1 1 0 0 0 .95-.69l1.286-3.97z" />
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
          <Link to={`/hotels/${hotel.id}`} className="btn-primary">
            Xem phòng
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function HomePage() {
  const navigate = useNavigate()

  const [checkIn, setCheckIn] = useState('')
  const [checkOut, setCheckOut] = useState('')
  const [roomsCount, setRoomsCount] = useState('1') // tạm dùng làm capacity

  useEffect(() => {
    document.title = 'Trang chủ | New World Saigon Hotel'
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()

    const params = new URLSearchParams()

    if (checkIn) params.set('checkIn', checkIn)
    if (checkOut) params.set('checkOut', checkOut)
    if (roomsCount) params.set('capacity', roomsCount)

    navigate(`/search?${params.toString()}`)
  }

  return (
    <div className="min-h-screen">
      {/* Header luôn fixed, trong suốt ở top */}
      <Header />
      <div className="relative">
        <HeroSection />

        <div className="absolute left-0 right-0 bottom-12 flex justify-center z-30">
          <form
            onSubmit={handleSearch}
            className="hero-search-card bg-white/10 backdrop-blur-lg p-6 rounded-xl border border-white/20 shadow-lg flex flex-col sm:flex-row gap-6 items-center w-[90%] max-w-4xl"
          >
            {/* Ngày đến */}
            <div className="flex items-center gap-3 flex-1">
              <div className="flex flex-1 flex-col">
                <div className="flex flex-row items-center justify-start gap-2 mb-[5px]">
                  <FaCalendar className="w-6 h-6 text-amber-400" />
                  <div className="text-sm text-gray-200 leading-none">
                    Ngày đến
                  </div>
                </div>

                <input
                  type="date"
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                  className="search-field w-full text-black rounded px-2 py-1"
                />
              </div>
            </div>

            {/* Ngày đi */}
            <div className="flex items-center gap-3 flex-1">
              <div className="flex flex-1 flex-col">
                <div className="flex flex-row items-center justify-start gap-2 mb-[5px]">
                  <FaCalendar className="w-6 h-6 text-amber-400" />
                  <div className="text-sm text-gray-200 leading-none">
                    Ngày đi
                  </div>
                </div>

                <input
                  type="date"
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  className="search-field w-full text-black rounded px-2 py-1"
                />
              </div>
            </div>

            {/* Số phòng */}
            <div className="flex items-center gap-3">
              <div className="flex flex-1 flex-col">
                <div className="flex flex-row items-center justify-start gap-2 mb-[5px]">
                  <HiUsers className="w-6 h-6 text-amber-400" />
                  <div className="text-sm text-gray-200 leading-none">
                    Số Người
                  </div>
                </div>

                <select
                  className="search-field w-32 text-black rounded px-2 py-1"
                  value={roomsCount}
                  onChange={(e) => setRoomsCount(e.target.value)}
                >
                  <option value="1">1 Người</option>
                  <option value="2">2 Người</option>
                  <option value="3">3 Người</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="luxury-button bg-amber-500 hover:bg-amber-400 text-black px-6 py-2 rounded-lg font-medium"
            >
              Tìm Phòng
            </button>
          </form>
        </div>
      </div>

      {/* Phần dưới mới nền tối */}
      <main className="bg-dark-900">
        <section className="layout-container py-16">
          <div className="flex items-center justify-between pt-16 mb-8">
            <h2 className="luxury-header text-3xl text-white font-bold">
              Đề xuất cho bạn
            </h2>
            <Link
              to="/search"
              className="luxury-button-outline text-white font-bold"
            >
              Xem tất cả
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 pb-8">
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
