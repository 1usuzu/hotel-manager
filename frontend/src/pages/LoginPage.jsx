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
      style={{ backgroundImage: `url('/images/hotel1.jpg')` }}
    >
      <div className="auth-overlay" />
      <div className="auth-box">
        <h1 className="auth-title">Đăng nhập</h1>

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
            <input
              id="rememberMe"
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
            <label htmlFor="rememberMe">Ghi nhớ đăng nhập</label>
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
