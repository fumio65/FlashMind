import { StudySession } from '../../models/StudySession.js'
import { Card }         from '../../models/Card.js'
import { User }         from '../../models/User.js'

// POST /api/sessions
export const saveSession = async (req, res) => {
  const { deckId, mode, score, knownCount, timeTaken } = req.body

  if (!deckId || !mode) {
    return res.status(400).json({ message: 'deckId and mode are required' })
  }

  const session = await StudySession.create({
    user:      req.user._id,
    deck:      deckId,
    mode,
    score:     score      ?? 0,
    knownCount:knownCount ?? 0,
    timeTaken: timeTaken  ?? 0,
  })

  // Update study streak
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

  res.json({
    sessions,
    total,
    page,
    pages: Math.ceil(total / limit),
  })
}

// GET /api/sessions/stats
export const getMyStats = async (req, res) => {
  const userId = req.user._id

  // Total sessions
  const totalSessions = await StudySession.countDocuments({ user: userId })

  // Cards mastered — unique cards marked known across all flashcard sessions
  const flashcardSessions = await StudySession.find({
    user: userId,
    mode: 'flashcard',
  })
  const cardsMastered = flashcardSessions.reduce(
    (sum, s) => sum + (s.knownCount ?? 0), 0
  )

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

  // Overall mastery %
  const totalCards = await Card.countDocuments()
  const mastery    = totalCards > 0
    ? Math.round((cardsMastered / totalCards) * 100)
    : 0

  // Study streak from user doc
  const user = await User.findById(userId).select('studyStreak')

  res.json({
    studyStreak:    user.studyStreak,
    cardsMastered,
    totalSessions,
    mastery,
    weeklyActivity,
  })
}

// ── Helper: update streak ──
async function updateStreak(userId) {
  const user = await User.findById(userId)

  const now       = new Date()
  const lastDate  = user.updatedAt ? new Date(user.updatedAt) : null
  const yesterday = new Date(now)
  yesterday.setDate(yesterday.getDate() - 1)

  const sameDay   = lastDate && lastDate.toDateString() === now.toDateString()
  const yesterday2= lastDate && lastDate.toDateString() === yesterday.toDateString()

  if (sameDay) return // Already counted today
  if (yesterday2) {
    user.studyStreak += 1
  } else {
    user.studyStreak = 1 // Reset streak
  }

  await user.save()
}