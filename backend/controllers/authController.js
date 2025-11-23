const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const User = require('../models/User');

dotenv.config();

// Helper hash mật khẩu
async function setUserPassword(user, plainPassword) {
  const salt = await bcrypt.genSalt(10);
  const hashed = await bcrypt.hash(plainPassword, salt);
  user.password = hashed;
  await user.save();
}

// ================= REGISTER ==================
exports.register = async (req, res) => {
  try {
    const { username, email, password, confirmPassword, phone } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ error: 'Vui lòng nhập đầy đủ thông tin' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ error: 'Mật khẩu xác nhận không khớp' });
    }

    // Kiểm tra email trùng
    const exist = await User.findOne({ where: { email } });
    if (exist) return res.status(400).json({ error: 'Email đã tồn tại' });

    const hashed = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      username,
      email,
      phone: phone || null,
      password: hashed,
    });

    return res.status(201).json({
      message: 'Đăng ký thành công!',
      user: {
        id: newUser.user_id,
        username: newUser.username,
        email: newUser.email,
        phone: newUser.phone,
      },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Lỗi server khi đăng ký' });
  }
};


// ================= LOGIN ==================
exports.login = async (req, res) => {
  try {
    const { email, password, rememberMe } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ error: 'Email không tồn tại' });

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) return res.status(401).json({ error: 'Sai mật khẩu' });

    const token = jwt.sign(
      { id: Number(user.user_id), role: user.role || 'customer' },
      process.env.JWT_SECRET,
      { expiresIn: rememberMe ? '7d' : '1h' }
    );

    return res.json({
      message: 'Đăng nhập thành công!',
      token,
      user: {
        id: String(user.user_id),
        username: user.username,
        email: user.email,
        phone: user.phone,
      },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Lỗi server khi đăng nhập' });
  }
};


// ================= RESET / CHANGE PASSWORD ==================
exports.resetPassword = async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;

    if (!req.user?.id) {
      return res.status(401).json({ error: 'Chưa xác thực người dùng.' });
    }

    if (!currentPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({ error: 'Vui lòng nhập đầy đủ các trường' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ error: 'Mật khẩu mới phải dài >= 6 ký tự' });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ error: 'Mật khẩu mới và xác nhận không khớp' });
    }

    const user = await User.findByPk(req.user.id);
    if (!user) return res.status(404).json({ error: 'Không tìm thấy người dùng' });

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) return res.status(400).json({ error: 'Mật khẩu hiện tại không đúng' });

    await setUserPassword(user, newPassword);

    return res.json({ message: 'Đổi mật khẩu thành công!' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Lỗi server khi đổi mật khẩu' });
  }
};


// ================= PROFILE ==================
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: ['user_id', 'username', 'email', 'phone', 'created_at']
    });

    if (!user) return res.status(404).json({ error: 'Không tìm thấy user' });

    return res.json(user);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Lỗi server khi lấy profile' });
  }
};


// ================= UPDATE PROFILE ==================
exports.updateProfile = async (req, res) => {
  try {
    const { username, email, phone } = req.body;

    const user = await User.findByPk(req.user.id);
    if (!user) return res.status(404).json({ error: 'Không tìm thấy user' });

    if (email && email !== user.email) {
      const existed = await User.findOne({ where: { email } });
      if (existed) return res.status(400).json({ error: 'Email này đã được sử dụng' });
      user.email = email;
    }

    if (username) user.username = username;
    if (typeof phone !== 'undefined') user.phone = phone;

    await user.save();

    return res.json({
      message: 'Cập nhật hồ sơ thành công',
      user: {
        id: user.user_id,
        username: user.username,
        email: user.email,
        phone: user.phone,
      },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Lỗi server khi cập nhật hồ sơ' });
  }
};
