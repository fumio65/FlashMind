import api from '@/lib/axios'

// ── Classes ──
export const getClasses = (params) =>
  api.get('/classes', { params }).then((r) => r.data)

export const getClass = (id) =>
  api.get(`/classes/${id}`).then((r) => r.data)

export const createClass = (data) =>
  api.post('/classes', data).then((r) => r.data)

export const updateClass = (id, data) =>
  api.put(`/classes/${id}`, data).then((r) => r.data)

export const deleteClass = (id) =>
  api.delete(`/classes/${id}`).then((r) => r.data)

export const getDecksByClass = (id) =>
  api.get(`/classes/${id}/decks`).then((r) => r.data)

// ── Decks ──
export const getDeck = (id) =>
  api.get(`/decks/${id}`).then((r) => r.data)

export const createDeck = (data) =>
  api.post('/decks', data).then((r) => r.data)

export const updateDeck = (id, data) =>
  api.put(`/decks/${id}`, data).then((r) => r.data)

export const deleteDeck = (id) =>
  api.delete(`/decks/${id}`).then((r) => r.data)

export const addCards = (deckId, cards) =>
  api.post(`/decks/${deckId}/cards`, { cards }).then((r) => r.data)

// ── Cards ──
export const updateCard = (id, data) =>
  api.put(`/cards/${id}`, data).then((r) => r.data)

export const deleteCard = (id) =>
  api.delete(`/cards/${id}`).then((r) => r.data)

// ── Stats (for dashboard) ──
export const getMyStats = () =>
  api.get('/sessions/stats').then((r) => r.data)

export const copyClass = (id) =>
  api.post(`/classes/${id}/copy`).then((r) => r.data)

export const saveSession = (data) =>
  api.post('/sessions', data).then((r) => r.data)

// ── Ratings ──
export const saveRatings = (deckId, ratings) =>
  api.post('/ratings', { deckId, ratings }).then((r) => r.data)

export const getDeckRatings = (deckId) =>
  api.get(`/ratings/${deckId}`).then((r) => r.data)

export const getDeckStats = (deckId) =>
  api.get(`/sessions/deck/${deckId}`).then((r) => r.data)

// ── Constants (kept for UI use) ──
export const CLASS_COLORS = [
  { label: 'Ocean',   value: 'from-blue-400 to-cyan-400'    },
  { label: 'Purple',  value: 'from-purple-500 to-pink-400'  },
  { label: 'Green',   value: 'from-emerald-400 to-teal-400' },
  { label: 'Orange',  value: 'from-orange-400 to-amber-400' },
  { label: 'Rose',    value: 'from-rose-400 to-pink-500'    },
  { label: 'Indigo',  value: 'from-indigo-400 to-violet-400'},
]

export const CLASS_ICONS = {
  emoji: [
    '📚', '📐', '🧬', '💻', '🏛️', 'PH', '🔬', '📊',
    '📝', '🎯', '✏️', '📈', '🌐', '⚡', '🔭', '🎨',
    '📖', '⚖️', '🌱', '🎵',
  ],
  lucide: [
    'BookOpen', 'Calculator', 'FlaskConical', 'Monitor', 'Landmark',
    'Microscope', 'BarChart2', 'FileText', 'Target', 'PenLine',
    'TrendingUp', 'Globe', 'Zap', 'Telescope', 'Palette',
    'Scale', 'Sprout', 'Music', 'Atom', 'Brain',
    'Code2', 'Database', 'Layers', 'Network', 'Shield',
  ],
}