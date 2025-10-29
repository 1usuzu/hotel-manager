import Header from '../components/Header'
import Footer from '../components/Footer'

export default function Availability(){
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container py-12">
        <h1 className="text-2xl font-bold mb-4">Tìm phòng trống</h1>
        <div className="bg-white p-6 rounded shadow">Trang tìm phòng trống (placeholder). Dùng form tìm kiếm để lọc phòng trống.</div>
      </main>
      <Footer />
    </div>
  )
}
