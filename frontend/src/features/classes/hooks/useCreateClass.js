import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createClass } from '../api/classes'

export function useCreateClass() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError]         = useState(null)
  const navigate                  = useNavigate()

  const submit = async (data) => {
    setIsLoading(true)
    setError(null)
    try {
      const cls = await createClass(data)
      navigate(`/classes/${cls._id}`)
    } catch (err) {
      setError(err.response?.data?.message ?? 'Failed to create subject')
    } finally {
      setIsLoading(false)
    }
  }

  return { submit, isLoading, error }
}