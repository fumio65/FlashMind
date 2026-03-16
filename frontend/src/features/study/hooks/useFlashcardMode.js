import { useState, useEffect, useCallback } from 'react'
import { buildReviewQueue } from '../utils/buildReviewQueue'

export const CONFIDENCE_LEVELS = [
  { value: 1, label: 'Blackout', emoji: '😵', color: 'bg-red-600 hover:bg-red-700 text-white'       },
  { value: 2, label: 'Again',    emoji: '😕', color: 'bg-orange-500 hover:bg-orange-600 text-white' },
  { value: 3, label: 'Hard',     emoji: '🤔', color: 'bg-yellow-500 hover:bg-yellow-600 text-white' },
  { value: 4, label: 'Good',     emoji: '🙂', color: 'bg-blue-500 hover:bg-blue-600 text-white'     },
  { value: 5, label: 'Easy',     emoji: '😎', color: 'bg-green-500 hover:bg-green-600 text-white'   },
]

export const DOT_COLORS = {
  1: 'bg-red-500',
  2: 'bg-orange-500',
  3: 'bg-yellow-500',
  4: 'bg-blue-500',
  5: 'bg-green-500',
}

export const BADGE_COLORS = {
  1: 'bg-red-500/20 text-red-400 border-red-500/30',
  2: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  3: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  4: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  5: 'bg-green-500/20 text-green-400 border-green-500/30',
}

export function useFlashcardMode(allCards = [], previousRatings = {}) {
  const [queue, setQueue]               = useState(() => buildReviewQueue(allCards, previousRatings))
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFlipped, setIsFlipped]       = useState(false)
  const [ratings, setRatings]           = useState([])
  const [isComplete, setIsComplete]     = useState(false)

  const currentCard = queue[currentIndex]
  const prevRating  = currentCard ? previousRatings[currentCard._id] : null
  const prevLevel   = prevRating ? CONFIDENCE_LEVELS.find((l) => l.value === prevRating) : null

  const flip = useCallback(() => setIsFlipped((f) => !f), [])

  const rate = useCallback((value) => {
    if (!currentCard) return
    setRatings((prev) => [...prev, { cardId: currentCard._id, value }])
    setIsFlipped(false)
    setTimeout(() => {
      if (currentIndex + 1 >= queue.length) {
        setIsComplete(true)
      } else {
        setCurrentIndex((i) => i + 1)
      }
    }, 150)
  }, [currentCard, currentIndex, queue.length])

  const restart = useCallback((newRatingMap = {}) => {
    const newQueue = buildReviewQueue(allCards, newRatingMap)
    setQueue(newQueue)
    setCurrentIndex(0)
    setIsFlipped(false)
    setRatings([])
    setIsComplete(false)
  }, [allCards])

  useEffect(() => {
    const handler = (e) => {
      if (e.code === 'Space') { e.preventDefault(); flip() }
      if (e.key >= '1' && e.key <= '5') rate(Number(e.key))
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [flip, rate])

  const known         = ratings.filter((r) => r.value >= 4)
  const stillLearning = ratings.filter((r) => r.value <= 2)
  const hard          = ratings.filter((r) => r.value === 3)
  const avgScore      = ratings.length
    ? Math.round((ratings.reduce((sum, r) => sum + r.value, 0) / ratings.length / 5) * 100)
    : 0

  const ratingMap = {}
  ratings.forEach((r) => { ratingMap[r.cardId] = r.value })

  return {
    currentCard, currentIndex, isFlipped, flip, rate, restart,
    ratings, ratingMap, known, stillLearning, hard,
    avgScore, isComplete, prevLevel,
    total: queue.length,
    uniqueTotal: allCards.length,
  }
}