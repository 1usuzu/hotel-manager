const { DataTypes } = require('sequelize')
const sequelize = require('../config/db')

const Contact = sequelize.define(
  'Contact',
  {
    contact_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Tên không được để trống',
        },
        len: {
          args: [2, 100],
          msg: 'Tên phải từ 2-100 ký tự',
        },
      },
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Email không được để trống',
        },
        isEmail: {
          msg: 'Email không hợp lệ',
        },
      },
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Nội dung không được để trống',
        },
        len: {
          args: [10, 2000],
          msg: 'Nội dung phải từ 10-2000 ký tự',
        },
      },
    },
    status: {
      type: DataTypes.ENUM('new', 'read', 'replied'),
      defaultValue: 'new',
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: 'contacts',
    timestamps: false,
    indexes: [
      {
        fields: ['email'],
      },
      {
        fields: ['status'],
      },
      {
        fields: ['created_at'],
      },
    ],
  }
)

module.exports = Contact
