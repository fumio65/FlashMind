import { Op }           from 'sequelize'
import { StudySession, Card, User, CardRating, Deck } from '../../models/index.js'

// POST /api/sessions
export const saveSession = async (req, res) => {
  const { deckId, mode, score, knownCount, timeTaken } = req.body

  if (!deckId || !mode) {
    return res.status(400).json({ message: 'deckId and mode are required' })
  }

  const session = await StudySession.create({
    userId:    req.user.id,
    deckId,
    mode,
    score:      score      ?? 0,
    knownCount: knownCount ?? 0,
    timeTaken:  timeTaken  ?? 0,
  })

  await updateStreak(req.user.id)

  const full = await StudySession.findByPk(session.id, {
    include: [{ model: Deck, as: 'deck', attributes: ['id', 'title'] }],
  })

  res.status(201).json(full.toJSON())
}

// GET /api/sessions/me
export const getMySessions = async (req, res) => {
  const page   = parseInt(req.query.page)  || 1
  const limit  = parseInt(req.query.limit) || 10
  const offset = (page - 1) * limit

  const { count, rows } = await StudySession.findAndCountAll({
    where:   { userId: req.user.id },
    include: [{ model: Deck, as: 'deck', attributes: ['id', 'title'] }],
    order:   [['completedAt', 'DESC']],
    limit,
    offset,
  })

  res.json({
    sessions: rows.map((s) => s.toJSON()),
    total:    count,
    page,
    pages:    Math.ceil(count / limit),
  })
}

// GET /api/sessions/stats
export const getMyStats = async (req, res) => {
  const userId = req.user.id

  const totalSessions = await StudySession.count({ where: { userId } })

  // Cards mastered — only rating >= 5 (Easy) counts as mastered
  const allRatings = await CardRating.findAll({ where: { userId } })
  const masteredCardIds = new Set(
    allRatings.filter((r) => r.rating >= 5).map((r) => r.cardId)
  )
  const cardsMastered = masteredCardIds.size

  // Weekly activity — count sessions per day
  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

  const recentSessions = await StudySession.findAll({
    where: {
      userId,
      completedAt: { [Op.gte]: sevenDaysAgo },
    },
    order: [['completedAt', 'ASC']],
  })

  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const weeklyMap = {}
  days.forEach((d) => { weeklyMap[d] = 0 })

  recentSessions.forEach((s) => {
    const day = days[new Date(s.completedAt).getDay()]
    weeklyMap[day] += 1
  })

  const weeklyActivity = days.map((day) => ({ day, cards: weeklyMap[day] }))

  // Total cards — from decks user owns OR has studied
  const studiedDeckIds = [...new Set(
    (await StudySession.findAll({
      where:      { userId },
      attributes: ['deckId'],
    })).map((s) => s.deckId)
  )]

  const ownedDeckIds = (await Deck.findAll({
    where:      { ownerId: userId },
    attributes: ['id'],
  })).map((d) => d.id)

  const allDeckIds = [...new Set([...studiedDeckIds, ...ownedDeckIds])]
  const totalCards = allDeckIds.length > 0
    ? await Card.count({ where: { deckId: allDeckIds } })
    : 0

  const mastery = totalCards > 0
    ? Math.min(100, Math.round((cardsMastered / totalCards) * 100))
    : 0

  const user = await User.findByPk(userId, {
    attributes: ['studyStreak', 'lastStudiedAt'],
  })

  res.json({
    studyStreak:  user.studyStreak,
    cardsMastered,
    totalSessions,
    mastery,
    totalCards,
    weeklyActivity,
  })
}

// GET /api/sessions/deck/:deckId
export const getDeckStats = async (req, res) => {
  const { deckId } = req.params
  const userId     = req.user.id

  const lastSession = await StudySession.findOne({
    where: { userId, deckId },
    order: [['completedAt', 'DESC']],
  })

  const ratings    = await CardRating.findAll({ where: { userId, deckId } })
  const totalCards = await Card.count({ where: { deckId } })

  // Only rating >= 5 (Easy) counts as mastered
  const masteredCardIds = new Set(
    ratings.filter((r) => r.rating >= 5).map((r) => r.cardId)
  )
  const knownCount = masteredCardIds.size

  const mastery = totalCards > 0
    ? Math.min(100, Math.round((knownCount / totalCards) * 100))
    : 0

  res.json({
    mastery,
    knownCount,
    totalCards,
    lastScore:   lastSession?.score       ?? 0,
    lastStudied: lastSession?.completedAt ?? null,
  })
}

// ── Helper: update streak ──
async function updateStreak(userId) {
  const user = await User.findByPk(userId)

  const now      = new Date()
  const todayStr = now.toDateString()
  const last     = user.lastStudiedAt ? new Date(user.lastStudiedAt) : null

  if (last && last.toDateString() === todayStr) return

  const yesterday = new Date(now)
  yesterday.setDate(yesterday.getDate() - 1)

  if (last && last.toDateString() === yesterday.toDateString()) {
    user.studyStreak += 1
  } else {
    user.studyStreak = 1
  }

  user.lastStudiedAt = now
  await user.save()
}