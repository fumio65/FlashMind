import cloudinary from '../../lib/cloudinary.js'
import { Readable } from 'stream'

// Helper: upload buffer to Cloudinary
const uploadToCloudinary = (buffer, folder, options = {}) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, ...options },
      (error, result) => {
        if (error) reject(error)
        else resolve(result)
      }
    )
    Readable.from(buffer).pipe(stream)
  })
}

// POST /api/upload/avatar
export const uploadAvatar = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' })
  }

  const result = await uploadToCloudinary(
    req.file.buffer,
    'flashmind/avatars',
    {
      transformation: [
        { width: 200, height: 200, crop: 'fill', gravity: 'face' },
        { quality: 'auto', fetch_format: 'auto' },
      ],
    }
  )

  res.json({ url: result.secure_url })
}

// POST /api/upload/card-image
export const uploadCardImage = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' })
  }

  const result = await uploadToCloudinary(
    req.file.buffer,
    'flashmind/cards',
    {
      transformation: [
        { width: 800, height: 600, crop: 'limit' },
        { quality: 'auto', fetch_format: 'auto' },
      ],
    }
  )

  res.json({ url: result.secure_url })
}