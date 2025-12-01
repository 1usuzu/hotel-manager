const { DataTypes } = require('sequelize')
const sequelize = require('../config/db')

const KnowledgeBase = sequelize.define(
  'KnowledgeBase',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    metadata: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    embedding: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    tableName: 'knowledge_chunks',
    timestamps: false,
  }
)

module.exports = KnowledgeBase
