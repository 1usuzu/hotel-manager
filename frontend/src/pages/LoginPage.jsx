// src/pages/LoginPage.jsx
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/features/auth/AuthProvider'
import '@/styles/auth.css'

export default function LoginPage() {
  const { login, loading } = useAuth()
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [error, setError] = useState('')

  const valid = email.includes('@') && password.length >= 6

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!valid) {
      setError('Email phải chứa @ và mật khẩu >= 6 ký tự')
      return
    }

    try {
      setError('')
      await login(email, password, rememberMe) // vẫn giữ kiểu cũ
      navigate('/')
    } catch (err) {
      console.error(err)
      const msg =
        err?.response?.data?.error ||
        'Đăng nhập thất bại, vui lòng thử lại'
      setError(msg)
    }
  }

  return (

    <div
      className="auth-container"
      style={{ backgroundImage: `url('/images/bg-login.jpg')` }}
    >
      <div className="auth-overlay" />
      <div className="auth-box">
        <div className="title relative flex items-center justify-center w-full">
          <button
            onClick={() => navigate(-1)}
            className="absolute left-0 p-2 mb-3 rounded-full border border-gray-200 text-gray-600 hover:text-black hover:border-gray-400 transition"
            aria-label="Go back"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              className="w-5 h-5"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 18l-6-6 6-6" />
            </svg>
          </button>

          <h1 className="auth-title">Đăng nhập</h1>
        </div>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="auth-field">
            <label>Email</label>
            <input
              type="email"
              className="auth-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@mail.com"
            />
          </div>

          <div className="auth-field">
            <label>Mật khẩu</label>
            <input
              type="password"
              className="auth-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>

          <div className="auth-remember">
            <div>
              <input
                id="rememberMe"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <label htmlFor="rememberMe">Ghi nhớ đăng nhập</label>
            </div>
            <Link to="/forgot-password" className="text-sm text-amber-600 hover:text-amber-700">
              Quên mật khẩu?
            </Link>
          </div>

          {error && <div className="auth-error">{error}</div>}

          <button
            type="submit"
            disabled={!valid || loading}
            className={`auth-submit ${
              !valid || loading ? 'auth-submit-disabled' : ''
            }`}
          >
            {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
          </button>
        </form>

        <div className="auth-subtext">
          Chưa có tài khoản?{' '}
          <Link to="/register" className="auth-link">
            Đăng ký ngay
          </Link>
        </div>
      </div>
    </div>
  )
}
