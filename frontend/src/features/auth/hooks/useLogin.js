import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/features/auth/store/authStore'
import { loginUser } from '@/features/auth/api/auth.api'

export function useLogin() {
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const setAuth = useAuthStore((s) => s.setAuth)
  const navigate = useNavigate()

  const login = async (data) => {
    setIsLoading(true)
    setError(null)
    try {
      const { token, user } = await loginUser(data)
      setAuth({ token, user })
      navigate('/dashboard')
    } catch (err) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  return { login, isLoading, error }
}