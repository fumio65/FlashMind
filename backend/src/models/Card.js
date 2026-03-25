import { DataTypes } from 'sequelize'
import { sequelize } from '../lib/db.js'

export const Card = sequelize.define('Card', {
  id: {
    type:          DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey:    true,
  },
  front: {
    type:      DataTypes.TEXT,
    allowNull: false,
  },
  back: {
    type:      DataTypes.TEXT,
    allowNull: false,
  },
  frontImage: {
    type:         DataTypes.TEXT('long'),
    defaultValue: null,
    field:        'front_image',
  },
  backImage: {
    type:         DataTypes.TEXT('long'),
    defaultValue: null,
    field:        'back_image',
  },
  deckId: {
    type:      DataTypes.INTEGER,
    allowNull: false,
    field:     'deck_id',
  },
}, {
  tableName:  'cards',
  timestamps: true,
})