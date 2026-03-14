import { useState, useEffect } from 'react'
import { getAdminDecks, deleteAdminDeck } from '../api/admin.api'

export function useAdminDecks(filters = {}) {
  const [decks, setDecks]         = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setIsLoading(true)
    getAdminDecks(filters)
      .then(setDecks)
      .finally(() => setIsLoading(false))
  }, [filters.status, filters.q])

  const removeDeck = async (id) => {
    await deleteAdminDeck(id)
    setDecks((prev) => prev.filter((d) => d._id !== id))
  }

  return { decks, isLoading, removeDeck }
}