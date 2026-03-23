import 'dotenv/config'
import app         from './app.js'
import { connectDB } from './lib/db.js'

const PORT = process.env.PORT || 3000

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 FlashMind API running on http://localhost:${PORT}`)
    console.log(`   Environment: ${process.env.NODE_ENV ?? 'development'}`)
  })
})