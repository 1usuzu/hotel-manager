// src/pages/Users.jsx
import React from "react";
import { useAppData } from "../context/AppDataContext";

/*
  Users:
  - Hiển thị users từ context
  - Cho phép đổi role (admin/staff) và khoá/mở tài khoản
*/

export default function Users() {
  const { users, changeUserRole, toggleUserActive } = useAppData();

  return (
    <div>
      <h1 className="page-title">Người dùng & phân quyền</h1>
      <p className="small">Quản lý account hệ thống (demo local). Thay đổi role ảnh hưởng quyền trên UI (ví dụ duyệt booking).</p>

      <div className="card" style={{ marginTop: 12 }}>
        <table className="table">
          <thead><tr><th>#</th><th>Username</th><th>Display</th><th>Role</th><th>Active</th><th></th></tr></thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td>{u.id}</td>
                <td>{u.username}</td>
                <td>{u.displayName}</td>
                <td>
                  <select className="input" value={u.role} onChange={(e) => changeUserRole(u.id, e.target.value)}>
                    <option value="admin">admin</option>
                    <option value="staff">staff</option>
                  </select>
                </td>
                <td style={{ color: u.active ? "#10b981" : "#ef4444", fontWeight: 700 }}>{u.active ? "Active" : "Locked"}</td>
                <td style={{ textAlign: "right" }}>
                  <button className="btn-outline" onClick={() => toggleUserActive(u.id)}>{u.active ? "Khoá" : "Mở"}</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
