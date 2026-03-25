import { DataTypes } from 'sequelize'
import { sequelize } from '../lib/db.js'

export const StudySession = sequelize.define('StudySession', {
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
  deckId: {
    type:      DataTypes.INTEGER,
    allowNull: false,
    field:     'deck_id',
  },
  mode: {
    type:      DataTypes.ENUM('flashcard', 'quiz'),
    allowNull: false,
  },
  score: {
    type:         DataTypes.INTEGER,
    defaultValue: 0,
  },
  knownCount: {
    type:         DataTypes.INTEGER,
    defaultValue: 0,
    field:        'known_count',
  },
  timeTaken: {
    type:         DataTypes.INTEGER,
    defaultValue: 0,
    field:        'time_taken',
  },
  completedAt: {
    type:         DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    field:        'completed_at',
  },
}, {
  tableName:  'study_sessions',
  timestamps: true,
})