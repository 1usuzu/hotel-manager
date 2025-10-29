import { useEffect } from 'react'
import AOS from 'aos'
import 'aos/dist/aos.css'
import Header from '@/layouts/Header'
import Footer from '@/layouts/Footer'

export default function About() {
  useEffect(() => {
    AOS.init({ duration: 800, once: true })
  }, [])

  return (
    <div className="relative min-h-screen bg-[url('https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=1600&q=80')] bg-cover bg-center text-white">
      {/* Overlay đen mờ để nổi bật chữ */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm"></div>

      {/* Header giống Home */}
      <Header />

      {/* Hero Section */}
      <section className="relative z-10 pt-32 pb-20 text-center px-6">
        <h1
          className="text-5xl font-[Playfair_Display] text-amber-400 font-bold mb-4 drop-shadow-[0_2px_10px_rgba(251,191,36,0.6)]"
          data-aos="fade-down"
        >
          Về Chúng Tôi
        </h1>
        <p
          className="max-w-3xl mx-auto text-gray-300 text-lg leading-relaxed"
          data-aos="fade-up"
        >
          <strong>New World Saigon Hotel</strong> – biểu tượng của sự sang trọng và tinh tế
          tại trung tâm TP. Hồ Chí Minh. Với không gian đẳng cấp, dịch vụ chuẩn 5 sao và phong cách phục vụ tận tâm,
          chúng tôi mang đến cho du khách những trải nghiệm nghỉ dưỡng hoàn hảo nhất.
        </p>
      </section>

      {/* Phần giới thiệu chính */}
      <section className="relative z-10 container mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div data-aos="fade-right">
          <img
            src="https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1400&q=80"
            alt="Hotel Interior"
            className="rounded-2xl shadow-[0_0_25px_rgba(251,191,36,0.2)]"
          />
        </div>
        <div data-aos="fade-left">
          <h2 className="text-3xl font-[Playfair_Display] text-amber-400 mb-4">Không gian sang trọng</h2>
          <p className="text-gray-300 text-base leading-relaxed">
            Tọa lạc giữa trung tâm quận 1 sầm uất, New World Saigon Hotel là nơi giao thoa giữa hiện đại và truyền thống.
            Với hơn 500 phòng nghỉ được thiết kế tinh tế, tầm nhìn hướng ra công viên Tao Đàn, khách sạn là điểm đến lý tưởng cho du khách trong nước và quốc tế.
          </p>
          <p className="text-gray-400 mt-3 text-sm italic">
            “Chúng tôi không chỉ mang đến nơi nghỉ ngơi, mà là một hành trình tận hưởng đẳng cấp.”
          </p>
        </div>
      </section>

      {/* Tầm nhìn & Sứ mệnh */}
      <section className="relative z-10 bg-black/40 backdrop-blur-md py-20">
        <div className="container mx-auto px-6 text-center">
          <h2
            className="text-4xl font-[Playfair_Display] text-amber-400 mb-8"
            data-aos="fade-down"
          >
            Tầm nhìn & Sứ mệnh
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 text-gray-300">
            <div
              className="bg-white/5 p-6 rounded-xl border border-amber-400/20 shadow-[0_0_20px_rgba(251,191,36,0.15)]"
              data-aos="fade-right"
            >
              <h3 className="text-amber-400 text-xl mb-3">🌟 Tầm nhìn</h3>
              <p>
                Trở thành biểu tượng hàng đầu của sự đẳng cấp trong ngành khách sạn Việt Nam,
                mang đến trải nghiệm đáng nhớ, nơi mỗi khoảnh khắc đều được chăm chút hoàn hảo.
              </p>
            </div>
            <div
              className="bg-white/5 p-6 rounded-xl border border-amber-400/20 shadow-[0_0_20px_rgba(251,191,36,0.15)]"
              data-aos="fade-left"
            >
              <h3 className="text-amber-400 text-xl mb-3">💎 Sứ mệnh</h3>
              <p>
                Cung cấp dịch vụ tiêu chuẩn quốc tế, đề cao sự tinh tế và cá nhân hóa trải nghiệm của khách hàng,
                đồng thời phát triển bền vững và gìn giữ giá trị văn hóa Việt.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Đội ngũ & phong cách phục vụ */}
      <section className="relative z-10 container mx-auto px-6 py-20 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div data-aos="fade-right">
          <h2 className="text-3xl font-[Playfair_Display] text-amber-400 mb-4">
            Đội ngũ chuyên nghiệp
          </h2>
          <p className="text-gray-300 text-base leading-relaxed">
            Mỗi thành viên trong đội ngũ của New World Saigon Hotel đều được đào tạo bài bản,
            chuyên nghiệp và tận tâm. Chúng tôi tin rằng dịch vụ xuất sắc bắt đầu từ những con người xuất sắc.
          </p>
          <p className="text-gray-400 mt-3 text-sm italic">
            “Nụ cười của bạn là niềm tự hào của chúng tôi.”
          </p>
        </div>
        <div data-aos="fade-left">
          <img
            src="https://images.unsplash.com/photo-1621426954616-1a0d89338a2a?auto=format&fit=crop&w=1400&q=80"
            alt="Hotel Staff"
            className="rounded-2xl shadow-[0_0_25px_rgba(251,191,36,0.2)]"
          />
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 bg-gradient-to-r from-amber-500/10 to-yellow-500/10 backdrop-blur-md text-center py-20 border-t border-amber-400/30">
        <h2
          className="text-3xl md:text-4xl font-[Playfair_Display] text-amber-400 mb-6"
          data-aos="fade-up"
        >
          Trải nghiệm sự đẳng cấp tại New World Saigon Hotel
        </h2>
        <button
          data-aos="zoom-in"
          className="px-10 py-3 bg-gradient-to-r from-amber-400 to-yellow-500 text-black font-semibold rounded-lg hover:scale-105 hover:shadow-[0_0_25px_rgba(251,191,36,0.6)] transition-all duration-300"
        >
          Đặt phòng ngay
        </button>
      </section>

      <Footer />
    </div>
  )
}
