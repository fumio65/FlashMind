import { Router } from 'express'
import {
  getClasses, getClass,
  createClass, updateClass, deleteClass,
  getDecksByClass, copyClass,
} from './class.controller.js'
import { authMiddleware } from '../../middleware/auth.middleware.js'

const router = Router()

router.get   ('/',          authMiddleware, getClasses)
router.post  ('/',          authMiddleware, createClass)
router.get   ('/:id',       authMiddleware, getClass)
router.put   ('/:id',       authMiddleware, updateClass)
router.delete('/:id',       authMiddleware, deleteClass)
router.post  ('/:id/copy',  authMiddleware, copyClass)
router.get   ('/:id/decks', authMiddleware, getDecksByClass)

export const classRoutes = router