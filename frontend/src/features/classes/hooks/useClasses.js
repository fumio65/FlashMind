import { useState, useEffect } from 'react'
import { getClasses } from '../api/classes'

export function useClasses(filters = {}) {
  const [classes, setClasses]     = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError]         = useState(null)

  useEffect(() => {
    setIsLoading(true)
    getClasses(filters)
      .then(setClasses)
      .catch(setError)
      .finally(() => setIsLoading(false))
  }, [filters.q, filters.onlyMine])

  return { classes, isLoading, error, setClasses }
}