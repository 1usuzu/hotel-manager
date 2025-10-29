import Link from 'next/link'
import { useAuth } from '@/features/auth/AuthProvider'
import { useState, useEffect } from 'react'

export default function Header() {
  const { user, logout } = useAuth() || {}
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 w-full z-[99999] transition-all duration-500 ${
        scrolled ? 'bg-black/70 backdrop-blur-md shadow-md' : 'bg-transparent'
      } text-white`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between px-8 py-4">
        {/* 🏨 Logo */}
        <div className="flex items-center gap-2">
          <span className="text-2xl">🏨</span>
          <Link
            href="/"
            className="text-xl font-semibold tracking-wide text-amber-400 hover:text-amber-300 transition"
          >
            New World Saigon Hotel
          </Link>
        </div>

        {/* 🧭 Menu ngang (PC) */}
        <nav className="hidden md:flex gap-8 text-sm font-medium">
          <Link href="/" className="hover:text-amber-400 transition">
            Trang chủ
          </Link>
          <Link href="/services" className="hover:text-amber-400 transition">
            Dịch vụ
          </Link>
          <Link href="/search" className="hover:text-amber-400 transition">
            Tìm phòng
          </Link>
          <Link href="/reviews" className="hover:text-amber-400 transition">
            Đánh giá
          </Link>
          <Link href="/payment" className="hover:text-amber-400 transition">
            Thanh toán
          </Link>
          <Link href="/about" className="hover:text-amber-400 transition">
            Giới thiệu
          </Link>
          <Link href="/contact" className="hover:text-amber-400 transition">
            Liên hệ
          </Link>
        </nav>

        {/* 👤 Auth (PC) */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <>
              <span className="text-sm text-gray-200">
                Xin chào, {user.name}
              </span>
              <button
                onClick={logout}
                className="text-sm px-3 py-1 bg-amber-500 text-black rounded-lg hover:bg-amber-400 transition"
              >
                Đăng xuất
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="px-4 py-2 bg-amber-500 text-black font-medium rounded-lg hover:bg-amber-400 transition"
              >
                Đăng nhập
              </Link>
              <Link
                href="/register"
                className="px-4 py-2 border border-amber-500 rounded-lg text-amber-400 hover:bg-amber-500 hover:text-black transition font-medium"
              >
                Đăng ký
              </Link>
            </>
          )}
        </div>

        {/* 🍔 Hamburger menu (Mobile) */}
        <button
          aria-expanded={menuOpen}
          aria-label="Menu"
          onClick={() => setMenuOpen((prev) => !prev)}
          className="md:hidden p-2 rounded bg-white/10 hover:bg-white/20 transition"
        >
          <svg
            className="w-6 h-6 text-white"
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

      {/* 📱 Menu mobile */}
      {menuOpen && (
        <div className="md:hidden bg-black/85 backdrop-blur-lg px-6 pb-6 border-t border-gray-700">
          <ul className="flex flex-col gap-3 text-gray-200 mt-3">
            <Link href="/" className="hover:text-amber-400 transition">
              Trang chủ
            </Link>
            <Link href="/services" className="hover:text-amber-400 transition">
              Dịch vụ
            </Link>
            <Link href="/search" className="hover:text-amber-400 transition">
              Tìm phòng
            </Link>
            <Link href="/reviews" className="hover:text-amber-400 transition">
              Đánh giá
            </Link>
            <Link href="/payment" className="hover:text-amber-400 transition">
              Thanh toán
            </Link>
            <Link href="/about" className="hover:text-amber-400 transition">
              Giới thiệu
            </Link>
            <Link href="/contact" className="hover:text-amber-400 transition">
              Liên hệ
            </Link>

            {/* Auth mobile */}
            <div className="mt-4 border-t border-gray-600 pt-3">
              {user ? (
                <button
                  onClick={logout}
                  className="w-full bg-amber-500 text-black font-medium py-2 rounded-lg hover:bg-amber-400 transition"
                >
                  Đăng xuất
                </button>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="block w-full bg-amber-500 text-black font-medium py-2 rounded-lg hover:bg-amber-400 transition text-center"
                  >
                    Đăng nhập
                  </Link>
                  <Link
                    href="/register"
                    className="block w-full border border-amber-500 text-amber-400 font-medium py-2 rounded-lg hover:bg-amber-500 hover:text-black transition text-center mt-2"
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
