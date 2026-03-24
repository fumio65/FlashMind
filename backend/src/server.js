import 'dotenv/config'
import app              from './app.js'
import { connectDB }    from './lib/db.js'
import { bootstrapAdmin } from './lib/bootstrap.js'

const PORT = process.env.PORT || 3000

connectDB().then(async () => {
  // Create default admin if none exists
  await bootstrapAdmin()

  app.listen(PORT, () => {
    console.log(`🚀 FlashMind API running on http://localhost:${PORT}`)
    console.log(`   Environment: ${process.env.NODE_ENV ?? 'development'}`)
  })
})