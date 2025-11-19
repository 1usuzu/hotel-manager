// ===============================
// Dashboard tổng quan
// ===============================

import React from "react";
import { useAppData } from "../context/AppDataContext";

export default function Dashboard() {
  const { rooms, bookings } = useAppData();

  return (
    <div>
      <h1 className="page-title">Tổng quan</h1>

      <div className="dash-grid">
        <div className="card">
          <div className="card-title">Tổng số phòng</div>
          <div className="card-number">{rooms.length}</div>
        </div>

        <div className="card">
          <div className="card-title">Đơn đang chờ</div>
          <div className="card-number">
            {bookings.filter((b) => b.status === "pending").length}
          </div>
        </div>

        <div className="card">
          <div className="card-title">Phòng trống</div>
          <div className="card-number">
            {rooms.filter((r) => r.status === "available").length}
          </div>
        </div>
      </div>
    </div>
  );
}
