import { useState, useEffect } from 'react'
import { getClass, getDecksByClass } from '../api/classes'

export function useClass(id) {
  const [cls, setCls]             = useState(null)
  const [decks, setDecks]         = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError]         = useState(null)

  useEffect(() => {
    if (!id) return
    setIsLoading(true)
    Promise.all([getClass(id), getDecksByClass(id)])
      .then(([c, d]) => { setCls(c); setDecks(d) })
      .catch(setError)
      .finally(() => setIsLoading(false))
  }, [id])

  return { cls, decks, isLoading, error }
}