import { Op }      from 'sequelize'
import { User, Class, Deck, Card, StudySession } from '../../models/index.js'

// GET /api/admin/stats
export const getAdminStats = async (req, res) => {
  const [totalUsers, totalClasses, totalDecks, totalSessions] = await Promise.all([
    User.count(),
    Class.count(),
    Deck.count(),
    StudySession.count(),
  ])

  const recentUsers = await User.findAll({
    order:      [['createdAt', 'DESC']],
    limit:      5,
    attributes: { exclude: ['password'] },
  })

  res.json({
    totalUsers,
    totalClasses,
    totalDecks,
    totalSessions,
    flaggedDecks: 0,
    recentUsers:  recentUsers.map((u) => u.toJSON()),
    flagged:      [],
  })
}

// GET /api/admin/users
export const getAdminUsers = async (req, res) => {
  const { role, status, q } = req.query

  const where = {}
  if (role   && role   !== 'all') where.role   = role
  if (status && status !== 'all') where.status = status
  if (q) {
    where[Op.or] = [
      { name:     { [Op.like]: `%${q}%` } },
      { username: { [Op.like]: `%${q}%` } },
      { email:    { [Op.like]: `%${q}%` } },
    ]
  }

  const users = await User.findAll({
    where,
    attributes: { exclude: ['password'] },
    order: [['createdAt', 'DESC']],
  })

  res.json(users.map((u) => u.toJSON()))
}

// PUT /api/admin/users/:id/suspend
export const suspendUser = async (req, res) => {
  const user = await User.findByPk(req.params.id)
  if (!user) return res.status(404).json({ message: 'User not found' })
  if (user.role === 'admin') {
    return res.status(403).json({ message: 'Cannot suspend an admin' })
  }

  user.status = user.status === 'suspended' ? 'active' : 'suspended'
  await user.save()

  res.json({ user: user.toJSON(), message: `User ${user.status}` })
}

// PUT /api/admin/users/:id/ban
export const banUser = async (req, res) => {
  const user = await User.findByPk(req.params.id)
  if (!user) return res.status(404).json({ message: 'User not found' })
  if (user.role === 'admin') {
    return res.status(403).json({ message: 'Cannot ban an admin' })
  }

  user.status = 'banned'
  await user.save()

  res.json({ user: user.toJSON(), message: 'User banned' })
}

// PUT /api/admin/users/:id/unban
export const unbanUser = async (req, res) => {
  const user = await User.findByPk(req.params.id)
  if (!user) return res.status(404).json({ message: 'User not found' })

  user.status = 'active'
  await user.save()

  res.json({ user: user.toJSON(), message: 'User unbanned' })
}

// GET /api/admin/classes
export const getAdminClasses = async (req, res) => {
  const { q, status } = req.query

  const where = {}
  if (status === 'public')  where.isPublic = true
  if (status === 'private') where.isPublic = false
  if (q) where.name = { [Op.like]: `%${q}%` }

  const classes = await Class.findAll({
    where,
    include: [{ model: User, as: 'owner', attributes: ['id', 'username', 'avatar'] }],
    order:   [['createdAt', 'DESC']],
  })

  const withCounts = await Promise.all(
    classes.map(async (cls) => {
      const deckCount = await Deck.count({ where: { classId: cls.id } })
      const json = cls.toJSON()
      return {
        ...json,
        icon: { type: json.iconType, value: json.iconValue },
        deckCount,
      }
    })
  )

  res.json(withCounts)
}

// DELETE /api/admin/classes/:id
export const deleteAdminClass = async (req, res) => {
  const cls = await Class.findByPk(req.params.id)
  if (!cls) return res.status(404).json({ message: 'Class not found' })

  await cls.destroy()
  res.json({ message: 'Class and all its decks deleted' })
}

// GET /api/admin/decks
export const getAdminDecks = async (req, res) => {
  const { q, status } = req.query

  const where = {}
  if (status === 'public')  where.isPublic = true
  if (status === 'private') where.isPublic = false
  if (q) where.title = { [Op.like]: `%${q}%` }

  const decks = await Deck.findAll({
    where,
    include: [
      { model: User,  as: 'owner', attributes: ['id', 'username', 'avatar'] },
      { model: Class, as: 'class', attributes: ['id', 'name', 'color', 'iconType', 'iconValue'] },
    ],
    order: [['createdAt', 'DESC']],
  })

  const withCards = await Promise.all(
    decks.map(async (deck) => {
      const cardCount = await Card.count({ where: { deckId: deck.id } })
      return { ...deck.toJSON(), cardCount }
    })
  )

  res.json(withCards)
}

// DELETE /api/admin/decks/:id
export const deleteAdminDeck = async (req, res) => {
  const deck = await Deck.findByPk(req.params.id)
  if (!deck) return res.status(404).json({ message: 'Deck not found' })

  await deck.destroy()
  res.json({ message: 'Deck and all its cards deleted' })
}