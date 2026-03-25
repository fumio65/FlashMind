import { DataTypes } from 'sequelize'
import { sequelize } from '../lib/db.js'

export const CardRating = sequelize.define('CardRating', {
  id: {
    type:          DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey:    true,
  },
  userId: {
    type:      DataTypes.INTEGER,
    allowNull: false,
    field:     'user_id',
  },
  cardId: {
    type:      DataTypes.INTEGER,
    allowNull: false,
    field:     'card_id',
  },
  deckId: {
    type:      DataTypes.INTEGER,
    allowNull: false,
    field:     'deck_id',
  },
  rating: {
    type:      DataTypes.TINYINT,
    allowNull: false,
  },
}, {
  tableName:  'card_ratings',
  timestamps: true,
})