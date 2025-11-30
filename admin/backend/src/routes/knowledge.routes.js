const express = require("express");
const router = express.Router();
const KnowledgeController = require("../controllers/knowledge.controller");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

const auth = require("../middleware/authMiddleware");
const authorize = require("../middleware/role.middleware");

// tất cả route đều yêu cầu admin
router.get("/", auth, authorize("admin"), KnowledgeController.getAll);

// xem chi tiết 1 document (nhiều chunk) theo title+source
router.get(
  "/detail",
  auth,
  authorize("admin"),
  KnowledgeController.getDetail
);

// xem 1 chunk theo id (optional)
router.get("/:id", auth, authorize("admin"), KnowledgeController.getById);

// tạo tài liệu mới (có thể gửi file hoặc content text)
router.post(
  "/",
  auth,
  authorize("admin"),
  upload.single("file"),
  KnowledgeController.create
);

// update 1 chunk theo id
router.put(
  "/:id",
  auth,
  authorize("admin"),
  upload.single("file"),
  KnowledgeController.update
);

// xóa 1 chunk theo id
router.delete(
  "/:id",
  auth,
  authorize("admin"),
  KnowledgeController.remove
);

module.exports = router;
