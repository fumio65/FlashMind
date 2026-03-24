import { useState, useEffect } from 'react'
import { getAdminUsers, suspendUser, banUser, unbanUser } from '../api/admin.api'

export function useAdminUsers(filters = {}) {
  const [allUsers, setAllUsers]   = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setIsLoading(true)
    getAdminUsers({})
      .then(setAllUsers)
      .finally(() => setIsLoading(false))
  }, [])

  const users = allUsers.filter((u) => {
    if (filters.role   && filters.role   !== 'all' && u.role   !== filters.role)   return false
    if (filters.status && filters.status !== 'all' && u.status !== filters.status) return false
    if (filters.q) {
      const q = filters.q.toLowerCase()
      if (!u.name.toLowerCase().includes(q) && !u.username.toLowerCase().includes(q)) return false
    }
    return true
  })

  const toggleSuspend = async (id) => {
    await suspendUser(id)
    setAllUsers((prev) => prev.map((u) =>
      u._id === id
        ? { ...u, status: u.status === 'suspended' ? 'active' : 'suspended' }
        : u
    ))
  }

  const removeUser = async (id) => {
    await banUser(id)
    setAllUsers((prev) => prev.map((u) =>
      u._id === id ? { ...u, status: 'banned' } : u
    ))
  }

  const restoreUser = async (id) => {
    await unbanUser(id)
    setAllUsers((prev) => prev.map((u) =>
      u._id === id ? { ...u, status: 'active' } : u
    ))
  }

  return { users, isLoading, toggleSuspend, removeUser, restoreUser }
}