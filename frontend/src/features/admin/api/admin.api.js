import { MOCK_DECKS, MOCK_SESSIONS } from '@/features/decks/api/decks.api'

const MOCK_USERS = [
  { _id: '1', name: 'Juan dela Cruz',  username: 'juandc',      email: 'juan@example.com',  role: 'student', status: 'active',    studyStreak: 5,  createdAt: new Date('2024-01-15') },
  { _id: '2', name: 'Admin User',      username: 'admin',       email: 'admin@example.com', role: 'admin',   status: 'active',    studyStreak: 12, createdAt: new Date('2024-01-01') },
  { _id: '3', name: 'Maria Santos',    username: 'mariasantos', email: 'maria@example.com', role: 'creator', status: 'active',    studyStreak: 8,  createdAt: new Date('2024-02-10') },
  { _id: '4', name: 'Pedro Reyes',     username: 'pedror',      email: 'pedro@example.com', role: 'student', status: 'suspended', studyStreak: 0,  createdAt: new Date('2024-03-01') },
  { _id: '5', name: 'Ana Gonzales',    username: 'anagonz',     email: 'ana@example.com',   role: 'student', status: 'active',    studyStreak: 3,  createdAt: new Date('2024-03-20') },
  { _id: '6', name: 'Carlo Mendoza',   username: 'carlom',      email: 'carlo@example.com', role: 'creator', status: 'active',    studyStreak: 15, createdAt: new Date('2024-04-01') },
]

const MOCK_FLAGGED = [
  { _id: '7', title: 'Inappropriate Deck Example', category: 'IT', owner: { username: 'badactor' }, reportCount: 3, createdAt: new Date('2024-04-05') },
]

export const getAdminStats = () =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        totalUsers:    MOCK_USERS.length,
        totalDecks:    MOCK_DECKS.length,
        totalSessions: MOCK_SESSIONS.length,
        flaggedDecks:  MOCK_FLAGGED.length,
        recentUsers:   MOCK_USERS.slice(0, 4),
        flagged:       MOCK_FLAGGED,
      })
    }, 400)
  })

export const getAdminDecks = (filters = {}) =>
  new Promise((resolve) => {
    setTimeout(() => {
      let results = [...MOCK_DECKS, ...MOCK_FLAGGED]
      if (filters.status === 'public')   results = results.filter((d) => d.isPublic)
      if (filters.status === 'private')  results = results.filter((d) => !d.isPublic)
      if (filters.status === 'reported') results = MOCK_FLAGGED
      if (filters.q) {
        const q = filters.q.toLowerCase()
        results = results.filter((d) => d.title.toLowerCase().includes(q))
      }
      resolve(results)
    }, 300)
  })

export const getAdminUsers = (filters = {}) =>
  new Promise((resolve) => {
    setTimeout(() => {
      let results = [...MOCK_USERS]
      if (filters.role && filters.role !== 'all')         results = results.filter((u) => u.role === filters.role)
      if (filters.status === 'suspended')                 results = results.filter((u) => u.status === 'suspended')
      if (filters.q) {
        const q = filters.q.toLowerCase()
        results = results.filter(
          (u) => u.name.toLowerCase().includes(q) || u.username.toLowerCase().includes(q)
        )
      }
      resolve(results)
    }, 300)
  })

export const deleteAdminDeck  = (id)         => new Promise((r) => setTimeout(() => r({ success: true }), 400))
export const updateUserRole   = (id, role)   => new Promise((r) => setTimeout(() => r({ success: true }), 400))
export const suspendUser      = (id)         => new Promise((r) => setTimeout(() => r({ success: true }), 400))
export const banUser          = (id)         => new Promise((r) => setTimeout(() => r({ success: true }), 400))