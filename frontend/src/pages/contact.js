import { useState, useEffect } from 'react'
import AOS from 'aos'
import 'aos/dist/aos.css'
import Header from '@/layouts/Header'
import Footer from '@/layouts/Footer'

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    AOS.init({ duration: 800, once: true })
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.message)
      return alert('Vui lòng điền đầy đủ thông tin liên hệ!')
    setSuccess(true)
    setForm({ name: '', email: '', message: '' })
  }

  return (
    <div className="relative min-h-screen bg-[url('https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1600&q=80')] bg-cover bg-center text-white">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm"></div>

      <Header />

      {/* Hero */}
      <section className="relative z-10 text-center pt-32 pb-16 px-6">
        <h1
          className="text-5xl font-[Playfair_Display] text-amber-400 font-bold drop-shadow-[0_2px_10px_rgba(251,191,36,0.6)]"
          data-aos="fade-down"
        >
          Liên hệ với chúng tôi
        </h1>
        <p
          className="max-w-2xl mx-auto text-gray-300 text-lg mt-4"
          data-aos="fade-up"
        >
          Chúng tôi luôn sẵn sàng hỗ trợ bạn 24/7.
          Hãy để <strong>New World Saigon Hotel</strong> đồng hành cùng trải nghiệm của bạn!
        </p>
      </section>

      {/* Thông tin liên hệ */}
      <section className="relative z-10 container mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
        <div
          className="bg-white/10 backdrop-blur-md p-6 rounded-xl border border-amber-400/20 shadow-[0_0_20px_rgba(251,191,36,0.15)]"
          data-aos="fade-right"
        >
          <div className="text-4xl mb-3">📍</div>
          <h3 className="text-amber-400 font-semibold text-lg mb-2">Địa chỉ</h3>
          <p className="text-gray-300 text-sm leading-relaxed">
            18A Cộng Hòa, Phường 4, Quận Tân Bình, TP. Hồ Chí Minh
          </p>
        </div>

        <div
          className="bg-white/10 backdrop-blur-md p-6 rounded-xl border border-amber-400/20 shadow-[0_0_20px_rgba(251,191,36,0.15)]"
          data-aos="fade-up"
        >
          <div className="text-4xl mb-3">📞</div>
          <h3 className="text-amber-400 font-semibold text-lg mb-2">Hotline</h3>
          <p className="text-gray-300 text-sm">(+84) 909 888 777</p>
          <p className="text-gray-400 text-xs mt-1">Hoạt động 24/7</p>
        </div>

        <div
          className="bg-white/10 backdrop-blur-md p-6 rounded-xl border border-amber-400/20 shadow-[0_0_20px_rgba(251,191,36,0.15)]"
          data-aos="fade-left"
        >
          <div className="text-4xl mb-3">📧</div>
          <h3 className="text-amber-400 font-semibold text-lg mb-2">Email</h3>
          <p className="text-gray-300 text-sm">info@newworldhotel.vn</p>
          <p className="text-gray-400 text-xs mt-1">Phản hồi trong vòng 24h</p>
        </div>
      </section>

      {/* Form liên hệ */}
      <section
        className="relative z-10 container mx-auto px-6 py-16 max-w-2xl text-center"
        data-aos="zoom-in"
      >
        <h2 className="text-3xl font-[Playfair_Display] text-amber-400 mb-8">
          Gửi tin nhắn cho chúng tôi
        </h2>

        {success ? (
          <div className="p-6 bg-green-500/20 border border-green-400 rounded-xl text-green-300 mb-8">
            ✅ Cảm ơn bạn! Tin nhắn của bạn đã được gửi thành công.
            Chúng tôi sẽ liên hệ sớm nhất.
          </div>
        ) : null}

        <form onSubmit={handleSubmit} className="space-y-5 text-left">
          <div>
            <label className="block text-sm mb-1 text-gray-300">Họ và tên</label>
            <input
              type="text"
              className="w-full p-3 rounded-lg bg-white/10 border border-amber-400/20 focus:border-amber-400 focus:ring-amber-400 text-white outline-none"
              placeholder="Nhập họ tên của bạn..."
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm mb-1 text-gray-300">Email</label>
            <input
              type="email"
              className="w-full p-3 rounded-lg bg-white/10 border border-amber-400/20 focus:border-amber-400 focus:ring-amber-400 text-white outline-none"
              placeholder="Địa chỉ email của bạn..."
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm mb-1 text-gray-300">Nội dung</label>
            <textarea
              rows={5}
              className="w-full p-3 rounded-lg bg-white/10 border border-amber-400/20 focus:border-amber-400 focus:ring-amber-400 text-white outline-none"
              placeholder="Nhập nội dung tin nhắn..."
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
            />
          </div>

          <div className="text-center pt-4">
            <button
              type="submit"
              className="px-10 py-3 bg-gradient-to-r from-amber-400 to-yellow-500 text-black font-semibold rounded-lg hover:scale-105 hover:shadow-[0_0_25px_rgba(251,191,36,0.6)] transition-all duration-300"
            >
              Gửi tin nhắn
            </button>
          </div>
        </form>
      </section>

      {/* Google Map */}
      <section className="relative z-10 w-full h-[400px]" data-aos="fade-up">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.193759912125!2d106.660172074517!3d10.796345089347095!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752ecdf3eb2dbf%3A0x2e86ac8ef70b1a3f!2sNew%20World%20Saigon%20Hotel!5e0!3m2!1svi!2s!4v1709999999999!5m2!1svi!2s"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="rounded-t-2xl shadow-[0_0_30px_rgba(251,191,36,0.2)]"
        ></iframe>
      </section>

      <Footer />
    </div>
  )
}
