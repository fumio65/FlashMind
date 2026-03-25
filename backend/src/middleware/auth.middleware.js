import jwt      from 'jsonwebtoken'
import { User } from '../models/index.js'

export const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token provided' })
    }

    const token   = authHeader.split(' ')[1]
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const user    = await User.findByPk(Number(decoded.id), {
      attributes: { exclude: ['password'] }
    })

    if (!user) return res.status(401).json({ message: 'User not found' })

    if (user.status === 'banned' || user.status === 'suspended') {
      return res.status(403).json({ message: `Account ${user.status}` })
    }

    // Ensure id is always a number
    req.user = { ...user.toJSON(), id: Number(user.id) }
    next()
  } catch (err) {
    if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Invalid or expired token' })
    }
    next(err)
  }
}