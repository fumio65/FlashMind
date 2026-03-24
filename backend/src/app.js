import express  from 'express'
import cors     from 'cors'
import helmet   from 'helmet'
import morgan   from 'morgan'

// Route imports — added as we build each feature
import { authRoutes }    from './features/auth/auth.routes.js'
import { classRoutes }   from './features/classes/class.routes.js'
import { deckRoutes }    from './features/decks/deck.routes.js'
import { cardRoutes }    from './features/cards/card.routes.js'
import { sessionRoutes } from './features/sessions/session.routes.js'
import { uploadRoutes }  from './features/upload/upload.routes.js'
import { adminRoutes }   from './features/admin/admin.routes.js'
import { ratingRoutes }  from './features/ratings/rating.routes.js'

const app = express()

// ── Global Middleware ──
app.use(helmet())
app.use(cors({
  origin:      process.env.CLIENT_URL,
  credentials: true,
}))
app.use(morgan('dev'))
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// ── Routes ──
app.use('/api/auth',     authRoutes)
app.use('/api/classes',  classRoutes)
app.use('/api/decks',    deckRoutes)
app.use('/api/cards',    cardRoutes)
app.use('/api/sessions', sessionRoutes)
app.use('/api/ratings', ratingRoutes)
app.use('/api/upload',   uploadRoutes)
app.use('/api/admin',    adminRoutes)

// ── Health check ──
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// ── 404 handler ──
app.use((req, res) => {
  res.status(404).json({ message: `Route ${req.method} ${req.url} not found` })
})

// ── Global error handler ──
app.use((err, req, res, next) => {
  console.error(err.stack)
  const status  = err.status ?? 500
  const message = err.message ?? 'Internal server error'
  res.status(status).json({ message })
})

export default app