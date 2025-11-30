const express = require("express");
const UserController = require("../controllers/user.controller");
const auth = require("../middleware/authMiddleware");
const allow = require("../middleware/role.middleware");

const router = express.Router();


router.get("/", auth, allow("admin"), UserController.getAll);
router.get("/:id", auth, allow("admin"), UserController.getById);
router.post("/", auth, allow("admin"), UserController.create);
router.put("/:id", auth, allow("admin"), UserController.update);
router.delete("/:id", auth, allow("admin"), UserController.remove);

module.exports = router;
