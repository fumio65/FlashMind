import { Router } from 'express'
import {
  saveSession,
  getMySessions,
  getMyStats,
  getDeckStats,
} from './session.controller.js'
import { authMiddleware } from '../../middleware/auth.middleware.js'

const router = Router()

router.post('/',      authMiddleware, saveSession)
router.get ('/me',    authMiddleware, getMySessions)
router.get ('/stats', authMiddleware, getMyStats)
router.get('/deck/:deckId', authMiddleware, getDeckStats)

export const sessionRoutes = router