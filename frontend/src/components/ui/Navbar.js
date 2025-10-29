import Link from 'next/link';
import { useState } from 'react';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-sm shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="flex items-center">
              <img
                src="/images/logo.png"
                alt="New World Saigon Hotel"
                className="h-12 w-auto"
              />
              <div className="ml-3 text-gray-900">
                <div className="text-lg font-bold leading-none">New World</div>
                <div className="text-sm">Saigon Hotel</div>
              </div>
            </Link>
          </div>

          {/* Main Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-700 hover:text-primary px-3 py-2 text-sm font-medium">
              Trang Chủ
            </Link>
            <Link href="/rooms" className="text-gray-700 hover:text-primary px-3 py-2 text-sm font-medium">
              Phòng
            </Link>
            <Link href="/dining" className="text-gray-700 hover:text-primary px-3 py-2 text-sm font-medium">
              Ẩm Thực
            </Link>
            <Link href="/services" className="text-gray-700 hover:text-primary px-3 py-2 text-sm font-medium">
              Dịch Vụ
            </Link>
            <Link href="/meetings" className="text-gray-700 hover:text-primary px-3 py-2 text-sm font-medium">
              Hội Nghị
            </Link>
            <Link href="/special-offers" className="text-gray-700 hover:text-primary px-3 py-2 text-sm font-medium">
              Ưu Đãi
            </Link>
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/login" className="text-gray-700 hover:text-primary px-3 py-2 text-sm font-medium">
              Đăng Nhập
            </Link>
            <Link
              href="/register"
              className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-md text-sm font-medium"
            >
              Đăng Ký
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-primary"
            >
              <span className="sr-only">Open main menu</span>
              {!isMenuOpen ? (
                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link href="/" className="block text-gray-700 hover:text-primary px-3 py-2 text-base font-medium">
              Trang Chủ
            </Link>
            <Link href="/rooms" className="block text-gray-700 hover:text-primary px-3 py-2 text-base font-medium">
              Phòng
            </Link>
            <Link href="/dining" className="block text-gray-700 hover:text-primary px-3 py-2 text-base font-medium">
              Ẩm Thực
            </Link>
            <Link href="/services" className="block text-gray-700 hover:text-primary px-3 py-2 text-base font-medium">
              Dịch Vụ
            </Link>
            <Link href="/meetings" className="block text-gray-700 hover:text-primary px-3 py-2 text-base font-medium">
              Hội Nghị
            </Link>
            <Link href="/special-offers" className="block text-gray-700 hover:text-primary px-3 py-2 text-base font-medium">
              Ưu Đãi
            </Link>
          </div>
          <div className="pt-4 pb-3 border-t border-gray-200">
            <div className="flex items-center px-5">
              <Link href="/login" className="block text-gray-700 hover:text-primary px-3 py-2 text-base font-medium">
                Đăng Nhập
              </Link>
              <Link
                href="/register"
                className="block bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-md text-base font-medium"
              >
                Đăng Ký
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
