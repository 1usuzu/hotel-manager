const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const User = require('../models/User');

dotenv.config();

// Đăng ký
exports.register = async (req, res) => {
  try {
    const { username, email, password, confirmPassword } = req.body;

    // Kiểm tra confirmPassword
    if (typeof confirmPassword === 'undefined') {
      return res.status(400).json({ error: 'Vui lòng nhập lại mật khẩu (confirmPassword)'});
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ error: 'Mật khẩu xác nhận không khớp' });
    }

    // Kiểm tra email trùng
    const exist = await User.findOne({ where: { email } });
    if (exist) return res.status(400).json({ error: 'Email đã tồn tại' });

    // Hash password
    const hashed = await bcrypt.hash(password, 10);

    // Tạo user mới
    const newUser = await User.create({
      username,
      email,
      password: hashed,
    });

    res.status(201).json({
      message: 'Đăng ký thành công!',
      user: {
        id: newUser.user_id,
        username: newUser.username,
        email: newUser.email,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Lỗi server khi đăng ký' });
  }
};

// Đăng nhập
exports.login = async (req, res) => {
  try {
    const { email, password, rememberMe } = req.body;

    // Tìm user theo email
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ error: 'Email không tồn tại' });

    // So sánh mật khẩu
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) return res.status(401).json({ error: 'Sai mật khẩu' });

    // Nếu rememberMe thì thời hạn lâu hơn
    const expiresIn = rememberMe ? '7d' : '1h';
    const token = jwt.sign(
      { id: user.user_id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn }
    );

    res.json({
      message: 'Đăng nhập thành công!',
      token,
      expiresIn,
      user: {
        id: user.user_id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Lỗi server khi đăng nhập' });
  }
};

// Quên mật khẩu — gửi token reset (nếu chưa cấu hình mail, trả về URL trong response)
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'Vui lòng cung cấp email' });

    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ error: 'Email không tồn tại' });

    // Tạo token reset (JWT ngắn hạn)
    const token = jwt.sign({ id: user.user_id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    const frontend = process.env.FRONTEND_URL || 'http://localhost:3000';
    const resetUrl = `${frontend}/reset-password?token=${token}`;

    // TODO: Gửi email thực tế bằng mailer (nodemailer, external service). Hiện tại log và trả về URL để dev/test.
    console.info(`Password reset URL for ${email}: ${resetUrl}`);

    res.json({ message: 'Đã tạo token reset. Kiểm tra email (nếu mailer được cấu hình).', resetUrl });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Lỗi server khi xử lý quên mật khẩu' });
  }
};

// Reset mật khẩu bằng token
exports.resetPassword = async (req, res) => {
  try {
    const { token, password, confirmPassword } = req.body;
    if (!token) return res.status(400).json({ error: 'Token reset bắt buộc' });
    if (!password) return res.status(400).json({ error: 'Vui lòng cung cấp mật khẩu mới' });
    if (password !== confirmPassword) return res.status(400).json({ error: 'Mật khẩu xác nhận không khớp' });

    let payload;
    try {
      payload = jwt.verify(token, process.env.JWT_SECRET);
    } catch (e) {
      return res.status(400).json({ error: 'Token không hợp lệ hoặc đã hết hạn' });
    }

    const user = await User.findOne({ where: { user_id: payload.id } });
    if (!user) return res.status(404).json({ error: 'Người dùng không tồn tại' });

    const hashed = await bcrypt.hash(password, 10);
    await user.update({ password: hashed });

    res.json({ message: 'Đổi mật khẩu thành công' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Lỗi server khi reset mật khẩu' });
  }
};
