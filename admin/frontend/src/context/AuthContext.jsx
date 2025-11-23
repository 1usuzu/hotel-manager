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
  function login(username, password) {
    if (username === "admin" && password === "123456") {
      const user = { username: "admin", displayName: "Quản trị viên" };

      localStorage.setItem("admin_user", JSON.stringify(user));
      setCurrentUser(user);
      return { ok: true };
    }

    return { ok: false, message: "Sai tài khoản hoặc mật khẩu!" };
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
