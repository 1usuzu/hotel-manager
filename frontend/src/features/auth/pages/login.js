import Header from '@/layouts/Header'
import Footer from '@/layouts/Footer'
import Link from 'next/link'
import { useState } from 'react'
import { useAuth } from '@/features/auth/AuthProvider'
import '@/styles/auth.css'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const { login } = useAuth()

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')

    if (!email.includes('@') || password.length < 6) {
      setError('Email hoặc mật khẩu không hợp lệ')
      return
    }

    login({ email, name: email.split('@')[0] })
  }

  return (
    <div className="auth-container" style={{
      backgroundImage: `url('/images/hotel1.jpg')`
    }}>
      <div className="auth-box">
        <h1 className="auth-title">Đăng Nhập</h1>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <label className="auth-label">Email</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="auth-input"
            placeholder="your@email.com"
            required
          />

          <label className="auth-label">Mật khẩu</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="auth-input"
            placeholder="••••••••"
            required
          />

          <button type="submit" className="auth-button">
            Đăng nhập
          </button>
        </form>

        <div className="auth-separator">hoặc</div>

        <button className="auth-social-button">
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="currentColor" d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"/>
          </svg>
          Đăng nhập với Google
        </button>

        <button className="auth-social-button">
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="currentColor" d="M12 2C6.477 2 2 6.477 2 12c0 4.237 2.636 7.855 6.356 9.312-.088-.791-.167-2.005.035-2.868.181-.78 1.172-4.97 1.172-4.97s-.299-.6-.299-1.486c0-1.39.806-2.428 1.81-2.428.852 0 1.264.64 1.264 1.408 0 .858-.546 2.14-.828 3.33-.236.995.5 1.807 1.48 1.807 1.778 0 3.144-1.874 3.144-4.58 0-2.393-1.72-4.068-4.177-4.068-2.845 0-4.515 2.135-4.515 4.34 0 .859.331 1.781.745 2.281a.3.3 0 0 1 .069.288l-.278 1.133c-.044.183-.145.223-.335.134-1.249-.581-2.03-2.407-2.03-3.874 0-3.154 2.292-6.052 6.608-6.052 3.469 0 6.165 2.473 6.165 5.776 0 3.447-2.173 6.22-5.19 6.22-1.013 0-1.965-.525-2.291-1.148l-.623 2.378c-.226.869-.835 1.958-1.244 2.621.937.29 1.931.446 2.962.446 5.523 0 10-4.477 10-10S17.523 2 12 2z"/>
          </svg>
          Đăng nhập với Facebook
        </button>

        <p className="text-center mt-6">
          <span className="text-gray-400">Chưa có tài khoản? </span>
          <Link href="/register" className="auth-link">
            Đăng ký ngay
          </Link>
        </p>
      </div>
    </div>
  )
}
