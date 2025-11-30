// src/pages/Reports.jsx
import React, { useState } from "react";
import { useAppData } from "../context/AppDataContext";

/*
  Reports:
  - filter by date range (checkIn)
  - show summary total revenue & table of bookings filtered
  - export CSV (demo: create csv string + open in new tab)
*/

export default function Reports() {
  const { getRevenue } = useAppData();
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const { total, filtered } = getRevenue(from, to);

  function exportCSV() {
    const header = ["id,customer,roomId,checkIn,checkOut,total,status"];
    const rows = filtered.map((b) => `${b.id},"${b.customerName}",${b.roomId},${b.checkIn},${b.checkOut},${b.total},${b.status}`);
    const csv = header.concat(rows).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank");
  }

  return (
    <div>
      <h1 className="page-title">Báo cáo doanh thu</h1>
      <p className="small">Lọc theo ngày check-in (tính doanh thu cho các booking đã duyệt).</p>

      <div style={{ display: "flex", gap: 12, marginTop: 12 }}>
        <div>
          <div className="label">Từ</div>
          <input type="date" className="input" value={from} onChange={(e) => setFrom(e.target.value)} />
        </div>
        <div>
          <div className="label">Đến</div>
          <input type="date" className="input" value={to} onChange={(e) => setTo(e.target.value)} />
        </div>

        <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
          <button className="btn-outline" onClick={() => { setFrom(""); setTo(""); }}>Clear</button>
          <button className="btn-outline" onClick={() => window.location.reload()}>Refresh</button>
          <button className="btn-accept" onClick={exportCSV}>Export CSV</button>
        </div>
      </div>

      <div className="card" style={{ marginTop: 12 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div className="small">Tổng doanh thu</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: "var(--accent)" }}>{total.toLocaleString("vi-VN")}₫</div>
          </div>
        </div>

        <table className="table" style={{ marginTop: 12 }}>
          <thead><tr><th>Mã</th><th>Khách</th><th>Phòng ID</th><th>Ngày</th><th>Giá</th></tr></thead>
          <tbody>
            {filtered.map((b) => (
              <tr key={b.id}>
                <td>#{b.id}</td>
                <td>{b.customerName}</td>
                <td>{b.roomId}</td>
                <td>{b.checkIn}</td>
                <td>{b.total.toLocaleString("vi-VN")}₫</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
