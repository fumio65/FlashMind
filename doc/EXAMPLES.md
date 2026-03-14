# EXAMPLES.md — FlashMind

> Code patterns to match when generating new code for this project.

---

## Feature Hook Pattern
```js
// src/features/decks/hooks/useDecks.js
import { useState, useEffect } from 'react'
import { getDecks } from '../api/decks.api'

export function useDecks(filters = {}) {
  const [decks, setDecks]     = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError]     = useState(null)

  useEffect(() => {
    setIsLoading(true)
    getDecks(filters)
      .then(setDecks)
      .catch(setError)
      .finally(() => setIsLoading(false))
  }, [filters.q, filters.category, filters.sort])

  return { decks, isLoading, error }
}
```

## API Module Pattern
```js
// src/features/decks/api/decks.api.js
import api from '@/lib/axios'

export const getDecks     = (params) => api.get('/decks', { params }).then(r => r.data)
export const getDeck      = (id)     => api.get(`/decks/${id}`).then(r => r.data)
export const createDeck   = (data)   => api.post('/decks', data).then(r => r.data)
export const updateDeck   = (id, data) => api.put(`/decks/${id}`, data).then(r => r.data)
export const deleteDeck   = (id)     => api.delete(`/decks/${id}`).then(r => r.data)
export const copyDeck     = (id)     => api.post(`/decks/${id}/copy`).then(r => r.data)
```

## Zustand Store Pattern
```js
// src/features/auth/store/authStore.js
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useAuthStore = create(
  persist(
    (set) => ({
      token: null,
      user:  null,
      setAuth:  ({ token, user }) => set({ token, user }),
      clearAuth: () => set({ token: null, user: null }),
    }),
    { name: 'flashmind-auth' }
  )
)
```

## Axios Instance + Interceptor
```js
// src/lib/axios.js
import axios from 'axios'
import { useAuthStore } from '@/features/auth/store/authStore'

const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api' })

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      useAuthStore.getState().clearAuth()
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

export default api
```

## Form with React Hook Form + Zod
```jsx
// Pattern used in LoginPage, RegisterPage, CreateDeckPage
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input }  from '@/components/ui/input'

const schema = z.object({
  email:    z.string().email('Invalid email'),
  password: z.string().min(8, 'Minimum 8 characters'),
})

export function LoginForm({ onSubmit }) {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <Input {...register('email')}    placeholder="Email"    />
      {errors.email    && <p className="text-red-500 text-sm">{errors.email.message}</p>}
      <Input {...register('password')} placeholder="Password" type="password" />
      {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Signing in...' : 'Sign In'}
      </Button>
    </form>
  )
}
```

## ProtectedRoute
```jsx
// src/components/shared/ProtectedRoute.jsx
import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '@/features/auth/store/authStore'

export function ProtectedRoute() {
  const token = useAuthStore((s) => s.token)
  return token ? <Outlet /> : <Navigate to="/login" replace />
}
```

## AdminRoute
```jsx
// src/components/shared/AdminRoute.jsx
import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '@/features/auth/store/authStore'

export function AdminRoute() {
  const user = useAuthStore((s) => s.user)
  return user?.role === 'admin' ? <Outlet /> : <Navigate to="/dashboard" replace />
}
```

## Feature Barrel File
```js
// src/features/decks/index.js — only export what other features need
export { DeckCard }    from './components/DeckCard'
export { DeckGrid }    from './components/DeckGrid'
export { useDecks }    from './hooks/useDecks'
export { useCreateDeck } from './hooks/useCreateDeck'
```

## Page (Thin Composer)
```jsx
// src/pages/BrowsePage.jsx — zero business logic here
import { DeckGrid, useDecks } from '@/features/decks'
import { Input }   from '@/components/ui/input'
import { useDebounce } from '@/hooks/useDebounce'
import { useState } from 'react'

export default function BrowsePage() {
  const [query, setQuery] = useState('')
  const debouncedQuery    = useDebounce(query, 300)
  const { decks, isLoading } = useDecks({ q: debouncedQuery })

  return (
    <div className="p-6">
      <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search decks..." />
      <DeckGrid decks={decks} isLoading={isLoading} />
    </div>
  )
}
```

## cn() Usage (shadcn/ui utility)
```js
// src/lib/utils.js
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

// Usage in components:
<div className={cn("flex gap-4", isActive && "bg-blue-500", className)} />
```

## Mock Data Shape (Frontend Phase)
```js
// src/features/decks/api/decks.api.js — mock version for frontend phase
const MOCK_DECKS = [
  { _id: '1', title: 'Calculus — Limits', category: 'Math', isPublic: true,
    owner: { username: 'mathpro' }, cards: [], coverImage: null, createdAt: new Date() },
]

export const getDecks = () => Promise.resolve(MOCK_DECKS)
export const getDeck  = (id) => Promise.resolve(MOCK_DECKS.find(d => d._id === id))
```

## Express 5 Route Handler Pattern
```js
// server/src/features/decks/deck.routes.js
import { Router } from 'express'
import { authMiddleware } from '../../middleware/auth.middleware.js'
import { getDecks, createDeck, deleteDeck } from './deck.controller.js'

const router = Router()

router.get('/',    getDecks)                          // public
router.post('/',   authMiddleware, createDeck)        // JWT required
router.delete('/:id', authMiddleware, deleteDeck)     // JWT + ownership check

export default router
```

```js
// server/src/features/decks/deck.controller.js
// Express 5: no try/catch needed — rejected promises auto-caught
export const getDecks = async (req, res) => {
  const { q, category, sort } = req.query
  const filter = { isPublic: true }
  if (category) filter.category = category
  const decks = await Deck.find(filter).populate('owner', 'username avatar')
  res.json(decks)
}
```
