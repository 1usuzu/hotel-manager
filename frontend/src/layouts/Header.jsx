import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useTheme } from '@/features/theme/ThemeProvider'
import { useAuth } from '@/features/auth/AuthProvider'

export default function Header() {
  const { user, logout } = useAuth() || {}
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()

  // Trang hotel detail: /hotels/:id
  const isHotelPage = location.pathname.startsWith('/hotels')
  const isBookingPage = location.pathname.startsWith('/booking')
  const isUserPage = location.pathname.startsWith('/user')



  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 80)
    handleScroll()
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const headerClass = isHotelPage || isBookingPage || isUserPage
    ? 'bg-black/80 backdrop-blur-md shadow-md py-3'
    : scrolled
    ? 'bg-black/70 backdrop-blur-md shadow-md py-3'
    : 'bg-transparent py-4'

  return (
    <header
      style={{ position: 'fixed', top: 0, left: 0, right: 0 }}
      className={`z-[9999] transition-all duration-300 ${headerClass} text-white`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between ">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <span className="text-2xl"></span>
          <Link
            to="/"
            className="text-xl font-semibold tracking-wide text-amber-400 hover:text-amber-300 transition"
          >
            New World Saigon Hotel
          </Link>
        </div>

        {/* Menu ngang (PC) */}
        <nav className="hidden md:flex gap-8 text-sm font-medium">
          <Link to="/" className="hover:text-amber-400 transition">
            Trang chủ
          </Link>
          <Link to="/services" className="hover:text-amber-400 transition">
            Dịch vụ
          </Link>
          <Link to="/search" className="hover:text-amber-400 transition">
            Tìm phòng
          </Link>
          <Link to="/reviews" className="hover:text-amber-400 transition">
            Đánh giá
          </Link>
          <Link to="/about" className="hover:text-amber-400 transition">
            Giới thiệu
          </Link>
          <Link to="/contact" className="hover:text-amber-400 transition">
            Liên hệ
          </Link>
        </nav>

        {/* Khu vực auth (PC) */}
        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <>
              <Link
                to="/user"
                className="text-sm text-gray-100 hover:text-amber-400 transition"
              >
                Xin chào, {user.username || user.email}
              </Link>
              <button
                onClick={logout}
                className="px-4 py-1.5 text-sm rounded-full...amber-400 hover:bg-amber-400 hover:text-black transition-colors"
              >
                Đăng xuất
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-sm hover:text-amber-400 transition"
              >
                Đăng nhập
              </Link>
              <Link
                to="/register"
                className="text-sm px-4 py-1.5 rounded-full bg-amber-400 text-black font-semibold hover:bg-amber-300 transition"
              >
                Đăng ký
              </Link>
            </>
          )}
        </div>

        {/* Nút menu mobile */}
        <button
          className="md:hidden flex items-center justify-center w-10 h-10 rounded-full border border-white/30"
          onClick={() => setMenuOpen((prev) => !prev)}
        >
          <svg
            className="w-5 h-5"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            {menuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Menu mobile */}
      {menuOpen && (
        <div className="md:hidden bg-black/85 backdrop-blur-lg px-6 pb-6 border-t border-gray-700">
          <ul className="flex flex-col gap-3 text-gray-200 mt-3">
            <Link
              to="/"
              className="hover:text-amber-400 transition"
              onClick={() => setMenuOpen(false)}
            >
              Trang chủ
            </Link>
            <Link
              to="/services"
              className="hover:text-amber-400 transition"
              onClick={() => setMenuOpen(false)}
            >
              Dịch vụ
            </Link>
            <Link
              to="/search"
              className="hover:text-amber-400 transition"
              onClick={() => setMenuOpen(false)}
            >
              Tìm phòng
            </Link>
            <Link
              to="/reviews"
              className="hover:text-amber-400 transition"
              onClick={() => setMenuOpen(false)}
            >
              Đánh giá
            </Link>
            <Link
              to="/contact"
              className="hover:text-amber-400 transition"
              onClick={() => setMenuOpen(false)}
            >
              Liên hệ
            </Link>
            <Link
              to="/about"
              className="hover:text-amber-400 transition"
              onClick={() => setMenuOpen(false)}
            >
              Giới thiệu
            </Link>
            <div className="mt-3 border-t border-gray-700 pt-3">
              {user ? (
                <>
                  <Link
                    to="/user"
                    onClick={() => setMenuOpen(false)}
                    className="block text-sm mb-2 text-amber-300 hover:text-amber-200 transition"
                  >
                    Đang đăng nhập: {user.username || user.email}
                  </Link>
                  <button
                    onClick={() => {
                      logout()
                      setMenuOpen(false)
                    }}
                    className="w-full py-2 rounded-lg border-2 border-black bg-amber-400 text-black text-sm font-semibold hover:bg-amber-300 transition"
                  >
                    Đăng xuất
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setMenuOpen(false)}
                    className="block w-full py-2 rounded-lg bg-amber-400 text-black text-sm font-medium text-center hover:bg-amber-300 transition"
                  >
                    Đăng nhập
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMenuOpen(false)}
                    className="block w-full border border-amber-400 text-amber-400 text-sm font-medium py-2 rounded-lg hover:bg-amber-500 hover:text-black transition text-center mt-2"
                  >
                    Đăng ký
                  </Link>
                </>
              )}
            </div>
          </ul>
        </div>
      )}
    </header>
  )
}
