import { Router } from 'express'
import multer     from 'multer'
import {
  uploadAvatar,
  uploadCardImage,
} from './upload.controller.js'
import { authMiddleware } from '../../middleware/auth.middleware.js'

// Store file in memory (buffer) before sending to Cloudinary
const storage = multer.memoryStorage()

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true)
  } else {
    cb(new Error('Only image files are allowed'), false)
  }
}

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
})

const router = Router()

router.post('/avatar',     authMiddleware, upload.single('image'), uploadAvatar)
router.post('/card-image', authMiddleware, upload.single('image'), uploadCardImage)

export const uploadRoutes = router