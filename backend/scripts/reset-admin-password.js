import 'dotenv/config'
import { sequelize } from '../src/lib/db.js'
import '../src/models/index.js'
import { User }      from '../src/models/index.js'

await sequelize.authenticate()

const admin = await User.findOne({
  where: { email: process.env.ADMIN_EMAIL || 'admin@flashmind.com' }
})

if (!admin) {
  console.log('❌ Admin not found')
  process.exit(1)
}

admin.password = process.env.ADMIN_PASSWORD || 'Admin@12345'
await admin.save()

console.log('✅ Admin password reset successfully')
console.log(`   Email:    ${admin.email}`)
console.log(`   Password: ${process.env.ADMIN_PASSWORD || 'Admin@12345'}`)
process.exit(0)