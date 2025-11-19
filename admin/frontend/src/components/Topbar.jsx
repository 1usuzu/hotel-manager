import React from "react";
import { useAuth } from "../context/AuthContext";

export default function Topbar() {
  const { logout, currentUser } = useAuth();

  return (
    <div className="topbar">
      <div className="top-title">Quản trị khách sạn</div>
      <div className="top-user">{currentUser.username}</div>
      <button className="btn-outline" onClick={logout}>Đăng xuất</button>
    </div>
  );
}
