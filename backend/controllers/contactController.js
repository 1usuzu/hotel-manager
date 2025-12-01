const Contact = require('../models/Contact')

// Tạo contact mới (public - không cần auth)
exports.createContact = async (req, res) => {
  try {
    let { name, email, message } = req.body

    // Trim inputs
    name = name?.trim()
    email = email?.trim().toLowerCase()
    message = message?.trim()

    // Validate required fields
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Vui lòng nhập đầy đủ thông tin' })
    }

    // Validate name
    if (name.length < 2 || name.length > 100) {
      return res.status(400).json({ error: 'Tên phải từ 2-100 ký tự' })
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Email không hợp lệ' })
    }

    // Validate message
    if (message.length < 10 || message.length > 2000) {
      return res.status(400).json({ error: 'Nội dung phải từ 10-2000 ký tự' })
    }

    // Tạo contact
    const contact = await Contact.create({
      name,
      email,
      message,
      status: 'new',
    })

    return res.status(201).json({
      message: 'Gửi tin nhắn thành công! Chúng tôi sẽ liên hệ lại sớm.',
      contact: {
        contact_id: contact.contact_id,
        name: contact.name,
        email: contact.email,
        created_at: contact.created_at,
      },
    })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'Lỗi server khi gửi tin nhắn' })
  }
}

// Lấy tất cả contacts (admin only)
exports.getAllContacts = async (req, res) => {
  try {
    const { status, limit = 50, offset = 0 } = req.query

    const where = {}
    if (status) {
      where.status = status
    }

    const contacts = await Contact.findAll({
      where,
      order: [['created_at', 'DESC']],
      limit: Math.min(Number(limit), 100),
      offset: Number(offset),
    })

    const total = await Contact.count({ where })

    return res.json({
      contacts,
      total,
      limit: Number(limit),
      offset: Number(offset),
    })
  } catch (err) {
    console.error(err)
    return res
      .status(500)
      .json({ error: 'Lỗi server khi lấy danh sách liên hệ' })
  }
}

// Lấy chi tiết một contact (admin only)
exports.getContactById = async (req, res) => {
  try {
    const contactId = Number(req.params.id)

    if (isNaN(contactId) || contactId < 1) {
      return res.status(400).json({ error: 'contact_id không hợp lệ' })
    }

    const contact = await Contact.findByPk(contactId)

    if (!contact) {
      return res.status(404).json({ error: 'Không tìm thấy tin nhắn' })
    }

    // Tự động đánh dấu đã đọc
    if (contact.status === 'new') {
      contact.status = 'read'
      await contact.save()
    }

    return res.json(contact)
  } catch (err) {
    console.error(err)
    return res
      .status(500)
      .json({ error: 'Lỗi server khi lấy chi tiết liên hệ' })
  }
}

// Cập nhật status contact (admin only)
exports.updateContactStatus = async (req, res) => {
  try {
    const contactId = Number(req.params.id)
    const { status } = req.body

    if (isNaN(contactId) || contactId < 1) {
      return res.status(400).json({ error: 'contact_id không hợp lệ' })
    }

    if (!['new', 'read', 'replied'].includes(status)) {
      return res.status(400).json({ error: 'Status không hợp lệ' })
    }

    const contact = await Contact.findByPk(contactId)

    if (!contact) {
      return res.status(404).json({ error: 'Không tìm thấy tin nhắn' })
    }

    contact.status = status
    await contact.save()

    return res.json({
      message: 'Cập nhật trạng thái thành công',
      contact,
    })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'Lỗi server khi cập nhật trạng thái' })
  }
}

// Xóa contact (admin only)
exports.deleteContact = async (req, res) => {
  try {
    const contactId = Number(req.params.id)

    if (isNaN(contactId) || contactId < 1) {
      return res.status(400).json({ error: 'contact_id không hợp lệ' })
    }

    const contact = await Contact.findByPk(contactId)

    if (!contact) {
      return res.status(404).json({ error: 'Không tìm thấy tin nhắn' })
    }

    await contact.destroy()

    return res.json({ message: 'Xóa tin nhắn thành công' })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'Lỗi server khi xóa tin nhắn' })
  }
}

// Thống kê contacts (admin only)
exports.getContactStats = async (req, res) => {
  try {
    const total = await Contact.count()
    const newCount = await Contact.count({ where: { status: 'new' } })
    const readCount = await Contact.count({ where: { status: 'read' } })
    const repliedCount = await Contact.count({ where: { status: 'replied' } })

    return res.json({
      total,
      new: newCount,
      read: readCount,
      replied: repliedCount,
    })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'Lỗi server khi lấy thống kê' })
  }
}
