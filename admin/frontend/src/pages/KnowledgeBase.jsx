// src/pages/KnowledgeBase.jsx
import React, { useEffect, useState } from "react";
import { get, post, del } from "../api/api";

export default function KnowledgeBase() {
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(false);

  const [selectedDoc, setSelectedDoc] = useState(null);
  const [chunks, setChunks] = useState([]);

  const [newTitle, setNewTitle] = useState("");
  const [newSource, setNewSource] = useState("");
  const [newContent, setNewContent] = useState("");
  const [creating, setCreating] = useState(false);

  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadDocs();
  }, []);

  async function loadDocs() {
    setLoading(true);
    setError("");
    try {
      const data = await get("/admin/kb");
      setDocs(Array.isArray(data) ? data : []);
    } catch (e) {
      console.warn("KB load error:", e);
      setError("Không tải được danh sách tri thức từ AI service.");
    } finally {
      setLoading(false);
    }
  }

  async function openDoc(doc) {
    setSelectedDoc(doc);
    setChunks([]);
    setError("");
    try {
      const params = new URLSearchParams({
        title: doc.title,
      });
      if (doc.source) params.append("source", doc.source);

      const detail = await get(`/admin/kb/detail?${params.toString()}`);
      setChunks(Array.isArray(detail) ? detail : []);
    } catch (e) {
      console.warn("KB detail error:", e);
      setError("Không tải được chi tiết tài liệu.");
    }
  }

  async function handleCreate(e) {
    e.preventDefault();
    setError("");

    if (!newTitle.trim() || !newContent.trim()) {
      setError("Vui lòng nhập đầy đủ tiêu đề và nội dung.");
      return;
    }

    setCreating(true);
    try {
      await post("/admin/kb", {
        title: newTitle.trim(),
        source: newSource.trim() || "admin",
        content: newContent,
      });

      setNewTitle("");
      setNewSource("");
      setNewContent("");
      setSelectedDoc(null);
      setChunks([]);
      await loadDocs();
    } catch (e) {
      console.warn("KB create error:", e);
      setError("Tạo tri thức thất bại. Kiểm tra lại AI service / backend.");
    } finally {
      setCreating(false);
    }
  }

  async function handleDeleteChunk(chunkId) {
    if (!window.confirm("Xoá đoạn tri thức này?")) return;
    setError("");
    try {
      await del(`/admin/kb/${chunkId}`);

      if (selectedDoc) {
        // reload chi tiết doc hiện tại
        await openDoc(selectedDoc);
      } else {
        await loadDocs();
      }
    } catch (e) {
      console.warn("KB delete error:", e);
      setError("Không xoá được đoạn tri thức.");
    }
  }

  const filteredDocs = docs.filter((d) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      d.title.toLowerCase().includes(q) ||
      (d.source && d.source.toLowerCase().includes(q))
    );
  });

  return (
    <div>
      <h1 className="page-title">Cơ sở tri thức AI</h1>
      <p className="small">
        Quản lý nội dung mà Chatbot AI dùng để trả lời (RAG). Mỗi tài liệu sẽ
        được tách thành nhiều đoạn (chunk) và nhúng embedding ở service AI.
      </p>

      {error && (
        <div
          className="small"
          style={{ color: "#fca5a5", marginTop: 8, marginBottom: 8 }}
        >
          {error}
        </div>
      )}

      {/* Form tạo tri thức mới */}
      <div className="card" style={{ marginTop: 12, marginBottom: 16 }}>
        <h2 className="card-title">Thêm tri thức mới</h2>
        <form onSubmit={handleCreate}>
          <div style={{ display: "flex", gap: 12, marginBottom: 8 }}>
            <div style={{ flex: 2 }}>
              <label className="small">Tiêu đề</label>
              <input
                className="input"
                placeholder="VD: Quy định đặt phòng & huỷ phòng"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
              />
            </div>
            <div style={{ flex: 1 }}>
              <label className="small">Source (tuỳ chọn)</label>
              <input
                className="input"
                placeholder="VD: policy, faq..."
                value={newSource}
                onChange={(e) => setNewSource(e.target.value)}
              />
            </div>
          </div>

          <div style={{ marginBottom: 8 }}>
            <label className="small">Nội dung</label>
            <textarea
              className="input"
              rows={6}
              placeholder="Dán toàn bộ nội dung tri thức ở đây. AI sẽ tự động chia thành các đoạn phù hợp."
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
            />
          </div>

          <div
            style={{
              marginTop: 12,
              display: "flex",
              justifyContent: "flex-end",
              gap: 8,
            }}
          >
            <button
              type="button"
              className="btn-outline"
              onClick={() => {
                setNewTitle("");
                setNewSource("");
                setNewContent("");
              }}
            >
              Xoá form
            </button>
            <button type="submit" className="btn-accept" disabled={creating}>
              {creating ? "Đang lưu..." : "Lưu tri thức"}
            </button>
          </div>
        </form>
      </div>

      {/* Bộ lọc + danh sách tài liệu */}
      <div className="card">
        <div
          style={{
            marginBottom: 12,
            display: "flex",
            justifyContent: "space-between",
            gap: 12,
            alignItems: "center",
          }}
        >
          <div className="card-title">Danh sách tài liệu</div>
          <input
            className="input"
            style={{ maxWidth: 260 }}
            placeholder="Tìm theo tiêu đề / source"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {loading ? (
          <div className="small">Đang tải dữ liệu...</div>
        ) : filteredDocs.length === 0 ? (
          <div className="small">Chưa có tài liệu nào.</div>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>#</th>
                <th>Tiêu đề</th>
                <th>Source</th>
                <th>Số chunk</th>
                <th>Ngày tạo</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filteredDocs.map((doc, idx) => (
                <tr key={`${doc.title}-${doc.source}-${idx}`}>
                  <td>{idx + 1}</td>
                  <td>{doc.title}</td>
                  <td>{doc.source || "admin"}</td>
                  <td>{doc.chunks}</td>
                  <td>
                    {doc.created_at
                      ? new Date(doc.created_at).toLocaleString("vi-VN")
                      : "-"}
                  </td>
                  <td style={{ textAlign: "right" }}>
                    <button
                      className="btn-outline"
                      onClick={() => openDoc(doc)}
                    >
                      Xem chi tiết
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Chi tiết document: các chunk */}
      {selectedDoc && (
        <div className="card" style={{ marginTop: 16 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "baseline",
              gap: 8,
              marginBottom: 8,
            }}
          >
            <div>
              <div className="card-title">
                Chi tiết: {selectedDoc.title}{" "}
                <span className="small">
                  ({selectedDoc.source || "admin"})
                </span>
              </div>
              <div className="small">
                Tổng {chunks.length} đoạn. Mỗi đoạn tương ứng một embedding mà
                RAG sẽ sử dụng.
              </div>
            </div>
            <button
              className="btn-outline"
              onClick={() => {
                setSelectedDoc(null);
                setChunks([]);
              }}
            >
              Đóng
            </button>
          </div>

          {chunks.length === 0 ? (
            <div className="small">Tài liệu này hiện chưa có chunk.</div>
          ) : (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 12,
                maxHeight: 400,
                overflow: "auto",
              }}
            >
              {chunks.map((c) => (
                <div
                  key={c.id}
                  className="card"
                  style={{
                    background: "var(--glass)",
                    border: "1px solid var(--border)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: 6,
                    }}
                  >
                    <div className="small">
                      Chunk #{c.chunk_index} ·{" "}
                      {c.created_at
                        ? new Date(c.created_at).toLocaleString("vi-VN")
                        : ""}
                    </div>
                    <button
                      className="btn-outline"
                      onClick={() => handleDeleteChunk(c.id)}
                    >
                      Xoá
                    </button>
                  </div>
                  <div
                    className="small"
                    style={{ whiteSpace: "pre-wrap", lineHeight: 1.5 }}
                  >
                    {c.content}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
