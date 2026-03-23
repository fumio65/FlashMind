import { Router } from 'express'
import {
  getDeck, createDeck,
  updateDeck, deleteDeck,
  addCards,
} from './deck.controller.js'
import { authMiddleware } from '../../middleware/auth.middleware.js'

const router = Router()

router.get   ('/:id',       authMiddleware, getDeck)
router.post  ('/',          authMiddleware, createDeck)
router.put   ('/:id',       authMiddleware, updateDeck)
router.delete('/:id',       authMiddleware, deleteDeck)
router.post  ('/:id/cards', authMiddleware, addCards)

export const deckRoutes = router