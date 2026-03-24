import mongoose from 'mongoose'
import bcrypt   from 'bcrypt'

const userSchema = new mongoose.Schema({
  name:          { type: String, required: true, trim: true },
  email:         { type: String, required: true, unique: true, lowercase: true, trim: true },
  username:      { type: String, required: true, unique: true, lowercase: true, trim: true },
  password:      { type: String, required: true, minlength: 8 },
  avatar:        { type: String, default: null },
  role:          { type: String, enum: ['student', 'admin'], default: 'student' },
  status:        { type: String, enum: ['active', 'suspended', 'banned'], default: 'active' },
  studyStreak:   { type: Number, default: 0 },
  lastStudiedAt: { type: Date, default: null },
}, { timestamps: true })

userSchema.pre('save', async function () {
  if (!this.isModified('password')) return
  this.password = await bcrypt.hash(this.password, 10)
})

userSchema.methods.comparePassword = function (plain) {
  return bcrypt.compare(plain, this.password)
}

userSchema.set('toJSON', {
  transform: (_, obj) => { delete obj.password; return obj }
})

export const User = mongoose.model('User', userSchema)