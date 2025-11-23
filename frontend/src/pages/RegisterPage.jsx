import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/features/auth/AuthProvider'
import '@/styles/auth.css'

export default function RegisterPage() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const valid =
    name.trim().length > 2 && email.includes('@') && password.length >= 6

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!valid) {
      setError('Tên > 2 ký tự, email hợp lệ và mật khẩu >= 6 ký tự')
      return
    }

    try {
      setError('')
      await register(name, email, password, password)
      navigate('/login')
    } catch (err) {
      console.error(err)
      const msg =
        err?.response?.data?.error || 'Đăng ký thất bại, vui lòng thử lại'
      setError(msg)
    }
  }

  return (
    <div
      className="auth-container"
      style={{ backgroundImage: `url('/images/hotel2.jpg')` }}
    >
      <div className="auth-overlay" />
      <div className="auth-box">
        <h1 className="auth-title">Đăng ký</h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="auth-field">
            <label>Họ tên</label>
            <input
              type="text"
              className="auth-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nguyễn Văn A"
            />
          </div>

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

          {error && <div className="auth-error">{error}</div>}

          <button
            type="submit"
            disabled={!valid}
            className={`auth-submit ${
              !valid ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            Đăng ký
          </button>
        </form>

        <div className="auth-subtext">
          Đã có tài khoản?{' '}
          <Link to="/login" className="auth-link">
            Đăng nhập ngay
          </Link>
        </div>
      </div>
    </div>
  )
}
