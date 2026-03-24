import 'dotenv/config'
import mongoose from 'mongoose'
import { User } from '../src/models/User.js'

const ADMIN = {
  name:     process.env.ADMIN_NAME     || 'Admin',
  username: process.env.ADMIN_USERNAME || 'admin',
  email:    process.env.ADMIN_EMAIL    || 'admin@flashmind.com',
  password: process.env.ADMIN_PASSWORD || 'Admin@12345',
  role:     'admin',
  status:   'active',
}

await mongoose.connect(process.env.MONGODB_URI)
console.log('✅ Connected to:', mongoose.connection.db.databaseName)

const existing = await User.findOne({
  $or: [{ email: ADMIN.email }, { username: ADMIN.username }]
})

if (existing) {
  console.log(`⚠️  Admin already exists: ${existing.email} (role: ${existing.role})`)
  console.log('   If you want to reset, delete the user from MongoDB first.')
  process.exit(0)
}

const admin = await User.create(ADMIN)
console.log('✅ Admin created successfully!')
console.log(`   Name:     ${admin.name}`)
console.log(`   Username: ${admin.username}`)
console.log(`   Email:    ${admin.email}`)
console.log(`   Role:     ${admin.role}`)
console.log('')
console.log('🔐 Login credentials:')
console.log(`   Email:    ${ADMIN.email}`)
console.log(`   Password: ${ADMIN.password}`)

process.exit(0)