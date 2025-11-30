// src/pages/Rooms.jsx
import React, { useMemo, useState } from "react";
import { useAppData } from "../context/AppDataContext";
import { get, patch, put, del } from "../api/api";

export default function Rooms() {
  const { rooms, refreshData } = useAppData();
  const [q, setQ] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  // Availability Check
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [availableIds, setAvailableIds] = useState(null); // null = not checking

  // Edit Modal
  const [editingRoom, setEditingRoom] = useState(null);
  const [editForm, setEditForm] = useState({
    // name, type, price, ...
    image: null,
    imageFile: null,   // file mới upload
  });


  const checkAvailability = async () => {
    if (!fromDate || !toDate) return alert("Chọn ngày bắt đầu và kết thúc");
    const res = await get(`/admin/rooms/available?from=${fromDate}&to=${toDate}`);
    if (res) {
      setAvailableIds(res.map(r => r.room_id));
    }
  };

  const clearAvailability = () => {
    setFromDate("");
    setToDate("");
    setAvailableIds(null);
  };

  const handleToggle = async (id) => {
    try {
      await patch(`/admin/rooms/${id}/toggle`);
      refreshData();
    } catch (e) {
      alert("Lỗi khi đổi trạng thái");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn chắc chắn muốn xóa phòng này?")) return;
    try {
      await del(`/admin/rooms/${id}`);
      refreshData();
    } catch (e) {
      alert("Lỗi khi xóa phòng");
    }
  };

  const startEdit = (room) => {
    setEditingRoom(room);
    setEditForm({
      ...room,
      imageFile: null,
    });
  };

  const saveEdit = async () => {
    try {
      const formData = new FormData();
      formData.append("room_number", editForm.name);
      formData.append("type", editForm.type);
      formData.append("price", editForm.price);
      formData.append("capacity", editForm.capacity || "");
      formData.append("description", editForm.description || "");
      formData.append("status", editForm.status || "");

      if (editForm.imageFile) {
        formData.append("image", editForm.imageFile);
      }

      await put(`/admin/rooms/${editingRoom.id}`, formData);

      setEditingRoom(null);
      refreshData();
    } catch (e) {
      alert("Lỗi cập nhật");
    }
  };


  const list = useMemo(() => {
    return rooms.filter((r) => {
      if (q && !r.name.toLowerCase().includes(q.toLowerCase())) return false;
      if (statusFilter && r.status !== statusFilter) return false;
      if (availableIds !== null && !availableIds.includes(r.id)) return false;
      return true;
    });
  }, [rooms, q, statusFilter, availableIds]);

  return (
    <div>
      <h1 className="page-title">Quản lý phòng</h1>

      {/* Filters & Availability */}
      <div className="card" style={{ marginBottom: 12, padding: 12 }}>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
          <input className="input" placeholder="Tìm tên phòng..." value={q} onChange={(e) => setQ(e.target.value)} />
          <select className="input" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="">-- Tất cả trạng thái --</option>
            <option value="available">Available</option>
            <option value="booked">Booked</option>
            <option value="maintenance">Maintenance</option>
          </select>

          <div style={{ display: "flex", gap: 8, alignItems: "center", borderLeft: "1px solid #eee", paddingLeft: 12 }}>
            <span>Check trống:</span>
            <input type="date" className="input" value={fromDate} onChange={e => setFromDate(e.target.value)} />
            <span>-</span>
            <input type="date" className="input" value={toDate} onChange={e => setToDate(e.target.value)} />
            <button className="btn-accept" onClick={checkAvailability}>Check</button>
            {availableIds !== null && <button className="btn-outline" onClick={clearAvailability}>X</button>}
          </div>

          <div style={{ marginLeft: "auto" }}>
             <button className="btn-accept" onClick={refreshData}>Refresh</button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="card">
        <table className="table">
          <thead><tr><th>Mã</th><th>Tên</th><th>Loại</th><th>Giá</th><th>Sức chứa</th><th>Trạng thái</th><th>Hành động</th></tr></thead>
          <tbody>
            {list.map((r) => (
              <tr key={r.id}>
                <td>#{r.id}</td>
                <td>{r.name}</td>
                <td>{r.type}</td>
                <td>{r.price.toLocaleString("vi-VN")}₫</td>
                <td>{r.capacity}</td>
                <td>
                  <span style={{
                    fontWeight: 700,
                    color: r.status === "available" ? "#10b981" : (r.status === "booked" ? "#fbbf24" : "#ef4444")
                  }}>
                    {r.status === "booked" ? "Occupied" : r.status}
                  </span>
                </td>
                <td>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button className="btn-outline" onClick={() => handleToggle(r.id)}>
                      {r.status === "available" ? "Khóa" : "Mở"}
                    </button>
                    <button className="btn-outline" onClick={() => startEdit(r)}>Sửa</button>
                    <button className="btn-outline" style={{ color: "red", borderColor: "red" }} onClick={() => handleDelete(r.id)}>Xóa</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      {editingRoom && (
        <div className="modal-overlay">
          <div className="modal text-black">
            <h2>Sửa phòng {editingRoom.name}</h2>
            <div style={{ display: "grid", gap: 12 }}>
              <label>Ảnh phòng
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    setEditForm((prev) => ({
                      ...prev,
                      imageFile: file,
                    }));
                  }}
                />
              </label>

              {(editForm.image || editForm.imageFile) && (
                <div>
                  <p>Preview:</p>
                  <img
                    src={
                      editForm.imageFile
                        ? URL.createObjectURL(editForm.imageFile)
                        : editForm.image?.startsWith("http")
                        ? editForm.image
                        : (import.meta.env.VITE_API_BASE_URL || "http://localhost:4001/api").replace(/\/api$/, "") +
                          editForm.image
                    }
                    alt="Room"
                    style={{ width: 200, height: 120, objectFit: "cover", borderRadius: 8 }}
                  />
                </div>
              )}

              <label>Tên phòng <input className="input" value={editForm.name} onChange={e => setEditForm({...editForm, name: e.target.value})} /></label>
              <label>Loại <input className="input" value={editForm.type} onChange={e => setEditForm({...editForm, type: e.target.value})} /></label>
              <label>Giá <input type="number" className="input" value={editForm.price} onChange={e => setEditForm({...editForm, price: e.target.value})} /></label>
              <label>Sức chứa <input type="number" className="input" value={editForm.capacity} onChange={e => setEditForm({...editForm, capacity: e.target.value})} /></label>
              <label>Trạng thái
                <select className="input" value={editForm.status} onChange={e => setEditForm({...editForm, status: e.target.value})}>
                  <option value="available">Available</option>
                  <option value="booked">Booked</option>
                  <option value="maintenance">Maintenance</option>
                </select>
              </label>
            </div>
            <div style={{ marginTop: 20, display: "flex", gap: 12, justifyContent: "flex-end" }}>
              <button className="btn-outline" onClick={() => setEditingRoom(null)}>Hủy</button>
              <button className="btn-accept" onClick={saveEdit}>Lưu</button>
            </div>
          </div>
        </div>
      )}
      <style>{`
        .modal-overlay { position: fixed; top:0; left:0; right:0; bottom:0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justifyContent: center; z-index: 1000; }
        .modal { background: white; padding: 20px; border-radius: 8px; width: 400px; max-width: 90%; }
      `}</style>
    </div>
  );
}
