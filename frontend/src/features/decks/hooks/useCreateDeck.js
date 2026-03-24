import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createDeck } from '@/features/classes/api/classes'

export function useCreateDeck() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError]         = useState(null)
  const navigate                  = useNavigate()

  const submit = async ({ classId, title, description, isPublic, cards }) => {
    setIsLoading(true)
    setError(null)
    try {
      const deck = await createDeck({ classId, title, description, isPublic, cards })
      navigate(`/decks/${deck._id}`)
    } catch (err) {
      setError(err.response?.data?.message ?? 'Failed to create deck')
    } finally {
      setIsLoading(false)
    }
  }

  return { submit, isLoading, error }
}