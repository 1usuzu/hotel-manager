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
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')


  const valid =
    name.trim().length > 2 &&
    email.includes('@') &&
    password.length >= 6 &&
    confirmPassword.length >= 6 &&
    password === confirmPassword

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!valid) {
      setError('Thông tin không hợp lệ hoặc mật khẩu không khớp')
      return
    }

    try {
      setError('')
      await register({ username: name, email, password, confirmPassword })
      navigate('/login')
    } catch (err) {
      console.error(err)
      const msg =
        err?.response?.data?.error ||
        'Đăng ký thất bại, vui lòng thử lại'
      setError(msg)
    }
  }

  return (
    <div
      className="auth-container"
      style={{ backgroundImage: `url('images/bg-login.jpg')` }}
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

          <h1 className="auth-title">Đăng ký</h1>
        </div>

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

          <div className="auth-field">
            <label>Xác nhận mật khẩu</label>
            <input
              type="password"
              className="auth-input"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
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
