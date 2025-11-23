// src/api/apiClient.js
import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api',
})

api.interceptors.request.use((config) => {
  const stored = localStorage.getItem('user')
  if (stored) {
    try {
      const user = JSON.parse(stored)
      if (user.token) {
        config.headers.Authorization = `Bearer ${user.token}`
      }
    } catch (e) {
      console.error('Lỗi parse user trong apiClient', e)
    }
  }
  return config
})

export default api
