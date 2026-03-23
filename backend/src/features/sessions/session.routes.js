import { Router } from 'express'
import {
  saveSession,
  getMySessions,
  getMyStats,
} from './session.controller.js'
import { authMiddleware } from '../../middleware/auth.middleware.js'

const router = Router()

router.post('/me',    authMiddleware, saveSession)
router.get ('/me',    authMiddleware, getMySessions)
router.get ('/stats', authMiddleware, getMyStats)

export const sessionRoutes = router