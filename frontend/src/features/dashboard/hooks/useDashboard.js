import { useState, useEffect } from 'react'
import { getMyStats, getClasses } from '@/features/classes/api/classes'
import { useAuthStore } from '@/features/auth/store/authStore'

export function useDashboard() {
  const user                      = useAuthStore((s) => s.user)
  const [data, setData]           = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError]         = useState(null)

  useEffect(() => {
    setIsLoading(true)
    Promise.all([
      getMyStats(),
      getClasses({ onlyMine: true }),
    ])
      .then(([stats, myClasses]) => {
        setData({ ...stats, myClasses, user })
      })
      .catch(setError)
      .finally(() => setIsLoading(false))
  }, [])

  return { data, isLoading, error }
}