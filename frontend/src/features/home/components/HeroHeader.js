import { useState } from 'react'
import Link from 'next/link'

const MENU = [
  { key: 'home', label: 'Trang chủ', href: '/' },
  { key: 'booking', label: 'Đặt phòng', href: '/hotels' },
  { key: 'search', label: 'Tìm phòng', href: '/search' },
  { key: 'services', label: 'Dịch vụ', href: '/services' },
  { key: 'support', label: 'Hỗ trợ', href: '/support' }
]

export default function HeroHeader(){
  const [active, setActive] = useState(null)

  function createRipple(e){
    const el = e.currentTarget
    const rect = el.getBoundingClientRect()
    const circle = document.createElement('span')
    const size = Math.max(rect.width, rect.height)
    circle.style.width = circle.style.height = `${size}px`
    circle.style.left = `${e.clientX - rect.left - size/2}px`
    circle.style.top = `${e.clientY - rect.top - size/2}px`
    circle.className = 'ripple'
    el.classList.add('ripple-wrapper')
    el.appendChild(circle)
    setTimeout(()=>{ circle.remove() }, 650)
  }

  return (
    <header className="absolute inset-x-0 top-4 z-30">
      <div className="container flex items-center justify-between text-white">
        {/* left: small logo */}
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-white/10 rounded flex items-center justify-center text-white font-bold">NW</div>
            <div className="sr-only">New World Saigon Hotel</div>
          </Link>
        </div>

        {/* center: refined menu */}
        <nav className="menu-bar">
          <ul className="flex items-center gap-4 text-white/95 text-sm">
            {MENU.map(m => (
              <li key={m.key} className={`nav-item`}>
                <Link href={m.href} className="nav-link px-3 py-1 rounded" onClick={() => setActive(m.key)} onMouseDown={createRipple}>
                  <span className="label">{m.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* right: auth */}
        <div className="flex items-center gap-3">
          <Link href="/login" className="text-white/90 hover:underline" onMouseDown={createRipple}>Đăng nhập</Link>
          <Link href="/register" className="bg-white/10 text-white px-3 py-1 rounded" onMouseDown={createRipple}>Đăng ký</Link>
        </div>
      </div>
    </header>
  )
}
