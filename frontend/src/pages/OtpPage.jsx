import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import '@/styles/auth.css'

export default function OtpPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { email, token } = location.state || {}

  const [otp, setOtp] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (!email || !token) {
      navigate('/forgot-password')
    }
  }, [email, token, navigate])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (otp === '123456') {
      // Demo OTP đúng -> chuyển sang trang đổi pass
      navigate('/reset-password', { state: { token, email } })
    } else {
      setError('Mã OTP không chính xác (Gợi ý: 123456)')
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
          <h1 className="auth-title">Nhập mã OTP</h1>
        </div>

        <p className="text-gray-500 text-center mb-6 text-sm">
          Mã OTP đã được gửi tới <strong>{email}</strong>.
          <br />
          (Demo: Nhập 123456)
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="auth-field">
            <label>Mã OTP</label>
            <input
              type="text"
              className="auth-input text-center tracking-widest text-xl"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="123456"
              maxLength={6}
            />
          </div>

          {error && <div className="auth-error">{error}</div>}

          <button type="submit" className="auth-submit">
            Xác nhận
          </button>
        </form>
      </div>
    </div>
  )
}
