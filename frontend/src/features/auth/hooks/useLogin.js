import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { loginUser } from '../api/auth.api'

export function useLogin() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError]         = useState(null)
  const setAuth                   = useAuthStore((s) => s.setAuth)
  const navigate                  = useNavigate()

  const login = async (data) => {
    setIsLoading(true)
    setError(null)
    try {
      const { token, user } = await loginUser(data)
      setAuth({ token, user })
      navigate(user.role === 'admin' ? '/admin' : '/dashboard')
    } catch (err) {
      setError(err.response?.data?.message ?? 'Login failed')
    } finally {
      setIsLoading(false)
    }
  }

  return { login, isLoading, error }
}