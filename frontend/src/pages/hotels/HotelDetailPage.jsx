import { useParams } from 'react-router-dom'
import Header from '@/layouts/Header'
import Footer from '@/layouts/Footer'
import { findHotelById } from '@/features/hotels/data'
import RoomCard from '@/components/RoomCard'

export default function HotelDetailPage() {
  const { id } = useParams()
  const hotel = findHotelById(id)

  if (!hotel) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        Không tìm thấy khách sạn
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header  />
      <main className="max-w-6xl mx-auto px-4 py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-4">
            <div className="h-64 overflow-hidden rounded-2xl shadow-lg">
              <img
                src={hotel.image}
                alt={hotel.name}
                className="w-full h-full object-cover"
              />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">{hotel.name}</h1>
            <p className="text-gray-600">{hotel.location}</p>
            <p className="mt-4 text-gray-700">{hotel.description}</p>
          </div>

          <aside>
            <div className="bg-white p-4 rounded-2xl shadow space-y-2">
              <div className="text-lg font-bold">Thông tin nhanh</div>
              <div className="text-gray-600">
                Giá từ <strong>${hotel.price}</strong> / đêm
              </div>
              <div className="text-gray-600">
                Địa điểm: {hotel.location}
              </div>
            </div>
          </aside>
        </div>

        <section className="mt-12">
          <h2 className="text-2xl font-semibold mb-4">Danh sách phòng</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {hotel.rooms?.map((room) => (
              <RoomCard key={room.id} room={room} hotel={hotel} />
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
