// src/api/authApi.js
import api from './apiClient'

// Lấy thông tin profile user hiện tại
export async function getProfile() {
  const res = await api.get('/auth/profile')
  return res.data
}

// Cập nhật thông tin hồ sơ (Họ và tên, email, SĐT)
export async function updateProfile(payload) {
  const res = await api.put('/auth/profile', payload)
  return res.data
}

// Đổi mật khẩu (chung 1 API duy nhất)
export async function changePassword(payload) {
  const res = await api.put('/auth/reset-password', payload)
  return res.data
}

// Quên mật khẩu
export async function forgotPassword(email) {
  const res = await api.post('/auth/forgot-password', { email })
  return res.data
}

// Reset mật khẩu với token
export async function resetPassword(payload) {
  const res = await api.post('/auth/reset-password', payload)
  return res.data
}
