import Link from 'next/link'
import { useAuth } from './AuthProvider'
import { useState, useEffect } from 'react'

export default function Header() {
  const { user, logout } = useAuth() || {}
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  const MENU = [
    { key: 'home', label: 'Trang chủ', href: '/' },
    { key: 'booking', label: 'Đặt phòng', href: '/hotels' },
    { key: 'search', label: 'Tìm phòng', href: '/search' },
    { key: 'services', label: 'Dịch vụ', href: '/services' },
    { key: 'support', label: 'Hỗ trợ', href: '/support' }
  ]

  useEffect(()=>{
    function onScroll(){ setScrolled(window.scrollY > 12) }
    onScroll()
    window.addEventListener('scroll', onScroll)
    return ()=> window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className={`fixed left-0 right-0 z-40 transition-all ${scrolled? 'backdrop-blur-md bg-white/70 shadow-sm':'bg-transparent'}`}>
      <div className="container py-3 flex items-center justify-between">
        {/* compact left logo */}
        <div className="flex items-center gap-3">
          <Link href="/" className="brand-font text-lg text-sky-600 font-semibold">New World</Link>
        </div>

        {/* desktop menu */}
        <nav className="hidden md:block">
          <ul className="flex items-center gap-6">
            {MENU.map(m => (
              <li key={m.key} className="nav-item">
                <Link href={m.href} className="nav-link text-sm text-gray-700 px-2 py-1">{m.label}</Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* right: auth compact + mobile toggle */}
        <div className="flex items-center gap-3">
          <div className="hidden md:block">
            {user ? (
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-700">Xin chào, {user.name}</span>
                <button onClick={() => logout()} className="text-sm px-3 py-1 bg-slate-100 rounded">Đăng xuất</button>
              </div>
            ) : (
              <div className="flex gap-2">
                <Link href="/login" className="px-3 py-1 bg-sky-600 text-white rounded">Đăng nhập</Link>
                <Link href="/register" className="px-3 py-1 border rounded">Đăng ký</Link>
              </div>
            )}
          </div>

          <button aria-expanded={open} aria-label="Menu" className="md:hidden p-2 rounded bg-white/10" onClick={()=>setOpen(v=>!v)}>
            <svg className="w-6 h-6 text-gray-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {open ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /> : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
            </svg>
          </button>
        </div>
      </div>

      {/* mobile menu panel */}
      <div className={`md:hidden transition-max-h duration-300 overflow-hidden ${open? 'max-h-96':'max-h-0'}`}>
        <div className="px-4 pb-4">
          <ul className="flex flex-col gap-2">
            {MENU.map(m => (
              <li key={m.key}>
                <Link href={m.href} className="block px-3 py-2 rounded bg-white/5">{m.label}</Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </header>
  )
}
