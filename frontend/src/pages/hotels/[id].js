import Header from '../../components/Header'
import Footer from '../../components/Footer'
import { findHotelById } from '../../data/hotels'
import RoomCard from '../../components/RoomCard'
import { useRouter } from 'next/router'

export default function HotelPage(){
  const router = useRouter()
  const { id } = router.query
  const hotel = findHotelById(id)

  if(!hotel) return (
    <div className="min-h-screen flex items-center justify-center">Không tìm thấy khách sạn</div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <div className="h-64 overflow-hidden rounded">
              <img src={`/images/hotel-${hotel.id}.svg`} alt={hotel.name} className="w-full h-full object-cover" onError={(e)=>{ e.currentTarget.src = hotel.image }} />
            </div>
            <h1 className="text-3xl font-bold mt-4">{hotel.name}</h1>
            <p className="text-gray-600">{hotel.location}</p>
            <p className="mt-4 text-gray-700">Tổng quan: khách sạn với {hotel.rooms.length} loại phòng, rating {hotel.rating} sao.</p>

            <h2 className="text-2xl font-semibold mt-6">Các phòng</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
              {hotel.rooms.map(r=> (
                <RoomCard key={r.id} room={r} hotel={hotel} />
              ))}
            </div>
          </div>

          <aside>
            <div className="bg-white p-4 rounded shadow">
              <div className="text-lg font-bold">Thông tin nhanh</div>
              <div className="mt-2 text-gray-600">Giá từ <strong>${hotel.price}</strong> / đêm</div>
              <div className="mt-2 text-gray-600">Địa điểm: {hotel.location}</div>
            </div>
          </aside>
        </div>
      </main>
      <Footer />
    </div>
  )
}
