import { StudySession } from '../../models/StudySession.js'
import { Card }         from '../../models/Card.js'
import { User }         from '../../models/User.js'
import { CardRating }   from '../../models/CardRating.js'

// POST /api/sessions
export const saveSession = async (req, res) => {
  const { deckId, mode, score, knownCount, timeTaken } = req.body

  if (!deckId || !mode) {
    return res.status(400).json({ message: 'deckId and mode are required' })
  }

  const session = await StudySession.create({
    user:       req.user._id,
    deck:       deckId,
    mode,
    score:      score      ?? 0,
    knownCount: knownCount ?? 0,
    timeTaken:  timeTaken  ?? 0,
  })

  await updateStreak(req.user._id)

  await session.populate('deck', 'title')
  res.status(201).json(session)
}

// GET /api/sessions/me
export const getMySessions = async (req, res) => {
  const page  = parseInt(req.query.page)  || 1
  const limit = parseInt(req.query.limit) || 10
  const skip  = (page - 1) * limit

  const [sessions, total] = await Promise.all([
    StudySession.find({ user: req.user._id })
      .populate('deck', 'title')
      .sort({ completedAt: -1 })
      .skip(skip)
      .limit(limit),
    StudySession.countDocuments({ user: req.user._id }),
  ])

  res.json({ sessions, total, page, pages: Math.ceil(total / limit) })
}

// GET /api/sessions/stats
export const getMyStats = async (req, res) => {
  const userId = req.user._id

  const totalSessions = await StudySession.countDocuments({ user: userId })

  // Cards mastered — based on latest card ratings (rating >= 4 = Good or Easy)
  // Uses CardRating which stores one rating per card (upserted on each session)
  // This prevents cumulative overcounting across multiple sessions
  const allRatings    = await CardRating.find({ user: userId })
  const cardsMastered = allRatings.filter((r) => r.rating >= 4).length

  // Weekly activity — last 7 days
  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

  const recentSessions = await StudySession.find({
    user:        userId,
    completedAt: { $gte: sevenDaysAgo },
  }).sort({ completedAt: 1 })

  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const weeklyMap = {}
  days.forEach((d) => { weeklyMap[d] = 0 })

  recentSessions.forEach((s) => {
    const day = days[new Date(s.completedAt).getDay()]
    weeklyMap[day] += s.knownCount ?? 0
  })

  const weeklyActivity = days.map((day) => ({ day, cards: weeklyMap[day] }))

  // Overall mastery % — capped at 100%
  const totalCards = await Card.countDocuments()
  const mastery    = totalCards > 0
    ? Math.min(100, Math.round((cardsMastered / totalCards) * 100))
    : 0

  // Get fresh user for streak
  const user = await User.findById(userId).select('studyStreak lastStudiedAt')

  res.json({
    studyStreak:  user.studyStreak,
    cardsMastered,
    totalSessions,
    mastery,
    weeklyActivity,
  })
}

// GET /api/sessions/deck/:deckId
export const getDeckStats = async (req, res) => {
  const { deckId } = req.params
  const userId     = req.user._id

  // Get latest flashcard session for this deck
  const lastSession = await StudySession.findOne({
    user: userId,
    deck: deckId,
    mode: 'flashcard',
  }).sort({ completedAt: -1 })

  // Use card ratings — one rating per card, upserted on each session
  // This ensures mastery reflects current knowledge, not cumulative counts
  const ratings    = await CardRating.find({ user: userId, deck: deckId })
  const totalCards = await Card.countDocuments({ deck: deckId })

  // Count cards with rating >= 4 (Good or Easy)
  const knownCount = ratings.filter((r) => r.rating >= 4).length

  // Cap mastery at 100%
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
  const user = await User.findById(userId)

  const now      = new Date()
  const todayStr = now.toDateString()
  const last     = user.lastStudiedAt ? new Date(user.lastStudiedAt) : null

  // Already studied today — don't increment
  if (last && last.toDateString() === todayStr) return

  const yesterday = new Date(now)
  yesterday.setDate(yesterday.getDate() - 1)
  const yesterdayStr = yesterday.toDateString()

  if (last && last.toDateString() === yesterdayStr) {
    // Studied yesterday → continue streak
    user.studyStreak += 1
  } else {
    // No study yesterday → reset streak to 1
    user.studyStreak = 1
  }

  user.lastStudiedAt = now
  user.markModified('lastStudiedAt')
  user.markModified('studyStreak')
  await user.save()
}