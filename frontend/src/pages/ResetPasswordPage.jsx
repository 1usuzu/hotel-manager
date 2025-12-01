import { useState, useEffect } from 'react'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { resetPassword } from '@/api/authApi'
import '@/styles/auth.css'

export default function ResetPasswordPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const [searchParams] = useSearchParams()

  // Lấy token từ state (flow demo) hoặc từ url (flow email link)
  const token = location.state?.token || searchParams.get('token')

  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!token) {
      setError('Token không hợp lệ hoặc đã hết hạn.')
    }
  }, [token])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!token) return

    if (newPassword.length < 6) {
      setError('Mật khẩu phải từ 6 ký tự trở lên')
      return
    }
    if (newPassword !== confirmPassword) {
      setError('Mật khẩu xác nhận không khớp')
      return
    }

    try {
      setLoading(true)
      setError('')
      // API resetPassword expects: { token, password, confirmPassword }
      await resetPassword({ token, password: newPassword, confirmPassword })
      setSuccess('Đổi mật khẩu thành công! Đang chuyển hướng...')
      setTimeout(() => {
        navigate('/login')
      }, 2000)
    } catch (err) {
      console.error(err)
      setError(err?.response?.data?.error || 'Lỗi khi đổi mật khẩu')
    } finally {
      setLoading(false)
    }
  }

  if (!token) {
    return (
      <div className="auth-container" style={{ backgroundImage: `url('/images/bg-login.jpg')` }}>
        <div className="auth-overlay" />
        <div className="auth-box text-center">
          <h1 className="auth-title text-red-500">Lỗi</h1>
          <p className="text-gray-600 mb-4">Liên kết đặt lại mật khẩu không hợp lệ.</p>
          <button onClick={() => navigate('/login')} className="auth-submit">
            Về trang đăng nhập
          </button>
        </div>
      </div>
    )
  }

  return (
    <div
      className="auth-container"
      style={{ backgroundImage: `url('/images/bg-login.jpg')` }}
    >
      <div className="auth-overlay" />
      <div className="auth-box">
        <h1 className="auth-title mb-6">Đặt lại mật khẩu</h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="auth-field">
            <label>Mật khẩu mới</label>
            <input
              type="password"
              className="auth-input"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
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
          {success && <div className="auth-success text-green-600 text-center font-medium">{success}</div>}

          <button
            type="submit"
            disabled={loading || !!success}
            className={`auth-submit ${loading || success ? 'auth-submit-disabled' : ''}`}
          >
            {loading ? 'Đang xử lý...' : 'Đổi mật khẩu'}
          </button>
        </form>
      </div>
    </div>
  )
}
