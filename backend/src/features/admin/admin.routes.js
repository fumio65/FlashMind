import { Router } from 'express'
import {
  getAdminStats,
  getAdminUsers,
  suspendUser,
  banUser,
  unbanUser,
  getAdminClasses,
  deleteAdminClass,
  getAdminDecks,
  deleteAdminDeck,
} from './admin.controller.js'
import { authMiddleware }  from '../../middleware/auth.middleware.js'
import { adminMiddleware } from '../../middleware/admin.middleware.js'

const router = Router()

// All admin routes require auth + admin role
router.use(authMiddleware, adminMiddleware)

// Stats
router.get('/stats', getAdminStats)

// Users
router.get('/users',              getAdminUsers)
router.put('/users/:id/suspend',  suspendUser)
router.put('/users/:id/ban',      banUser)
router.put('/users/:id/unban',    unbanUser)

// Classes
router.get   ('/classes',     getAdminClasses)
router.delete('/classes/:id', deleteAdminClass)

// Decks
router.get   ('/decks',     getAdminDecks)
router.delete('/decks/:id', deleteAdminDeck)

export const adminRoutes = router