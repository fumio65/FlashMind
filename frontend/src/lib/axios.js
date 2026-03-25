import axios from 'axios'
import { useAuthStore } from '@/features/auth/store/authStore'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
})

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (res) => res,
  (err) => {
    const url         = err.config?.url ?? ''
    const isAuthRoute = url.includes('/auth/login') || url.includes('/auth/register')
    const is401       = err.response?.status === 401

    if (is401 && !isAuthRoute) {
      useAuthStore.getState().clearAuth()
      window.location.href = '/login'
    }

    return Promise.reject(err)
  }
)

export default api