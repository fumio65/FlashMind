import 'dotenv/config'
import app                from './app.js'
import { connectDB }      from './lib/db.js'
import { bootstrapAdmin } from './lib/bootstrap.js'

// Import models index to register all associations before sync
import './models/index.js'

const PORT = process.env.PORT || 3000

connectDB().then(async () => {
  await bootstrapAdmin()
  app.listen(PORT, () => {
    console.log(`🚀 FlashMind API running on http://localhost:${PORT}`)
    console.log(`   Environment: ${process.env.NODE_ENV ?? 'development'}`)
  })
})