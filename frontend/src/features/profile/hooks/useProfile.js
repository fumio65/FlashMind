import { useState, useEffect } from 'react'
import { useAuthStore } from '@/features/auth/store/authStore'
import { MOCK_DECKS, MOCK_SESSIONS } from '@/features/decks/api/decks.api'

export function useProfile() {
  const user                      = useAuthStore((s) => s.user)
  const [isLoading, setIsLoading] = useState(true)
  const [data, setData]           = useState(null)

  useEffect(() => {
    setTimeout(() => {
      const myDecks    = MOCK_DECKS.filter((d) => d.owner._id === user?._id)
      const mySessions = MOCK_SESSIONS
      setData({ user, myDecks, mySessions })
      setIsLoading(false)
    }, 400)
  }, [user])

  return { data, isLoading }
}