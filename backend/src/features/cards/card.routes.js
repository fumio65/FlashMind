import { Router } from 'express'
import { updateCard, deleteCard } from './card.controller.js'
import { authMiddleware } from '../../middleware/auth.middleware.js'

const router = Router()

router.put   ('/:id', authMiddleware, updateCard)
router.delete('/:id', authMiddleware, deleteCard)

export const cardRoutes = router