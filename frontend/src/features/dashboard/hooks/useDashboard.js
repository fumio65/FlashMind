import { useState, useEffect } from 'react'
import { getMyStats } from '@/features/decks/api/decks.api'

export function useDashboard() {
  const [stats, setStats]       = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError]       = useState(null)

  useEffect(() => {
    getMyStats()
      .then(setStats)
      .catch(setError)
      .finally(() => setIsLoading(false))
  }, [])

  return { stats, isLoading, error }
}