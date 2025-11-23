// src/features/auth/AuthProvider.jsx
import { createContext, useContext, useEffect, useState } from 'react'
import api from '@/api/apiClient'

const AuthContext = createContext(null)
const STORAGE_KEY = 'user'

export function useAuth() {
  return useContext(AuthContext)
}

function getInitialUser() {
  if (typeof window === 'undefined') return null
  const stored = localStorage.getItem(STORAGE_KEY)
  if (!stored) return null
  try {
    const parsed = JSON.parse(stored)
    if (!parsed || !parsed.token) return null
    return parsed
  } catch (e) {
    console.error('Lỗi parse user từ localStorage:', e)
    return null
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => getInitialUser())
  const [loading, setLoading] = useState(false)

  // Đồng bộ nếu có tab khác xoá user
  useEffect(() => {
    const handler = (e) => {
      if (e.key === STORAGE_KEY) {
        setUser(getInitialUser())
      }
    }
    window.addEventListener('storage', handler)
    return () => window.removeEventListener('storage', handler)
  }, [])

  // Login
  const login = async (arg1, arg2, arg3) => {
    setLoading(true)

    // Hỗ trợ cả 2 kiểu:
    // - login({ email, password, rememberMe })
    // - login(email, password, rememberMe)
    let email, password, rememberMe

    if (typeof arg1 === 'string') {
      // kiểu cũ
      email = arg1
      password = arg2
      rememberMe = arg3
    } else if (arg1 && typeof arg1 === 'object') {
      // kiểu mới
      email = arg1.email
      password = arg1.password
      rememberMe = arg1.rememberMe
    }

    try {
      const res = await api.post('/auth/login', { email, password, rememberMe })
      const data = res.data

      const authUser = {
        token: data.token,
        id: data.user.id,
        username: data.user.username,
        email: data.user.email,
        role: data.user.role,
      }

      setUser(authUser)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(authUser))

      return authUser
    } catch (err) {
      console.error('Lỗi login:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }


  // Register
  const register = async ({ username, email, password, confirmPassword }) => {
    setLoading(true)
    try {
      const res = await api.post('/auth/register', {
        username,
        email,
        password,
        confirmPassword,
      })
      return res.data
    } catch (err) {
      console.error('Lỗi register:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Logout
  const logout = () => {
    setUser(null)
    localStorage.removeItem(STORAGE_KEY)
  }

  const value = {
    user,
    loading,
    isAuthenticated: !!user?.token,
    login,
    register,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

