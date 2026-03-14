// Mock auth API — Phase A (frontend only)
// Swap these implementations in Phase B with real Axios calls

const MOCK_USERS = [
  {
    _id: '1',
    name: 'Juan dela Cruz',
    username: 'juandc',
    email: 'juan@example.com',
    password: 'password123',
    avatar: null,
    role: 'student',
    studyStreak: 5,
    createdAt: new Date('2024-01-15'),
  },
  {
    _id: '2',
    name: 'Admin User',
    username: 'admin',
    email: 'admin@example.com',
    password: 'password123',
    avatar: null,
    role: 'admin',
    studyStreak: 12,
    createdAt: new Date('2024-01-01'),
  },
  {
    _id: '3',
    name: 'Maria Santos',
    username: 'mariasantos',
    email: 'maria@example.com',
    password: 'password123',
    avatar: null,
    role: 'creator',
    studyStreak: 8,
    createdAt: new Date('2024-02-10'),
  },
]

export const loginUser = ({ email, password }) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const user = MOCK_USERS.find(
        (u) => u.email === email && u.password === password
      )
      if (user) {
        const { password: _, ...safeUser } = user
        resolve({ token: `mock-jwt-token-${safeUser._id}`, user: safeUser })
      } else {
        reject(new Error('Invalid email or password'))
      }
    }, 600)
  })
}

export const registerUser = ({ name, username, email }) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newUser = {
        _id: String(Date.now()),
        name,
        username,
        email,
        avatar: null,
        role: 'student',
        studyStreak: 0,
        createdAt: new Date(),
      }
      resolve({ token: `mock-jwt-token-${newUser._id}`, user: newUser })
    }, 600)
  })
}