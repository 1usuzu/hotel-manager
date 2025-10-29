import { createContext, useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/router'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)

  useEffect(() => {
    try {
      const raw = localStorage.getItem('hotel_user')
      if (raw) setUser(JSON.parse(raw))
    } catch (e) {
      // ignore
    }
  }, [])

  const login = ({ name, email }) => {
    const u = { name, email }
    localStorage.setItem('hotel_user', JSON.stringify(u))
    setUser(u)
  }

  const logout = () => {
    localStorage.removeItem('hotel_user')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
