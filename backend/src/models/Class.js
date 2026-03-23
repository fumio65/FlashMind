import mongoose from 'mongoose'

const iconSchema = new mongoose.Schema({
  type:  { type: String, enum: ['emoji', 'lucide', 'image'], required: true },
  value: { type: String, required: true },
}, { _id: false })

const classSchema = new mongoose.Schema({
  name:        { type: String, required: true, trim: true },
  description: { type: String, default: '', trim: true },
  icon:        { type: iconSchema, default: { type: 'emoji', value: '📚' } },
  color:       { type: String, default: 'from-blue-400 to-cyan-400' },
  isPublic:    { type: Boolean, default: false, index: true },
  owner:       { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
}, { timestamps: true })

export const Class = mongoose.model('Class', classSchema)