import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import AOS from 'aos'
import 'aos/dist/aos.css'
import Header from '@/layouts/Header'
import Footer from '@/layouts/Footer'

export default function Payment() {
  const router = useRouter()
  const { amount, room } = router.query // Lấy dữ liệu truyền từ trang đặt phòng
  const [method, setMethod] = useState('momo')

  // ⚡ Hiệu ứng AOS
  useEffect(() => {
    AOS.init({ duration: 800, once: true })
  }, [])

  const paymentMethods = [
    { id: 'momo', label: 'Thanh toán qua MoMo', icon: '💜' },
    { id: 'vnpay', label: 'Thanh toán qua VNPay', icon: '💳' },
    { id: 'bank', label: 'Chuyển khoản ngân hàng (STK)', icon: '🏦' },
  ]

  const formatCurrency = (num) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(num || 0)

  const handleSubmit = (e) => {
    e.preventDefault()
    alert(`Đã chọn thanh toán bằng ${method.toUpperCase()} cho ${room || 'phòng chưa xác định'}!`)
  }

  return (
    <div className="relative min-h-screen bg-[url('https://images.unsplash.com/photo-1582719478189-894dcd622d8a?auto=format&fit=crop&w=1600&q=80')] bg-cover bg-center text-white">
      {/* Overlay sang trọng */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm"></div>

      <Header />

      <main className="relative z-10 pt-32 pb-24 container mx-auto px-6 flex flex-col items-center">
        {/* Tiêu đề */}
        <h1
          className="text-5xl font-[Playfair_Display] text-amber-400 font-bold mb-8 drop-shadow-[0_2px_10px_rgba(251,191,36,0.5)]"
          data-aos="fade-down"
        >
          Thanh toán đặt phòng
        </h1>

        <div
          className="w-full max-w-2xl bg-white/10 backdrop-blur-lg border border-amber-400/20 rounded-2xl p-8 shadow-[0_0_25px_rgba(251,191,36,0.15)]"
          data-aos="fade-up"
        >
          {/* Thông tin đặt phòng */}
          <div className="mb-8 text-center">
            <p className="text-gray-300">Phòng: {room || 'Chưa chọn'}</p>
            <h2 className="text-4xl text-amber-400 font-semibold mt-2">
              {formatCurrency(amount || 0)}
            </h2>
            <p className="text-sm text-gray-400 mt-1">(Bao gồm thuế & phí dịch vụ)</p>
          </div>

          {/* Form chọn thanh toán */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div data-aos="fade-right">
              <h3 className="text-lg font-semibold text-amber-400 mb-3">
                Chọn phương thức thanh toán:
              </h3>
              <div className="grid grid-cols-1 gap-3">
                {paymentMethods.map((m) => (
                  <label
                    key={m.id}
                    className={`flex items-center gap-3 p-4 border rounded-lg cursor-pointer transition-all ${
                      method === m.id
                        ? 'bg-amber-400/10 border-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.3)]'
                        : 'bg-white/5 border-gray-600 hover:border-amber-400/60'
                    }`}
                    onClick={() => setMethod(m.id)}
                  >
                    <span className="text-2xl">{m.icon}</span>
                    <span className="text-sm font-medium">{m.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Hiển thị phương thức chi tiết */}
            {method === 'momo' && (
              <div
                className="bg-black/30 p-5 rounded-lg border border-amber-400/20"
                data-aos="zoom-in"
              >
                <h4 className="text-amber-400 font-semibold mb-2">
                  MoMo - Thanh toán QR
                </h4>
                <p className="text-gray-300 text-sm mb-3">
                  Quét mã QR bằng ứng dụng MoMo để hoàn tất thanh toán.
                </p>
                <img
                  src="https://upload.wikimedia.org/wikipedia/vi/f/fe/MoMo_Logo.png"
                  alt="MoMo QR"
                  className="mx-auto w-32 rounded-lg bg-white p-3"
                />
                <p className="text-center text-sm mt-3 text-gray-400">
                  Ví MoMo:{' '}
                  <span className="text-amber-400 font-semibold">
                    0909 888 777
                  </span>
                </p>
              </div>
            )}

            {method === 'vnpay' && (
              <div
                className="bg-black/30 p-5 rounded-lg border border-amber-400/20"
                data-aos="zoom-in"
              >
                <h4 className="text-amber-400 font-semibold mb-2">
                  VNPay - Cổng thanh toán trực tuyến
                </h4>
                <p className="text-gray-300 text-sm mb-3">
                  Bạn sẽ được chuyển hướng đến cổng VNPay để xác nhận thanh toán.
                </p>
                <img
                  src="https://vnpay.vn/assets/images/logo-primary.svg"
                  alt="VNPay"
                  className="mx-auto w-36 bg-white p-2 rounded-lg"
                />
              </div>
            )}

            {method === 'bank' && (
              <div
                className="bg-black/30 p-5 rounded-lg border border-amber-400/20"
                data-aos="zoom-in"
              >
                <h4 className="text-amber-400 font-semibold mb-2">
                  Chuyển khoản ngân hàng
                </h4>
                <ul className="text-gray-300 text-sm space-y-2">
                  <li>
                    💳 <strong>Ngân hàng:</strong> Vietcombank – Chi nhánh Tân Bình
                  </li>
                  <li>
                    👤 <strong>Chủ tài khoản:</strong> NEW WORLD SAIGON HOTEL
                  </li>
                  <li>
                    🔢 <strong>Số tài khoản:</strong>{' '}
                    <span className="text-amber-400 font-semibold">0123 456 789</span>
                  </li>
                  <li>
                    💬 <strong>Nội dung:</strong> Thanh toan phong [{room || 'Tên khách'}]
                  </li>
                </ul>
              </div>
            )}

            {/* Nút xác nhận */}
            <div className="text-center pt-6" data-aos="fade-up">
              <button
                type="submit"
                className="px-10 py-3 bg-gradient-to-r from-amber-400 to-yellow-500 text-black font-semibold rounded-lg hover:scale-105 hover:shadow-[0_0_25px_rgba(251,191,36,0.6)] transition-all duration-300"
              >
                Xác nhận thanh toán
              </button>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  )
}
