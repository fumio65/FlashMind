import { useState, useEffect } from 'react'
import { getDecks } from '../api/decks.api'

export function useDecks(filters = {}) {
  const [decks, setDecks]       = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError]       = useState(null)

  useEffect(() => {
    setIsLoading(true)
    getDecks(filters)
      .then(setDecks)
      .catch(setError)
      .finally(() => setIsLoading(false))
  }, [filters.q, filters.category, filters.sort])

  return { decks, isLoading, error }
}