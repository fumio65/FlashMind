import { useState, useEffect } from 'react'
import { getAdminUsers, updateUserRole, suspendUser, banUser } from '../api/admin.api'

export function useAdminUsers(filters = {}) {
  const [users, setUsers]         = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setIsLoading(true)
    getAdminUsers(filters)
      .then(setUsers)
      .finally(() => setIsLoading(false))
  }, [filters.role, filters.status, filters.q])

  const promoteUser = async (id, role) => {
    await updateUserRole(id, role)
    setUsers((prev) => prev.map((u) => u._id === id ? { ...u, role } : u))
  }

  const toggleSuspend = async (id) => {
    await suspendUser(id)
    setUsers((prev) => prev.map((u) =>
      u._id === id ? { ...u, status: u.status === 'suspended' ? 'active' : 'suspended' } : u
    ))
  }

  const removeUser = async (id) => {
    await banUser(id)
    setUsers((prev) => prev.filter((u) => u._id !== id))
  }

  return { users, isLoading, promoteUser, toggleSuspend, removeUser }
}