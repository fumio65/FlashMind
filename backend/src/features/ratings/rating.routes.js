import { Router } from 'express'
import { saveRatings, getDeckRatings } from './rating.controller.js'
import { authMiddleware } from '../../middleware/auth.middleware.js'

const router = Router()

router.post('/',           authMiddleware, saveRatings)
router.get ('/:deckId',    authMiddleware, getDeckRatings)

export const ratingRoutes = router