import jwt      from 'jsonwebtoken'
import { User } from '../../models/index.js'
import { Op }   from 'sequelize'

const signToken = (id) =>
  jwt.sign({ id: Number(id) }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN })

const formatUser = (user) => {
  const json = user.toJSON ? user.toJSON() : user
  return { ...json, _id: json.id }
}

// POST /api/auth/register
export const register = async (req, res) => {
  const { name, username, email, password } = req.body

  if (!name || !username || !email || !password) {
    return res.status(400).json({ message: 'All fields are required' })
  }

  const exists = await User.findOne({
    where: { [Op.or]: [{ email }, { username }] }
  })
  if (exists) {
    const field = exists.email === email ? 'Email' : 'Username'
    return res.status(409).json({ message: `${field} is already taken` })
  }

  const user  = await User.create({ name, username, email, password })
  const token = signToken(user.id)

  res.status(201).json({ token, user: formatUser(user) })
}

// POST /api/auth/login
export const login = async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' })
  }

  const user = await User.findOne({ where: { email } })
  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).json({ message: 'Invalid email or password' })
  }

  if (user.status === 'banned') {
    return res.status(403).json({ message: 'Your account has been banned' })
  }
  if (user.status === 'suspended') {
    return res.status(403).json({ message: 'Your account has been suspended' })
  }

  const token = signToken(user.id)
  res.json({ token, user: formatUser(user) })
}

// GET /api/auth/me
export const getMe = async (req, res) => {
  res.json({ user: { ...req.user, _id: req.user.id } })
}

// PUT /api/auth/profile
export const updateProfile = async (req, res) => {
  const { name, username, avatar } = req.body

  const taken = await User.findOne({
    where: { username, id: { [Op.ne]: req.user.id } }
  })
  if (taken) {
    return res.status(409).json({ message: 'Username is already taken' })
  }

  await User.update({ name, username, avatar }, { where: { id: req.user.id } })

  const user = await User.findByPk(req.user.id, {
    attributes: { exclude: ['password'] }
  })

  res.json({ user: formatUser(user) })
}

// PUT /api/auth/password
export const updatePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body

  const user = await User.findByPk(req.user.id)
  if (!(await user.comparePassword(currentPassword))) {
    return res.status(401).json({ message: 'Current password is incorrect' })
  }

  user.password = newPassword
  await user.save()

  res.json({ message: 'Password updated successfully' })
}