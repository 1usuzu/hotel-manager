// admin/backend/src/controllers/knowledge.controller.js
const fs = require("fs");
const axios = require("axios");

const AI_BASE_URL = process.env.AI_BASE_URL || "http://localhost:4100";
const AI_ADMIN_SECRET = process.env.AI_ADMIN_SECRET;

function aiClient() {
  return axios.create({
    baseURL: `${AI_BASE_URL}/admin/kb`,
    timeout: 10000,
    headers: {
      "x-ai-admin-secret": AI_ADMIN_SECRET,
    },
  });
}

// GET /api/admin/kb  -> list docs (group theo title+source)
exports.getAll = async (req, res) => {
  try {
    const client = aiClient();
    const response = await client.get("/");
    res.json(response.data);
  } catch (err) {
    console.error("KB getAll error:", err.response?.data || err.message);
    res.status(502).json({ error: "AI service unavailable" });
  }
};

// GET /api/admin/kb/detail?title=...&source=...
exports.getDetail = async (req, res) => {
  const { title, source } = req.query;
  if (!title) {
    return res.status(400).json({ error: "Thiếu title" });
  }
  try {
    const client = aiClient();
    const response = await client.get("/detail", {
      params: { title, source },
    });
    res.json(response.data);
  } catch (err) {
    console.error("KB getDetail error:", err.response?.data || err.message);
    res.status(502).json({ error: "AI service unavailable" });
  }
};

// GET /api/admin/kb/:id -> lấy 1 chunk theo id (nếu cần)
exports.getById = async (req, res) => {
  const { id } = req.params;
  try {
    const client = aiClient();
    const response = await client.get(`/${id}`);
    res.json(response.data);
  } catch (err) {
    if (err.response?.status === 404) {
      return res.status(404).json({ error: "Không tìm thấy tài liệu" });
    }
    console.error("KB getById error:", err.response?.data || err.message);
    res.status(502).json({ error: "AI service unavailable" });
  }
};

// POST /api/admin/kb
// Body: { title, source?, content } hoặc upload file
exports.create = async (req, res) => {
  try {
    let { title, source, content } = req.body || {};

    // Nếu gửi file (multer) mà không có content → đọc nội dung file
    if (req.file && !content) {
      const filePath = req.file.path;
      content = fs.readFileSync(filePath, "utf8");
    }

    if (!title || !content) {
      return res.status(400).json({ error: "Thiếu title hoặc content" });
    }

    const client = aiClient();
    const response = await client.post("/", {
      title,
      source,
      content,
    });

    res.status(201).json(response.data);
  } catch (err) {
    console.error("KB create error:", err.response?.data || err.message);
    res.status(502).json({ error: "AI service unavailable" });
  }
};

// PUT /api/admin/kb/:id
// Body: { content }
exports.update = async (req, res) => {
  const { id } = req.params;
  let { content } = req.body || {};

  try {
    if (req.file && !content) {
      const filePath = req.file.path;
      content = fs.readFileSync(filePath, "utf8");
    }

    if (!content) {
      return res.status(400).json({ error: "Thiếu content" });
    }

    const client = aiClient();
    const response = await client.put(`/${id}`, { content });
    res.json(response.data);
  } catch (err) {
    if (err.response?.status === 404) {
      return res.status(404).json({ error: "Không tìm thấy tài liệu" });
    }
    console.error("KB update error:", err.response?.data || err.message);
    res.status(502).json({ error: "AI service unavailable" });
  }
};

// DELETE /api/admin/kb/:id
exports.remove = async (req, res) => {
  const { id } = req.params;
  try {
    const client = aiClient();
    const response = await client.delete(`/${id}`);
    res.json(response.data);
  } catch (err) {
    if (err.response?.status === 404) {
      return res.status(404).json({ error: "Không tìm thấy tài liệu" });
    }
    console.error("KB remove error:", err.response?.data || err.message);
    res.status(502).json({ error: "AI service unavailable" });
  }
};
