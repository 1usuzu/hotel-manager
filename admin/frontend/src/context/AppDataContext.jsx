// src/context/AppDataContext.jsx
import { createContext, useContext, useEffect, useState } from "react";

/*
  AppDataContext
  - Quản lý data rooms, bookings, users
  - Khi approve booking -> cập nhật room.status = "occupied"
  - Khi reject booking -> room.status = "available"
  - Hàm getRevenue(fromDate, toDate) trả về tổng doanh thu và chi tiết bookings trong khoảng
*/

const AppDataContext = createContext();
export const useAppData = () => useContext(AppDataContext);

// Dữ liệu mẫu
const defaultRooms = [
  { id: 1, name: "Deluxe Room", price: 1200000, status: "available" },
  { id: 2, name: "Superior Twin", price: 900000, status: "available" },
  { id: 3, name: "VIP Suite", price: 2300000, status: "available" },
];

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

const defaultUsers = [
  { id: 1, username: "admin", displayName: "Quản trị viên", role: "admin", active: true },
  { id: 2, username: "staff", displayName: "Nhân viên", role: "staff", active: true },
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

  // update room by id
  function updateRoom(id, newData) {
    setRooms((old) => old.map((r) => (r.id === id ? { ...r, ...newData } : r)));
  }

  // change user role
  function changeUserRole(userId, newRole) {
    setUsers((old) => old.map((u) => (u.id === userId ? { ...u, role: newRole } : u)));
  }

  // lock/unlock user
  function toggleUserActive(userId) {
    setUsers((old) => old.map((u) => (u.id === userId ? { ...u, active: !u.active } : u)));
  }

  // approve booking -> set booking status and set room occupied
  function approveBooking(id) {
    setBookings((old) => old.map((b) => (b.id === id ? { ...b, status: "approved" } : b)));
    const b = bookings.find((x) => x.id === id);
    if (b) updateRoom(b.roomId, { status: "occupied" });
  }

  // reject booking -> set booking status and free room
  function rejectBooking(id) {
    setBookings((old) => old.map((b) => (b.id === id ? { ...b, status: "rejected" } : b)));
    const b = bookings.find((x) => x.id === id);
    if (b) updateRoom(b.roomId, { status: "available" });
  }

  // create booking (demo)
  function createBooking(payload) {
    const id = Math.max(0, ...bookings.map((b) => b.id)) + 1;
    const newB = { id, ...payload, status: "pending" };
    setBookings((old) => [newB, ...old]);
    return newB;
  }

  // get revenue and filtered bookings between from/to (strings 'YYYY-MM-DD')
  function getRevenue(from, to) {
    // convert to Date
    const f = from ? new Date(from) : null;
    const t = to ? new Date(to) : null;

    const filtered = bookings.filter((b) => {
      // consider booking.checkIn as date
      const ci = new Date(b.checkIn);
      if (f && ci < f) return false;
      if (t && ci > t) return false;
      return b.status === "approved"; // only approved counted
    });

    const total = filtered.reduce((s, b) => s + (b.total || 0), 0);
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
        changeUserRole,
        toggleUserActive,
        getRevenue,
      }}
    >
      {children}
    </AppDataContext.Provider>
  );
}
