import { useState, useEffect } from 'react'
import { getDeck } from '../api/decks.api'

export function useDeck(id) {
  const [deck, setDeck]           = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError]         = useState(null)

  useEffect(() => {
    if (!id) return
    setIsLoading(true)
    getDeck(id)
      .then(setDeck)
      .catch(setError)
      .finally(() => setIsLoading(false))
  }, [id])

  return { deck, isLoading, error }
}