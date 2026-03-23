import { User }         from '../../models/User.js'
import { Class }        from '../../models/Class.js'
import { Deck }         from '../../models/Deck.js'
import { Card }         from '../../models/Card.js'
import { StudySession } from '../../models/StudySession.js'

// GET /api/admin/stats
export const getAdminStats = async (req, res) => {
  const [
    totalUsers,
    totalClasses,
    totalDecks,
    totalSessions,
  ] = await Promise.all([
    User.countDocuments(),
    Class.countDocuments(),
    Deck.countDocuments(),
    StudySession.countDocuments(),
  ])

  const recentUsers = await User.find()
    .sort({ createdAt: -1 })
    .limit(5)
    .select('name username email role status createdAt')

  res.json({
    totalUsers,
    totalClasses,
    totalDecks,
    totalSessions,
    recentUsers,
  })
}

// GET /api/admin/users
export const getAdminUsers = async (req, res) => {
  const { role, status, q } = req.query

  const filter = {}
  if (role   && role   !== 'all') filter.role   = role
  if (status && status !== 'all') filter.status = status
  if (q) {
    filter.$or = [
      { name:     { $regex: q, $options: 'i' } },
      { username: { $regex: q, $options: 'i' } },
      { email:    { $regex: q, $options: 'i' } },
    ]
  }

  const users = await User.find(filter)
    .select('-password')
    .sort({ createdAt: -1 })

  res.json(users)
}

// PUT /api/admin/users/:id/suspend
export const suspendUser = async (req, res) => {
  const user = await User.findById(req.params.id)
  if (!user) return res.status(404).json({ message: 'User not found' })
  if (user.role === 'admin') {
    return res.status(403).json({ message: 'Cannot suspend an admin' })
  }

  user.status = user.status === 'suspended' ? 'active' : 'suspended'
  await user.save()

  res.json({ user, message: `User ${user.status}` })
}

// PUT /api/admin/users/:id/ban
export const banUser = async (req, res) => {
  const user = await User.findById(req.params.id)
  if (!user) return res.status(404).json({ message: 'User not found' })
  if (user.role === 'admin') {
    return res.status(403).json({ message: 'Cannot ban an admin' })
  }

  user.status = 'banned'
  await user.save()

  res.json({ user, message: 'User banned' })
}

// PUT /api/admin/users/:id/unban
export const unbanUser = async (req, res) => {
  const user = await User.findById(req.params.id)
  if (!user) return res.status(404).json({ message: 'User not found' })

  user.status = 'active'
  await user.save()

  res.json({ user, message: 'User unbanned' })
}

// GET /api/admin/classes
export const getAdminClasses = async (req, res) => {
  const { q, status } = req.query

  const filter = {}
  if (status === 'public')  filter.isPublic = true
  if (status === 'private') filter.isPublic = false
  if (q) filter.name = { $regex: q, $options: 'i' }

  const classes = await Class.find(filter)
    .populate('owner', 'username avatar')
    .sort({ createdAt: -1 })

  const withCounts = await Promise.all(
    classes.map(async (cls) => {
      const deckCount = await Deck.countDocuments({ class: cls._id })
      return { ...cls.toJSON(), deckCount }
    })
  )

  res.json(withCounts)
}

// DELETE /api/admin/classes/:id
export const deleteAdminClass = async (req, res) => {
  const cls = await Class.findById(req.params.id)
  if (!cls) return res.status(404).json({ message: 'Class not found' })

  const decks = await Deck.find({ class: cls._id })
  await Promise.all(decks.map((d) => Card.deleteMany({ deck: d._id })))
  await Deck.deleteMany({ class: cls._id })
  await cls.deleteOne()

  res.json({ message: 'Class and all its decks deleted' })
}

// GET /api/admin/decks
export const getAdminDecks = async (req, res) => {
  const { q, status } = req.query

  const filter = {}
  if (status === 'public')  filter.isPublic = true
  if (status === 'private') filter.isPublic = false
  if (q) filter.title = { $regex: q, $options: 'i' }

  const decks = await Deck.find(filter)
    .populate('owner', 'username avatar')
    .populate('class', 'name color icon')
    .sort({ createdAt: -1 })

  const withCards = await Promise.all(
    decks.map(async (deck) => {
      const cardCount = await Card.countDocuments({ deck: deck._id })
      return { ...deck.toJSON(), cardCount }
    })
  )

  res.json(withCards)
}

// DELETE /api/admin/decks/:id
export const deleteAdminDeck = async (req, res) => {
  const deck = await Deck.findById(req.params.id)
  if (!deck) return res.status(404).json({ message: 'Deck not found' })

  await Card.deleteMany({ deck: deck._id })
  await deck.deleteOne()

  res.json({ message: 'Deck and all its cards deleted' })
}
