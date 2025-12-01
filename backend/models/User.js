const { DataTypes } = require('sequelize')
const sequelize = require('../config/db')

const User = sequelize.define(
  'User',
  {
    user_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Tên người dùng không được để trống',
        },
        len: {
          args: [2, 100],
          msg: 'Tên người dùng phải từ 2-100 ký tự',
        },
      },
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: {
        msg: 'Email đã tồn tại',
      },
      validate: {
        notEmpty: {
          msg: 'Email không được để trống',
        },
        isEmail: {
          msg: 'Email không hợp lệ',
        },
      },
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: true,
      validate: {
        is: {
          args: /^[0-9\s\-\(\)]{0,20}$/,
          msg: 'Số điện thoại không hợp lệ',
        },
      },
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Mật khẩu không được để trống',
        },
        len: {
          args: [6, 255],
          msg: 'Mật khẩu phải từ 6 ký tự trở lên',
        },
      },
    },
    role: {
      type: DataTypes.STRING(50),
      defaultValue: 'customer',
      validate: {
        isIn: {
          args: [['customer', 'admin', 'staff']],
          msg: 'Role không hợp lệ',
        },
      },
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    reset_token: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    reset_token_expires: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    tableName: 'users',
    timestamps: false,
    indexes: [
      {
        unique: true,
        fields: ['email'],
      },
      {
        fields: ['reset_token'],
      },
    ],
  }
)

module.exports = User
