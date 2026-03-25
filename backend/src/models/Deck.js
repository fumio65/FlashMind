import { DataTypes } from 'sequelize'
import { sequelize } from '../lib/db.js'

export const Deck = sequelize.define('Deck', {
  id: {
    type:          DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey:    true,
  },
  title: {
    type:      DataTypes.STRING(150),
    allowNull: false,
  },
  description: {
    type:         DataTypes.TEXT,
    defaultValue: '',
  },
  isPublic: {
    type:         DataTypes.BOOLEAN,
    defaultValue: false,
    field:        'is_public',
  },
  classId: {
    type:      DataTypes.INTEGER,
    allowNull: false,
    field:     'class_id',
  },
  ownerId: {
    type:      DataTypes.INTEGER,
    allowNull: false,
    field:     'owner_id',
  },
}, {
  tableName:  'decks',
  timestamps: true,
})