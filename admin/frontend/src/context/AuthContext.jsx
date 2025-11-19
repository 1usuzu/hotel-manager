// src/context/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from "react";

/*
  AuthContext: quản lý đăng nhập
  - Lưu user vào localStorage (client-side demo)
  - KHÔNG hiển thị credentials ở giao diện
  - Có 2 account demo (admin / staff) nhưng không show công khai
*/

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);

  // Load currentUser khi app mount (nếu đã login trước đó)
  useEffect(() => {
    try {
      const raw = localStorage.getItem("admin_user");
      if (raw) setCurrentUser(JSON.parse(raw));
    } catch (e) {
      setCurrentUser(null);
    }
  }, []);

  // login: trả về { ok: boolean, message?: string }
  function login(username, password) {
    // NOTE: Demo auth cục bộ. Khi có backend -> gọi API ở đây.
    if (username === "admin" && password === "123456") {
      const user = { username: "admin", role: "admin", displayName: "Quản trị viên" };
      localStorage.setItem("admin_user", JSON.stringify(user));
      setCurrentUser(user);
      return { ok: true };
    }
    if (username === "staff" && password === "staff123") {
      const user = { username: "staff", role: "staff", displayName: "Nhân viên" };
      localStorage.setItem("admin_user", JSON.stringify(user));
      setCurrentUser(user);
      return { ok: true };
    }
    // nếu sai credentials
    return { ok: false, message: "Sai tài khoản hoặc mật khẩu" };
  }

  // logout: xóa localStorage và set currentUser = null
  function logout() {
    localStorage.removeItem("admin_user");
    setCurrentUser(null);
    // reload để ProtectedRoute chuyển về login
    window.location.reload();
  }

  return (
    <AuthContext.Provider value={{ currentUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
