import { useState } from 'react'
import { useRouter } from 'next/router'
import { useAuth } from '../components/AuthProvider'
import Link from 'next/link'

export default function Register() {
  const { login } = useAuth()
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const valid = name.trim().length > 2 && email.includes('@') && password.length >= 6

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    if (!valid)
      return setError('⚠️ Vui lòng kiểm tra thông tin (Tên > 2 ký tự, Email hợp lệ, Mật khẩu ≥ 6 ký tự)')
    login({ name, email })
    router.push('/')
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-[url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80')] bg-cover bg-center">
      {/* Overlay mờ sang trọng */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-[2px]"></div>

      {/* Form */}
      <div className="relative z-10 w-full max-w-md p-10 rounded-2xl border border-amber-500/30 bg-gradient-to-b from-white/10 to-white/5 backdrop-blur-md shadow-[0_0_20px_rgba(251,191,36,0.2)] text-white">
        <h1 className="text-4xl font-semibold text-center mb-6 text-amber-400 font-[Playfair_Display] tracking-wide drop-shadow-[0_2px_6px_rgba(251,191,36,0.6)]">
          Đăng ký tài khoản
        </h1>

        {error && (
          <div className="text-sm text-red-400 bg-red-950/40 border border-red-500/30 px-3 py-2 rounded mb-4 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Họ và tên */}
          <div>
            <label className="block text-sm text-gray-300 mb-2">Họ và tên</label>
            <input
              type="text"
              placeholder="Nhập họ tên của bạn"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-white/10 border border-amber-500/30 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-400 shadow-inner transition-all duration-200"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm text-gray-300 mb-2">Email</label>
            <input
              type="email"
              placeholder="Nhập email của bạn"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-white/10 border border-amber-500/30 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-400 shadow-inner transition-all duration-200"
            />
          </div>

          {/* Mật khẩu */}
          <div>
            <label className="block text-sm text-gray-300 mb-2">Mật khẩu</label>
            <input
              type="password"
              placeholder="Tạo mật khẩu"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-white/10 border border-amber-500/30 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-400 shadow-inner transition-all duration-200"
            />
            <div className="text-xs text-gray-400 mt-1 italic">
              Mật khẩu phải có ít nhất 6 ký tự
            </div>
          </div>

          {/* Nút đăng ký */}
          <button
            disabled={!valid}
            className={`w-full py-2 mt-3 rounded-lg font-semibold text-lg transition-all duration-300 ${
              valid
                ? 'bg-gradient-to-r from-amber-400 to-yellow-500 text-black hover:shadow-[0_0_20px_rgba(251,191,36,0.5)] hover:scale-[1.02]'
                : 'bg-gray-600 text-gray-300 cursor-not-allowed'
            }`}
          >
            Đăng ký
          </button>

          {/* Chuyển sang đăng nhập */}
          <div className="text-center text-sm text-gray-400 mt-5">
            Đã có tài khoản?{' '}
            <Link
              href="/login"
              className="text-amber-400 hover:text-amber-300 transition duration-200 hover:underline"
            >
              Đăng nhập ngay
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
