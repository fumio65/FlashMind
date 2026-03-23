import jwt     from 'jsonwebtoken'
import bcrypt  from 'bcrypt'
import { User } from '../../models/User.js'

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN })

// POST /api/auth/register
export const register = async (req, res) => {
  const { name, username, email, password } = req.body

  if (!name || !username || !email || !password) {
    return res.status(400).json({ message: 'All fields are required' })
  }

  const exists = await User.findOne({ $or: [{ email }, { username }] })
  if (exists) {
    const field = exists.email === email ? 'Email' : 'Username'
    return res.status(409).json({ message: `${field} is already taken` })
  }

  const user  = await User.create({ name, username, email, password })
  const token = signToken(user._id)

  res.status(201).json({ token, user })
}

// POST /api/auth/login
export const login = async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' })
  }

  const user = await User.findOne({ email }).select('+password')
  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).json({ message: 'Invalid email or password' })
  }

  if (user.status === 'banned') {
    return res.status(403).json({ message: 'Your account has been banned' })
  }

  if (user.status === 'suspended') {
    return res.status(403).json({ message: 'Your account has been suspended' })
  }

  const token = signToken(user._id)
  res.json({ token, user })
}

// GET /api/auth/me
export const getMe = async (req, res) => {
  res.json({ user: req.user })
}

// PUT /api/auth/profile
export const updateProfile = async (req, res) => {
  const { name, username, avatar } = req.body

  const taken = await User.findOne({
    username,
    _id: { $ne: req.user._id }
  })
  if (taken) {
    return res.status(409).json({ message: 'Username is already taken' })
  }

  const user = await User.findByIdAndUpdate(
    req.user._id,
    { name, username, avatar },
    { new: true, runValidators: true }
  )

  res.json({ user })
}

// PUT /api/auth/password
export const updatePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body

  const user = await User.findById(req.user._id).select('+password')
  if (!(await user.comparePassword(currentPassword))) {
    return res.status(401).json({ message: 'Current password is incorrect' })
  }

  user.password = newPassword
  await user.save()

  res.json({ message: 'Password updated successfully' })
}