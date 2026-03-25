import { User } from '../models/index.js'
import bcrypt   from 'bcrypt'

export const bootstrapAdmin = async () => {
  try {
    const adminExists = await User.findOne({ where: { role: 'admin' } })
    if (adminExists) {
      console.log(`✅ Admin exists: ${adminExists.email}`)
      return
    }

    const hashedPassword = await bcrypt.hash(
      process.env.ADMIN_PASSWORD || 'Admin@12345', 10
    )

    const admin = await User.create({
      name:     process.env.ADMIN_NAME     || 'Admin',
      username: process.env.ADMIN_USERNAME || 'admin',
      email:    process.env.ADMIN_EMAIL    || 'admin@flashmind.com',
      password: process.env.ADMIN_PASSWORD || 'Admin@12345',
      role:     'admin',
      status:   'active',
    })

    console.log('✅ Default admin created from environment variables')
    console.log(`   Email:    ${admin.email}`)
    console.log(`   Password: ${process.env.ADMIN_PASSWORD || 'Admin@12345'}`)
    console.log('   ⚠️  Change this password after first login!')
  } catch (err) {
    console.error('❌ Failed to bootstrap admin:', err.message)
  }
}