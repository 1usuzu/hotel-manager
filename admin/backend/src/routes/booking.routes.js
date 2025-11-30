const express = require("express");
const BookingController = require("../controllers/booking.controller");
const auth = require("../middleware/authMiddleware");
const allow = require("../middleware/role.middleware");

const router = express.Router();

router.get("/", auth, allow("admin"), BookingController.getAll);
router.get("/:id", auth, allow("admin"), BookingController.getById);
router.put("/:id/confirm", auth, allow("admin"), BookingController.confirmBooking);
router.put("/:id/cancel", auth, allow("admin"), BookingController.cancelBooking);
router.delete("/:id", auth, allow("admin"), BookingController.remove);

module.exports = router;
