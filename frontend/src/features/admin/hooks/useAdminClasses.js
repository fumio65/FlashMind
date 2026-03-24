import { useState, useEffect } from 'react'
import { getAdminClasses, deleteAdminClass } from '../api/admin.api'

export function useAdminClasses(filters = {}) {
  const [classes, setClasses]     = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setIsLoading(true)
    getAdminClasses(filters)
      .then(setClasses)
      .finally(() => setIsLoading(false))
  }, [filters.status, filters.q])

  const removeClass = async (id) => {
    await deleteAdminClass(id)
    setClasses((prev) => prev.filter((c) => c._id !== id))
  }

  return { classes, isLoading, removeClass }
}