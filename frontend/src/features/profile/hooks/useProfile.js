import { useState, useEffect } from 'react'
import { useAuthStore } from '@/features/auth/store/authStore'
import { getClasses } from '@/features/classes/api/classes'
import { MOCK_SESSIONS } from '../../decks/api/decks.api'

export function useProfile() {
  const user                      = useAuthStore((s) => s.user)
  const [isLoading, setIsLoading] = useState(true)
  const [data, setData]           = useState(null)

  useEffect(() => {
    getClasses({ onlyMine: true })
      .then((myClasses) => {
        setData({ user, myClasses, mySessions: MOCK_SESSIONS })
      })
      .finally(() => setIsLoading(false))
  }, [user])

  return { data, isLoading }
}