import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { registerUser } from '../api/auth.api'

export function useRegister() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError]         = useState(null)
  const setAuth                   = useAuthStore((s) => s.setAuth)
  const navigate                  = useNavigate()

  const register = async (data) => {
    setIsLoading(true)
    setError(null)
    try {
      const { token, user } = await registerUser(data)
      setAuth({ token, user })
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.message ?? 'Registration failed')
    } finally {
      setIsLoading(false)
    }
  }

  return { register, isLoading, error }
}