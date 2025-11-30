const User = require("../models/user.model");

// Lấy tất cả user
exports.getAll = async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Lấy 1 user theo id
exports.getById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: "Không tìm thấy user" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Tạo user
exports.create = async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.status(201).json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Cập nhật user
exports.update = async (req, res) => {
  try {
    const [updated] = await User.update(req.body, {
      where: { user_id: req.params.id }
    });

    if (!updated) return res.status(404).json({ message: "Không tìm thấy user" });

    res.json({ message: "Cập nhật thành công" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Xóa user
exports.remove = async (req, res) => {
  try {
    const deleted = await User.destroy({
      where: { user_id: req.params.id }
    });

    if (!deleted) return res.status(404).json({ message: "Không tìm thấy user" });

    res.json({ message: "Đã xóa user" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
