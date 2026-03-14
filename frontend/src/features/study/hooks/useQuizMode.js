import { useState, useEffect, useCallback, useRef } from 'react'
import { generateQuizQuestions } from '../utils/generateQuizQuestions'

const TIMER_DURATION = 30

export function useQuizMode(cards = []) {
  const [questions]                     = useState(() => generateQuizQuestions(cards))
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedOption, setSelectedOption] = useState(null)
  const [timeLeft, setTimeLeft]         = useState(TIMER_DURATION)
  const [score, setScore]               = useState(0)
  const [isComplete, setIsComplete]     = useState(false)
  const [showFeedback, setShowFeedback] = useState(false)
  const timerRef                        = useRef(null)

  const currentQuestion = questions[currentIndex]

  const stopTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current)
  }, [])

  const goNext = useCallback(() => {
    setSelectedOption(null)
    setShowFeedback(false)
    setTimeLeft(TIMER_DURATION)
    if (currentIndex + 1 >= questions.length) {
      setIsComplete(true)
    } else {
      setCurrentIndex((i) => i + 1)
    }
  }, [currentIndex, questions.length])

  const answer = useCallback((option) => {
    if (selectedOption) return // already answered
    stopTimer()
    setSelectedOption(option)
    setShowFeedback(true)
    if (option.isCorrect) setScore((s) => s + 1)
  }, [selectedOption, stopTimer])

  // Auto-advance on timer expiry
  useEffect(() => {
    if (isComplete || showFeedback) return
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          stopTimer()
          setShowFeedback(true) // time's up — show answer
          return 0
        }
        return t - 1
      })
    }, 1000)
    return stopTimer
  }, [currentIndex, isComplete, showFeedback, stopTimer])

  const restart = useCallback(() => {
    setCurrentIndex(0)
    setSelectedOption(null)
    setTimeLeft(TIMER_DURATION)
    setScore(0)
    setIsComplete(false)
    setShowFeedback(false)
  }, [])

  return {
    currentQuestion,
    currentIndex,
    selectedOption,
    timeLeft,
    score,
    isComplete,
    showFeedback,
    answer,
    goNext,
    restart,
    total: questions.length,
  }
}