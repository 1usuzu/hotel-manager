import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  function handle(e) {
    e.preventDefault();
    setErr("");
    setLoading(true);

    const u = e.target.username.value.trim();
    const p = e.target.password.value.trim();

    setTimeout(() => {
      const res = login(u, p);
      setLoading(false);

      if (!res.ok) {
        setErr(res.message);
        return;
      }

      window.location.href = "/"; // chuyển sang admin ngay
    }, 500);
  }

  return (
    <div className="login-container">
      <div className="login-card premium animated-card">

        <h1 className="login-heading">HOTEL ADMIN PANEL</h1>
        <p className="login-title">Đăng nhập hệ thống</p>

        <form onSubmit={handle} style={{ marginTop: 20 }}>

          {/* USERNAME FIELD */}
          <div className="v3-field">
            <input
              name="username"
              className="v3-input"
              placeholder=" "
              required
            />
            <label className="v3-label">Tài khoản</label>
          </div>

          {/* PASSWORD FIELD */}
          <div className="v3-field" style={{ marginTop: 18 }}>
            <input
              name="password"
              type="password"
              className="v3-input"
              placeholder=" "
              required
            />
            <label className="v3-label">Mật khẩu</label>
          </div>

          {err && <div className="err">{err}</div>}

          <button className="btn-primary" disabled={loading} style={{ marginTop: 22 }}>
            {loading ? "Đang xử lý…" : "Đăng nhập"}
          </button>

        </form>
      </div>
    </div>
  );
}
