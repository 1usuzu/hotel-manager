import Header from '../components/Header'
import Footer from '../components/Footer'

export default function Booking(){
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container py-12">
        <h1 className="text-2xl font-bold mb-4">Đặt phòng</h1>
        <div className="bg-white p-6 rounded shadow">Trang đặt phòng tạm (placeholder). Thêm form đặt phòng thực tế hoặc kết nối API để hoàn thiện.</div>
      </main>
      <Footer />
    </div>
  )
}
