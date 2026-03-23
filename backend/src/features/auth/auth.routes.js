import { Router } from 'express'
import {
  register, login, getMe,
  updateProfile, updatePassword,
} from './auth.controller.js'
import { authMiddleware } from '../../middleware/auth.middleware.js'

const router = Router()

router.post('/register', register)
router.post('/login',    login)
router.get ('/me',       authMiddleware, getMe)
router.put ('/profile',  authMiddleware, updateProfile)
router.put ('/password', authMiddleware, updatePassword)

export const authRoutes = router