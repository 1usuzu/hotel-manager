const { DataTypes } = require('sequelize')
const sequelize = require('../config/db')

const UserPreferences = sequelize.define(
  'UserPreferences',
  {
    user_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: 'users',
        key: 'user_id',
      },
    },
    last_searched_destination: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    preferred_trip_style: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    typical_group_size: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: 'user_preferences',
    timestamps: false,
  }
)

module.exports = UserPreferences
