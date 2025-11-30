const express = require("express");
const ReviewController = require("../controllers/review.controller");
const auth = require("../middleware/authMiddleware");
const allow = require("../middleware/role.middleware");

const router = express.Router();

router.get("/admin", auth, allow("admin"), ReviewController.getAll);
router.get("/admin/:id", auth, allow("admin"), ReviewController.getById);
router.put("/admin/:id/approve", auth, allow("admin"), ReviewController.approve);
router.put("/admin/:id/hide", auth, allow("admin"), ReviewController.hide);
router.delete("/admin/:id", auth, allow("admin"), ReviewController.remove);

module.exports = router;
