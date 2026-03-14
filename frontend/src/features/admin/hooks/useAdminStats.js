import { useState, useEffect } from 'react'
import { getAdminStats } from '../api/admin.api'

export function useAdminStats() {
  const [stats, setStats]         = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    getAdminStats()
      .then(setStats)
      .finally(() => setIsLoading(false))
  }, [])

  return { stats, isLoading }
}