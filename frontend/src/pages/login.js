import { useState } from 'react'
import { useRouter } from 'next/router'
import { useAuth } from '../components/AuthProvider'
import Link from 'next/link'

export default function Login() {
  const { login } = useAuth()
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const valid = email.includes('@') && password.length >= 6

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    if (!valid) return setError('Email không hợp lệ hoặc mật khẩu quá ngắn (≥6 ký tự)')
    login({ name: email.split('@')[0] || 'Guest', email })
    router.push('/')
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-[url('https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1400&q=80')] bg-cover bg-center">
      {/* Overlay mờ sang trọng */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>

      <div className="relative z-10 w-full max-w-md bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-2xl p-8 text-white">
        <h1 className="text-3xl font-semibold text-center text-amber-400 mb-6">
          Đăng nhập tài khoản
        </h1>

        {error && (
          <div className="text-sm text-red-400 bg-red-950/30 border border-red-500/20 px-3 py-2 rounded mb-3 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <div>
            <label className="block text-sm text-gray-300 mb-2">Email</label>
            <input
              type="email"
              placeholder="Nhập email của bạn"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-white/10 border border-gray-500 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-400 transition"
            />
          </div>

          {/* Mật khẩu */}
          <div>
            <label className="block text-sm text-gray-300 mb-2">Mật khẩu</label>
            <input
              type="password"
              placeholder="Nhập mật khẩu"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-white/10 border border-gray-500 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-400 transition"
            />
            <div className="text-xs text-gray-400 mt-1 italic">
              Mật khẩu cần tối thiểu 6 ký tự
            </div>
          </div>

          {/* Nút và link */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-6">
            <button
              disabled={!valid}
              className={`w-full sm:w-auto px-6 py-2 rounded-lg font-semibold transition-all ${
                valid
                  ? 'bg-gradient-to-r from-amber-400 to-yellow-500 text-black hover:brightness-110 shadow-lg'
                  : 'bg-gray-500 text-gray-300 cursor-not-allowed'
              }`}
            >
              Đăng nhập
            </button>

            <Link
              href="/register"
              className="text-sm text-amber-400 hover:text-amber-300 transition mt-2 sm:mt-0"
            >
              Chưa có tài khoản? Đăng ký
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
