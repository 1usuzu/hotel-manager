const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const {
  getAllContacts,
  getContactStats,
  getContactById,
  updateContactStatus,
  deleteContact,
} = require('../controllers/contact.controller');

// Tất cả routes đều cần auth (admin only)
router.use(authMiddleware);

router.get('/', getAllContacts);
router.get('/stats', getContactStats);
router.get('/:id', getContactById);
router.put('/:id/status', updateContactStatus);
router.delete('/:id', deleteContact);

module.exports = router;
