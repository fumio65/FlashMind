import api from '@/lib/axios'

export const loginUser = ({ email, password }) =>
  api.post('/auth/login', { email, password }).then((r) => r.data)

export const registerUser = ({ name, username, email, password }) =>
  api.post('/auth/register', { name, username, email, password }).then((r) => r.data)

export const getMe = () =>
  api.get('/auth/me').then((r) => r.data)

export const updateProfile = (data) =>
  api.put('/auth/profile', data).then((r) => r.data)

export const updatePassword = (data) =>
  api.put('/auth/password', data).then((r) => r.data)