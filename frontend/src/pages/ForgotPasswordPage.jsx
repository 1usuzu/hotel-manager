import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '@/styles/auth.css';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api';

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: nhập email, 2: nhập token + password
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [resetCode, setResetCode] = useState(''); // Lưu mã để hiển thị
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRequestToken = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!email || !email.includes('@')) {
      setError('Vui lòng nhập email hợp lệ');
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post(`${API_BASE}/auth/forgot-password`, { email });

      // Lưu mã để hiển thị
      if (res.data.resetToken) {
        setResetCode(res.data.resetToken);
      }

      setMessage(res.data.message);
      setStep(2);
    } catch (err) {
      setError(err?.response?.data?.error || 'Lỗi khi gửi yêu cầu');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!token || !newPassword || !confirmPassword) {
      setError('Vui lòng nhập đầy đủ thông tin');
      return;
    }

    if (newPassword.length < 6) {
      setError('Mật khẩu phải có ít nhất 6 ký tự');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Mật khẩu xác nhận không khớp');
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post(`${API_BASE}/auth/reset-password-token`, {
        email,
        token,
        newPassword,
        confirmPassword,
      });

      setMessage(res.data.message);

      // Chuyển về trang login sau 2s
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setError(err?.response?.data?.error || 'Lỗi khi đặt lại mật khẩu');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="auth-container"
      style={{ backgroundImage: `url('/images/bg-login.jpg')` }}
    >
      <div className="auth-overlay" />
      <div className="auth-box">
        <div className="title relative flex items-center justify-center w-full">
          <button
            onClick={() => step === 1 ? navigate(-1) : setStep(1)}
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

          <h1 className="auth-title">
            {step === 1 ? 'Quên mật khẩu' : 'Đặt lại mật khẩu'}
          </h1>
        </div>

        {step === 1 ? (
          <form onSubmit={handleRequestToken} className="space-y-5">
            <p className="text-sm text-gray-600 text-center mb-4">
              Nhập email của bạn để nhận mã xác thực
            </p>

            <div className="auth-field">
              <label>Email</label>
              <input
                type="email"
                className="auth-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@mail.com"
                disabled={loading}
              />
            </div>

            {error && <div className="auth-error">{error}</div>}
            {message && <div className="text-green-600 text-sm text-center">{message}</div>}

            <button
              type="submit"
              disabled={loading}
              className={`auth-submit ${loading ? 'auth-submit-disabled' : ''}`}
            >
              {loading ? 'Đang gửi...' : 'Gửi mã xác thực'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleResetPassword} className="space-y-5">
            {resetCode && (
              <div className="bg-green-50 border-2 border-green-500 rounded-lg p-6 mb-6">
                <p className="text-base font-semibold text-green-700 text-center mb-4">
                  Mã xác thực đã được tạo. Vui lòng kiểm tra email.
                </p>
                <div className="bg-white rounded-lg p-6 border-2 border-green-400 shadow-sm">
                  <p className="text-sm font-bold text-gray-700 text-center mb-3 tracking-wide">
                    MÃ XÁC THỰC CỦA BẠN
                  </p>
                  <p className="text-5xl font-bold text-center text-green-600 tracking-widest mb-2">
                    {resetCode}
                  </p>
                </div>
                <p className="text-sm text-green-700 text-center mt-4 font-medium">
                  Vui lòng nhập mã vào ô bên dưới
                </p>
              </div>
            )}

            <div className="auth-field">
              <label>Mã xác thực (6 chữ số)</label>
              <input
                type="text"
                className="auth-input"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="Nhập mã 6 số"
                maxLength={6}
                disabled={loading}
              />
            </div>

            <div className="auth-field">
              <label>Mật khẩu mới</label>
              <input
                type="password"
                className="auth-input"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
                disabled={loading}
              />
            </div>

            <div className="auth-field">
              <label>Xác nhận mật khẩu mới</label>
              <input
                type="password"
                className="auth-input"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                disabled={loading}
              />
            </div>

            {error && <div className="auth-error">{error}</div>}

            <button
              type="submit"
              disabled={loading}
              className={`auth-submit ${loading ? 'auth-submit-disabled' : ''}`}
            >
              {loading ? 'Đang xử lý...' : 'Đặt lại mật khẩu'}
            </button>
          </form>
        )}

        <div className="auth-subtext">
          Nhớ mật khẩu?{' '}
          <Link to="/login" className="auth-link">
            Đăng nhập ngay
          </Link>
        </div>
      </div>
    </div>
  );
}
