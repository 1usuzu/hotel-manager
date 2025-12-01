const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Room = sequelize.define('Room', {
  room_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  room_number: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: {
      msg: 'Số phòng đã tồn tại'
    },
    validate: {
      notEmpty: {
        msg: 'Số phòng không được để trống'
      }
    }
  },
  type: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Loại phòng không được để trống'
      }
    }
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: {
        args: [0],
        msg: 'Giá phòng phải lớn hơn 0'
      }
    }
  },
  status: {
    type: DataTypes.ENUM('available', 'booked', 'maintenance'),
    defaultValue: 'available',
  },
  description: {
    type: DataTypes.TEXT,
  },
  capacity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 2,
    validate: {
      min: {
        args: [1],
        msg: 'Sức chứa phải ít nhất 1 người'
      },
      max: {
        args: [20],
        msg: 'Sức chứa tối đa 20 người'
      }
    }
  },
  image_url: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: true,
  }
}, {
  tableName: 'rooms',
  timestamps: false,
  indexes: [
    {
      unique: true,
      fields: ['room_number']
    }
  ]
});

module.exports = Room;
