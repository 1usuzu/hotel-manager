import Header from '../components/Header'
import Footer from '../components/Footer'

export default function RoomsInfo(){
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container py-12">
        <h1 className="text-2xl font-bold mb-4">Thông tin phòng</h1>
        <div className="bg-white p-6 rounded shadow">Thông tin chi tiết các loại phòng (placeholder). Bạn có thể thêm bảng so sánh tiện nghi, hình ảnh và giá.</div>
      </main>
      <Footer />
    </div>
  )
}
