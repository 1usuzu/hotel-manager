const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')
const dotenv = require('dotenv')
const User = require('../models/User')

dotenv.config()

// ================= VALIDATION HELPERS ==================
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

function isValidPhone(phone) {
  if (!phone) return true // phone là optional
  const phoneRegex = /^[0-9]{10,11}$/
  return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''))
}

function isValidUsername(username) {
  return (
    username && username.trim().length >= 2 && username.trim().length <= 100
  )
}

function isValidPassword(password) {
  return password && password.length >= 6 && password.length <= 100
}

// Helper hash mật khẩu
async function setUserPassword(user, plainPassword) {
  const salt = await bcrypt.genSalt(10)
  const hashed = await bcrypt.hash(plainPassword, salt)
  user.password = hashed
  await user.save()
}

// ================= REGISTER ==================
exports.register = async (req, res) => {
  try {
    let { username, email, password, confirmPassword, phone } = req.body

    // Trim inputs
    username = username?.trim()
    email = email?.trim().toLowerCase()
    phone = phone?.trim()

    // Validate required fields
    if (!username || !email || !password) {
      return res.status(400).json({ error: 'Vui lòng nhập đầy đủ thông tin' })
    }

    // Validate username
    if (!isValidUsername(username)) {
      return res
        .status(400)
        .json({ error: 'Tên người dùng phải từ 2-100 ký tự' })
    }

    // Validate email format
    if (!isValidEmail(email)) {
      return res.status(400).json({ error: 'Email không hợp lệ' })
    }

    // Validate password
    if (!isValidPassword(password)) {
      return res.status(400).json({ error: 'Mật khẩu phải từ 6-100 ký tự' })
    }

    // Validate password confirmation
    if (password !== confirmPassword) {
      return res.status(400).json({ error: 'Mật khẩu xác nhận không khớp' })
    }

    // Validate phone if provided
    if (phone && !isValidPhone(phone)) {
      return res
        .status(400)
        .json({ error: 'Số điện thoại không hợp lệ (10-11 chữ số)' })
    }

    // Kiểm tra email trùng
    const exist = await User.findOne({ where: { email } })
    if (exist) return res.status(400).json({ error: 'Email đã tồn tại' })

    const hashed = await bcrypt.hash(password, 10)

    const newUser = await User.create({
      username,
      email,
      phone: phone || null,
      password: hashed,
    })

    return res.status(201).json({
      message: 'Đăng ký thành công!',
      user: {
        id: newUser.user_id,
        username: newUser.username,
        email: newUser.email,
        phone: newUser.phone,
      },
    })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'Lỗi server khi đăng ký' })
  }
}

// ================= LOGIN ==================
exports.login = async (req, res) => {
  try {
    let { email, password, rememberMe } = req.body

    // Trim and validate inputs
    email = email?.trim().toLowerCase()

    if (!email || !password) {
      return res.status(400).json({ error: 'Vui lòng nhập email và mật khẩu' })
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({ error: 'Email không hợp lệ' })
    }

    const user = await User.findOne({ where: { email } })
    if (!user) return res.status(404).json({ error: 'Email không tồn tại' })

    const isValid = await bcrypt.compare(password, user.password)
    if (!isValid) return res.status(401).json({ error: 'Sai mật khẩu' })

    const token = jwt.sign(
      { id: Number(user.user_id), role: user.role || 'customer' },
      process.env.JWT_SECRET,
      { expiresIn: rememberMe ? '30d' : '24h' }
    )

    return res.json({
      message: 'Đăng nhập thành công!',
      token,
      user: {
        id: String(user.user_id),
        username: user.username,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'Lỗi server khi đăng nhập' })
  }
}

// ================= CHANGE PASSWORD ==================
exports.resetPassword = async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body

    if (!req.user?.id) {
      return res.status(401).json({ error: 'Chưa xác thực người dùng.' })
    }

    if (!currentPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({ error: 'Vui lòng nhập đầy đủ các trường' })
    }

    // Validate new password
    if (!isValidPassword(newPassword)) {
      return res.status(400).json({ error: 'Mật khẩu mới phải từ 6-100 ký tự' })
    }

    if (newPassword !== confirmPassword) {
      return res
        .status(400)
        .json({ error: 'Mật khẩu mới và xác nhận không khớp' })
    }

    const user = await User.findByPk(req.user.id)
    if (!user)
      return res.status(404).json({ error: 'Không tìm thấy người dùng' })

    const isMatch = await bcrypt.compare(currentPassword, user.password)
    if (!isMatch)
      return res.status(400).json({ error: 'Mật khẩu hiện tại không đúng' })

    // Kiểm tra mật khẩu mới không giống mật khẩu cũ
    const isSameAsOld = await bcrypt.compare(newPassword, user.password)
    if (isSameAsOld) {
      return res
        .status(400)
        .json({ error: 'Mật khẩu mới phải khác mật khẩu hiện tại' })
    }

    await setUserPassword(user, newPassword)

    return res.json({ message: 'Đổi mật khẩu thành công!' })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'Lỗi server khi đổi mật khẩu' })
  }
}

