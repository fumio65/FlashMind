import { useState, useEffect, useCallback } from 'react'

export function useFlashcardMode(cards = []) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFlipped, setIsFlipped]       = useState(false)
  const [known, setKnown]               = useState([])
  const [stillLearning, setStillLearning] = useState([])
  const [isComplete, setIsComplete]     = useState(false)

  const currentCard = cards[currentIndex]

  const flip = useCallback(() => setIsFlipped((f) => !f), [])

  const next = useCallback((markAs) => {
    if (!currentCard) return

    if (markAs === 'known') {
      setKnown((prev) => [...prev, currentCard._id])
    } else {
      setStillLearning((prev) => [...prev, currentCard._id])
    }

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
    setKnown([])
    setStillLearning([])
    setIsComplete(false)
  }, [])

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e) => {
      if (e.code === 'Space')       { e.preventDefault(); flip() }
      if (e.code === 'ArrowRight')  next('known')
      if (e.code === 'ArrowLeft')   next('stillLearning')
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [flip, next])

  return {
    currentCard,
    currentIndex,
    isFlipped,
    flip,
    next,
    restart,
    known,
    stillLearning,
    isComplete,
    total: cards.length,
  }
}