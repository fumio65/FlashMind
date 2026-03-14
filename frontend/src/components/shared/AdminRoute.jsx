import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '@/features/auth/store/authStore'

export function AdminRoute() {
  const user = useAuthStore((s) => s.user)
  return user?.role === 'admin' ? <Outlet /> : <Navigate to="/dashboard" replace />
}