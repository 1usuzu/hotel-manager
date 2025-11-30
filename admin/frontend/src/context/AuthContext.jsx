// src/context/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);

  // Load lại user khi reload trang
  useEffect(() => {
    const raw = localStorage.getItem("admin_user");
    if (raw) {
      try {
        setCurrentUser(JSON.parse(raw));
      } catch {
        setCurrentUser(null);
      }
    }
  }, []);

  // LOGIN – chỉ 1 tài khoản admin

  async function login(username, password) {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        return { ok: false, message: data.message || "Đăng nhập thất bại" };
      }

      // Lưu user + token
      const userData = { ...data.user, token: data.token };
      localStorage.setItem("admin_user", JSON.stringify(userData));
      setCurrentUser(userData);
      return { ok: true };

    } catch (err) {
      console.error("Login error", err);
      return { ok: false, message: "Lỗi kết nối server" };
    }
  }

  // LOGOUT
  function logout() {
    localStorage.removeItem("admin_user");
    setCurrentUser(null);
    window.location.reload();
  }

  return (
    <AuthContext.Provider value={{ currentUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