// ================= PROFILE ==================
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: ['user_id', 'username', 'email', 'phone', 'created_at'],
    })

    if (!user) return res.status(404).json({ error: 'Không tìm thấy user' })

    return res.json(user)
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'Lỗi server khi lấy profile' })
  }
}

// ================= UPDATE PROFILE ==================
exports.updateProfile = async (req, res) => {
  try {
    let { username, email, phone } = req.body

    // Trim inputs
    username = username?.trim()
    email = email?.trim().toLowerCase()
    phone = phone?.trim()

    const user = await User.findByPk(req.user.id)
    if (!user) return res.status(404).json({ error: 'Không tìm thấy user' })

    // Validate and update username
    if (username !== undefined) {
      if (!isValidUsername(username)) {
        return res
          .status(400)
          .json({ error: 'Tên người dùng phải từ 2-100 ký tự' })
      }
      user.username = username
    }

    // Validate and update email
    if (email && email !== user.email) {
      if (!isValidEmail(email)) {
        return res.status(400).json({ error: 'Email không hợp lệ' })
      }
      const existed = await User.findOne({ where: { email } })
      if (existed)
        return res.status(400).json({ error: 'Email này đã được sử dụng' })
      user.email = email
    }

    // Validate and update phone
    if (phone !== undefined) {
      if (phone && !isValidPhone(phone)) {
        return res
          .status(400)
          .json({ error: 'Số điện thoại không hợp lệ (10-11 chữ số)' })
      }
      user.phone = phone || null
    }

    await user.save()

    return res.json({
      message: 'Cập nhật hồ sơ thành công',
      user: {
        id: user.user_id,
        username: user.username,
        email: user.email,
        phone: user.phone,
      },
    })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'Lỗi server khi cập nhật hồ sơ' })
  }
}

// ================= FORGOT PASSWORD ==================
exports.forgotPassword = async (req, res) => {
  try {
    let { email } = req.body

    // Trim and validate
    email = email?.trim().toLowerCase()

    if (!email) {
      return res.status(400).json({ error: 'Vui lòng nhập email' })
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({ error: 'Email không hợp lệ' })
    }

    // Tìm user
    const user = await User.findOne({ where: { email } })

    // Luôn trả về success message để tránh leak thông tin user
    if (!user) {
      return res.json({
        message: 'Nếu email tồn tại, mã xác thực đã được gửi.',
      })
    }

    // Tạo reset token (6 chữ số)
    const resetToken = Math.floor(100000 + Math.random() * 900000).toString()
    const hashedToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex')

    // Lưu token và thời gian hết hạn (15 phút)
    user.reset_token = hashedToken
    user.reset_token_expires = new Date(Date.now() + 15 * 60 * 1000)
    await user.save()

    // TODO: Gửi email với resetToken
    // Hiện tại trả về token trong response (chỉ để test, production nên gửi email)
    console.log('Reset token for', email, ':', resetToken)

    return res.json({
      message: 'Mã xác thực đã được tạo. Vui lòng kiểm tra email.',
      // Chỉ để test, xóa dòng này khi có email service
      resetToken: resetToken, // Luôn trả về để test
    })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'Lỗi server khi xử lý yêu cầu' })
  }
}

// ================= RESET PASSWORD WITH TOKEN ==================
exports.resetPasswordWithToken = async (req, res) => {
  try {
    let { email, token, newPassword, confirmPassword } = req.body

    // Trim and validate
    email = email?.trim().toLowerCase()
    token = token?.trim()

    if (!email || !token || !newPassword || !confirmPassword) {
      return res.status(400).json({ error: 'Vui lòng nhập đầy đủ thông tin' })
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({ error: 'Email không hợp lệ' })
    }

    if (!isValidPassword(newPassword)) {
      return res.status(400).json({ error: 'Mật khẩu mới phải từ 6-100 ký tự' })
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ error: 'Mật khẩu xác nhận không khớp' })
    }

    // Hash token để so sánh
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex')

    // Tìm user với token hợp lệ và chưa hết hạn
    const user = await User.findOne({
      where: {
        email,
        reset_token: hashedToken,
      },
    })

    if (!user) {
      return res.status(400).json({ error: 'Mã xác thực không hợp lệ' })
    }

    // Kiểm tra token hết hạn
    if (user.reset_token_expires < new Date()) {
      return res
        .status(400)
        .json({ error: 'Mã xác thực đã hết hạn. Vui lòng yêu cầu mã mới.' })
    }

    // Đổi mật khẩu
    await setUserPassword(user, newPassword)

    // Xóa reset token
    user.reset_token = null
    user.reset_token_expires = null
    await user.save()

    return res.json({
      message: 'Đặt lại mật khẩu thành công! Bạn có thể đăng nhập ngay.',
    })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'Lỗi server khi đặt lại mật khẩu' })
  }
}
