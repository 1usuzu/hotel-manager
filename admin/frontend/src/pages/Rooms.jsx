// src/pages/Rooms.jsx
import React, { useMemo, useState } from "react";
import { useAppData } from "../context/AppDataContext";

/*
  Rooms page: thêm search & filter
*/
export default function Rooms() {
  const { rooms, updateRoom } = useAppData();
  const [q, setQ] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const list = useMemo(() => {
    return rooms.filter((r) => {
      if (q && !r.name.toLowerCase().includes(q.toLowerCase())) return false;
      if (statusFilter && r.status !== statusFilter) return false;
      return true;
    });
  }, [rooms, q, statusFilter]);

  return (
    <div>
      <h1 className="page-title">Quản lý phòng</h1>
      <div style={{ display: "flex", gap: 12, marginTop: 12 }}>
        <input className="input" placeholder="Tìm phòng..." value={q} onChange={(e) => setQ(e.target.value)} />
        <select className="input" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="">Tất cả</option>
          <option value="available">Còn trống</option>
          <option value="occupied">Đang có khách</option>
          <option value="maintenance">Bảo trì</option>
        </select>
        <div style={{ marginLeft: "auto" }}><button className="btn-outline" onClick={() => { setQ(""); setStatusFilter(""); }}>Clear</button></div>
      </div>

      <div className="card" style={{ marginTop: 12 }}>
        <table className="table">
          <thead><tr><th>Mã</th><th>Tên</th><th>Giá</th><th>Trạng thái</th><th></th></tr></thead>
          <tbody>
            {list.map((r) => (
              <tr key={r.id}>
                <td>#{r.id}</td>
                <td>{r.name}</td>
                <td>{r.price.toLocaleString("vi-VN")}₫</td>
                <td style={{ fontWeight: 700, color: r.status === "available" ? "#10b981" : (r.status === "occupied" ? "#fbbf24" : "#ef4444") }}>{r.status}</td>
                <td style={{ textAlign: "right" }}>
                  <button className="btn-outline" onClick={() => {
                    const newStatus = r.status === "available" ? "occupied" : "available";
                    updateRoom(r.id, { status: newStatus });
                  }}>{r.status === "available" ? "Đặt thuê (demo)" : "Giải phóng (demo)"}</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
