import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/features/auth/store/authStore'
import { registerUser } from '@/features/auth/api/auth.api'

export function useRegister() {
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const setAuth = useAuthStore((s) => s.setAuth)
  const navigate = useNavigate()

  const register = async (data) => {
    setIsLoading(true)
    setError(null)
    try {
      const { token, user } = await registerUser(data)
      setAuth({ token, user })
      navigate('/dashboard')
    } catch (err) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  return { register, isLoading, error }
}