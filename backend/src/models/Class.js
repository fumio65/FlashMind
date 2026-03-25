import { DataTypes } from 'sequelize'
import { sequelize } from '../lib/db.js'

export const Class = sequelize.define('Class', {
  id: {
    type:          DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey:    true,
  },
  name: {
    type:      DataTypes.STRING(150),
    allowNull: false,
  },
  description: {
    type:         DataTypes.TEXT,
    defaultValue: '',
  },
  iconType: {
    type:         DataTypes.ENUM('emoji', 'lucide', 'image'),
    defaultValue: 'emoji',
    field:        'icon_type',
  },
  iconValue: {
    type:         DataTypes.TEXT('long'),
    defaultValue: '📚',
    field:        'icon_value',
  },
  color: {
    type:         DataTypes.STRING(100),
    defaultValue: 'from-blue-400 to-cyan-400',
  },
  isPublic: {
    type:         DataTypes.BOOLEAN,
    defaultValue: false,
    field:        'is_public',
  },
  ownerId: {
    type:      DataTypes.INTEGER,
    allowNull: false,
    field:     'owner_id',
  },
}, {
  tableName:  'classes',
  timestamps: true,
})