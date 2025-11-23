// src/context/AppDataContext.jsx
import { createContext, useContext, useEffect, useState } from "react";

const AppDataContext = createContext();
export const useAppData = () => useContext(AppDataContext);

// Dữ liệu mẫu
const defaultRooms = [
  { id: 1, name: "Deluxe Room", price: 1200000, status: "available" },
  { id: 2, name: "Superior Twin", price: 900000, status: "available" },
  { id: 3, name: "VIP Suite", price: 2300000, status: "available" },
];

// Demo bookings
const defaultBookings = [
  {
    id: 101,
    customerName: "Nguyễn Văn A",
    roomId: 1,
    checkIn: "2025-12-01",
    checkOut: "2025-12-03",
    status: "pending",
    total: 2400000,
  },
  {
    id: 102,
    customerName: "Trần Thị B",
    roomId: 2,
    checkIn: "2025-11-20",
    checkOut: "2025-11-22",
    status: "approved",
    total: 1800000,
  },
];

// ⚠️ Không phân quyền → chỉ 1 admin duy nhất
const defaultUsers = [
  { id: 1, username: "admin", displayName: "Quản trị viên", active: true },
];

export function AppDataProvider({ children }) {
  const [rooms, setRooms] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    setRooms(defaultRooms);
    setBookings(defaultBookings);
    setUsers(defaultUsers);
  }, []);

  // Cập nhật 1 phòng theo ID
  function updateRoom(id, newData) {
    setRooms((old) => old.map((r) => (r.id === id ? { ...r, ...newData } : r)));
  }

  // Khóa/Mở user (vẫn giữ lại vì ông chưa bảo bỏ)
  function toggleUserActive(userId) {
    setUsers((old) =>
      old.map((u) => (u.id === userId ? { ...u, active: !u.active } : u))
    );
  }

  // Approve booking
  function approveBooking(id) {
    setBookings((old) =>
      old.map((b) => (b.id === id ? { ...b, status: "approved" } : b))
    );

    const b = bookings.find((x) => x.id === id);
    if (b) updateRoom(b.roomId, { status: "occupied" });
  }

  // Reject booking
  function rejectBooking(id) {
    setBookings((old) =>
      old.map((b) => (b.id === id ? { ...b, status: "rejected" } : b))
    );

    const b = bookings.find((x) => x.id === id);
    if (b) updateRoom(b.roomId, { status: "available" });
  }

  // Tạo booking
  function createBooking(data) {
    const id = Math.max(0, ...bookings.map((b) => b.id)) + 1;
    const newBooking = { id, ...data, status: "pending" };
    setBookings((old) => [newBooking, ...old]);
    return newBooking;
  }

  // Thống kê doanh thu
  function getRevenue(from, to) {
    const f = from ? new Date(from) : null;
    const t = to ? new Date(to) : null;

    const filtered = bookings.filter((b) => {
      const ci = new Date(b.checkIn);
      if (f && ci < f) return false;
      if (t && ci > t) return false;
      return b.status === "approved";
    });

    const total = filtered.reduce((sum, b) => sum + (b.total || 0), 0);
    return { total, filtered };
  }

  return (
    <AppDataContext.Provider
      value={{
        rooms,
        bookings,
        users,
        updateRoom,
        approveBooking,
        rejectBooking,
        createBooking,
        toggleUserActive,
        getRevenue,
      }}
    >
      {children}
    </AppDataContext.Provider>
  );
}
