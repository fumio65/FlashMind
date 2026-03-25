import { Sequelize } from 'sequelize'

export const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host:    process.env.DB_HOST || 'localhost',
    port:    process.env.DB_PORT || 3306,
    dialect: 'mysql',
    logging: false,
    pool: {
      max:     5,
      min:     0,
      acquire: 30000,
      idle:    10000,
    },
  }
)

export const connectDB = async () => {
  try {
    await sequelize.authenticate()
    console.log('✅ MySQL connected successfully')

    // sync({ force: false }) — creates tables if not exist, never drops
    await sequelize.sync({ force: false })
    console.log('✅ Database synced')
  } catch (err) {
    console.error('❌ MySQL connection error:', err.message)
    process.exit(1)
  }
}