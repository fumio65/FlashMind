import api from '@/lib/axios'

export const getAdminStats   = ()             => api.get('/admin/stats').then((r) => r.data)
export const getAdminUsers   = (params)       => api.get('/admin/users', { params }).then((r) => r.data)
export const getAdminClasses = (params)       => api.get('/admin/classes', { params }).then((r) => r.data)
export const getAdminDecks   = (params)       => api.get('/admin/decks', { params }).then((r) => r.data)

export const suspendUser     = (id)           => api.put(`/admin/users/${id}/suspend`).then((r) => r.data)
export const banUser         = (id)           => api.put(`/admin/users/${id}/ban`).then((r) => r.data)
export const unbanUser       = (id)           => api.put(`/admin/users/${id}/unban`).then((r) => r.data)

export const deleteAdminClass = (id)          => api.delete(`/admin/classes/${id}`).then((r) => r.data)
export const deleteAdminDeck  = (id)          => api.delete(`/admin/decks/${id}`).then((r) => r.data)