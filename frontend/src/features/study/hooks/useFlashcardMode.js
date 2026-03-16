import { useState, useEffect, useCallback } from 'react'

export const CONFIDENCE_LEVELS = [
  { value: 1, label: 'Blackout', emoji: '😵', color: 'bg-red-600 hover:bg-red-700 text-white',           short: 'key1' },
  { value: 2, label: 'Again',    emoji: '😕', color: 'bg-orange-500 hover:bg-orange-600 text-white',     short: 'key2' },
  { value: 3, label: 'Hard',     emoji: '🤔', color: 'bg-yellow-500 hover:bg-yellow-600 text-white',     short: 'key3' },
  { value: 4, label: 'Good',     emoji: '🙂', color: 'bg-blue-500 hover:bg-blue-600 text-white',         short: 'key4' },
  { value: 5, label: 'Easy',     emoji: '😎', color: 'bg-green-500 hover:bg-green-600 text-white',       short: 'key5' },
]

export function useFlashcardMode(cards = []) {
  const [currentIndex, setCurrentIndex]   = useState(0)
  const [isFlipped, setIsFlipped]         = useState(false)
  const [ratings, setRatings]             = useState([]) // { cardId, value }
  const [isComplete, setIsComplete]       = useState(false)

  const currentCard = cards[currentIndex]

  const flip = useCallback(() => setIsFlipped((f) => !f), [])

  const rate = useCallback((value) => {
    if (!currentCard) return

    setRatings((prev) => [...prev, { cardId: currentCard._id, value }])
    setIsFlipped(false)

    setTimeout(() => {
      if (currentIndex + 1 >= cards.length) {
        setIsComplete(true)
      } else {
        setCurrentIndex((i) => i + 1)
      }
    }, 150)
  }, [currentCard, currentIndex, cards.length])

  const restart = useCallback(() => {
    setCurrentIndex(0)
    setIsFlipped(false)
    setRatings([])
    setIsComplete(false)
  }, [])

  // Keyboard shortcuts — Space to flip, 1-5 to rate
  useEffect(() => {
    const handler = (e) => {
      if (e.code === 'Space') { e.preventDefault(); flip() }
      if (e.key >= '1' && e.key <= '5') rate(Number(e.key))
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [flip, rate])

  // Derived stats
  const known        = ratings.filter((r) => r.value >= 4)
  const stillLearning = ratings.filter((r) => r.value <= 2)
  const hard         = ratings.filter((r) => r.value === 3)
  const avgScore     = ratings.length
    ? Math.round((ratings.reduce((sum, r) => sum + r.value, 0) / ratings.length / 5) * 100)
    : 0

  return {
    currentCard,
    currentIndex,
    isFlipped,
    flip,
    rate,
    restart,
    ratings,
    known,
    stillLearning,
    hard,
    avgScore,
    isComplete,
    total: cards.length,
  }
}