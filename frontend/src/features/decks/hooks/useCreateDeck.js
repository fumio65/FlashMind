import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createDeck } from '../api/decks.api'

export function useCreateDeck() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError]         = useState(null)
  const navigate                  = useNavigate()

  const submit = async (data) => {
    setIsLoading(true)
    setError(null)
    try {
      const deck = await createDeck(data)
      navigate(`/decks/${deck._id}`)
    } catch (err) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  return { submit, isLoading, error }
}