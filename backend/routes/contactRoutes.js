const express = require('express')
const router = express.Router()
const authMiddleware = require('../middleware/authMiddleware')
const {
  createContact,
  getAllContacts,
  getContactById,
  updateContactStatus,
  deleteContact,
  getContactStats,
} = require('../controllers/contactController')

// Public route - Khách hàng gửi tin nhắn
router.post('/', createContact)

// Protected routes - Admin only
router.use(authMiddleware)

router.get('/', getAllContacts) // Lấy tất cả contacts
router.get('/stats', getContactStats) // Thống kê
router.get('/:id', getContactById) // Chi tiết contact
router.put('/:id/status', updateContactStatus) // Cập nhật status
router.delete('/:id', deleteContact) // Xóa contact

module.exports = router
