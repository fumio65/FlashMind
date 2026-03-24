import { useState, useEffect } from 'react'
import { useAuthStore }  from '@/features/auth/store/authStore'
import { getClasses }    from '@/features/classes/api/classes'
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
    ])
      .then(([myClasses, sessionData]) => {
        setData({
          user,
          myClasses,
          mySessions: sessionData.sessions,
        })
      })
      .finally(() => setIsLoading(false))
  }, [user])

  return { data, isLoading }
}