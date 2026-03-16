import { CONFIDENCE_LEVELS } from '../hooks/useFlashcardMode'

const REPEAT_MAP = {
  1: 3, // Blackout → show 3x
  2: 2, // Again    → show 2x
  3: 2, // Hard     → show 2x
  4: 1, // Good     → show 1x
  5: 0, // Easy     → skip
}

// Fisher-Yates shuffle
function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export function buildReviewQueue(allCards, ratingMap) {
  // First session — no ratings yet, return shuffled cards
  if (!ratingMap || Object.keys(ratingMap).length === 0) {
    return shuffle(allCards)
  }

  const queue = []

  allCards.forEach((card) => {
    const rating  = ratingMap[card._id] ?? 3 // default Hard if unrated
    const repeats = REPEAT_MAP[rating] ?? 1

    for (let i = 0; i < repeats; i++) {
      queue.push({ ...card, _queueKey: `${card._id}-${i}` })
    }
  })

  // Shuffle so repeated cards don't clump together
  return shuffle(queue)
}

export function getQueueSummary(allCards, ratingMap) {
  if (!ratingMap || Object.keys(ratingMap).length === 0) return null

  const skipped  = allCards.filter((c) => (ratingMap[c._id] ?? 0) === 5).length
  const repeated = allCards.filter((c) => (ratingMap[c._id] ?? 0) <= 2).length
  const total    = allCards.reduce((sum, c) => {
    return sum + (REPEAT_MAP[ratingMap[c._id] ?? 3] ?? 1)
  }, 0)

  return { skipped, repeated, total }
}