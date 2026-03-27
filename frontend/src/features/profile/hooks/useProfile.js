import { useState, useEffect } from 'react'
import { useAuthStore }  from '@/features/auth/store/authStore'
import { getClasses, getMyStats } from '@/features/classes/api/classes'
import api               from '@/lib/axios'

export function useProfile() {
  const user                      = useAuthStore((s) => s.user)
  const [isLoading, setIsLoading] = useState(true)
  const [data, setData]           = useState(null)

  useEffect(() => {
    setIsLoading(true)
    Promise.all([
      getClasses({ onlyMine: true }),
      api.get('/sessions/me').then((r) => r.data),
      getMyStats(),
    ])
      .then(([myClasses, sessionData, stats]) => {
        setData({
          user,
          myClasses,
          mySessions:     sessionData.sessions,
          cardsMastered:  stats.cardsMastered  ?? 0,
          totalCards:     stats.totalCards     ?? 0,
          mastery:        stats.mastery        ?? 0,
          totalSessions:  stats.totalSessions  ?? 0,
        })
      })
      .finally(() => setIsLoading(false))
  }, [user])

  return { data, isLoading }
}