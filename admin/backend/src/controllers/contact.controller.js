const Contact = require('../models/contact.model');

// Lấy tất cả contacts
exports.getAllContacts = async (req, res) => {
  try {
    const { status, limit = 50, offset = 0 } = req.query;

    const where = {};
    if (status) {
      where.status = status;
    }

    const contacts = await Contact.findAll({
      where,
      order: [['created_at', 'DESC']],
      limit: Math.min(Number(limit), 100),
      offset: Number(offset),
    });

    const total = await Contact.count({ where });

    return res.json({
      contacts,
      total,
      limit: Number(limit),
      offset: Number(offset),
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Lỗi server khi lấy danh sách liên hệ' });
  }
};

// Lấy thống kê contacts
exports.getContactStats = async (req, res) => {
  try {
    const total = await Contact.count();
    const newCount = await Contact.count({ where: { status: 'new' } });
    const readCount = await Contact.count({ where: { status: 'read' } });
    const repliedCount = await Contact.count({ where: { status: 'replied' } });

    return res.json({
      total,
      new: newCount,
      read: readCount,
      replied: repliedCount,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Lỗi server khi lấy thống kê' });
  }
};

// Lấy chi tiết một contact
exports.getContactById = async (req, res) => {
  try {
    const contactId = Number(req.params.id);

    if (isNaN(contactId) || contactId < 1) {
      return res.status(400).json({ error: 'contact_id không hợp lệ' });
    }

    const contact = await Contact.findByPk(contactId);

    if (!contact) {
      return res.status(404).json({ error: 'Không tìm thấy tin nhắn' });
    }

    // Tự động đánh dấu đã đọc
    if (contact.status === 'new') {
      contact.status = 'read';
      await contact.save();
    }

    return res.json(contact);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Lỗi server khi lấy chi tiết liên hệ' });
  }
};

// Cập nhật status contact
exports.updateContactStatus = async (req, res) => {
  try {
    const contactId = Number(req.params.id);
    const { status } = req.body;

    if (isNaN(contactId) || contactId < 1) {
      return res.status(400).json({ error: 'contact_id không hợp lệ' });
    }

    if (!['new', 'read', 'replied'].includes(status)) {
      return res.status(400).json({ error: 'Status không hợp lệ' });
    }

    const contact = await Contact.findByPk(contactId);

    if (!contact) {
      return res.status(404).json({ error: 'Không tìm thấy tin nhắn' });
    }

    contact.status = status;
    await contact.save();

    return res.json({
      message: 'Cập nhật trạng thái thành công',
      contact,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Lỗi server khi cập nhật trạng thái' });
  }
};

// Xóa contact
exports.deleteContact = async (req, res) => {
  try {
    const contactId = Number(req.params.id);

    if (isNaN(contactId) || contactId < 1) {
      return res.status(400).json({ error: 'contact_id không hợp lệ' });
    }

    const contact = await Contact.findByPk(contactId);

    if (!contact) {
      return res.status(404).json({ error: 'Không tìm thấy tin nhắn' });
    }

    await contact.destroy();

    return res.json({ message: 'Xóa tin nhắn thành công' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Lỗi server khi xóa tin nhắn' });
  }
};
