import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api',
})

api.interceptors.request.use((config) => {
  const stored = localStorage.getItem('user')
  if (stored) {
    try {
      const parsed = JSON.parse(stored)
      if (parsed.token) {
        config.headers.Authorization = `Bearer ${parsed.token}`
      }
    } catch (err) {
      console.error(err)
    }
  }
  return config
})

api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response && error.response.status === 401) {
      const data = error.response.data

      if (
        data?.errorCode === 'TOKEN_EXPIRED' ||
        data?.errorCode === 'TOKEN_INVALID'
      ) {
        console.warn('Token expired, auto logout')
        localStorage.removeItem('user')
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

export default api
