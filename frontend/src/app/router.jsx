import { createBrowserRouter } from 'react-router-dom'
import { ProtectedRoute } from '@/components/shared/ProtectedRoute'
import { AdminRoute }     from '@/components/shared/AdminRoute'

import LandingPage        from '@/pages/LandingPage'
import LoginPage          from '@/pages/LoginPage'
import RegisterPage       from '@/pages/RegisterPage'
import DashboardPage      from '@/pages/DashboardPage'
import BrowsePage         from '@/pages/BrowsePage'
import CreateDeckPage     from '@/pages/CreateDeckPage'
import DeckDetailPage     from '@/pages/DeckDetailPage'
import StudyPage          from '@/pages/StudyPage'
import ProfilePage        from '@/pages/ProfilePage'
import AdminDashboardPage from '@/pages/AdminDashboardPage'
import AdminDecksPage     from '@/pages/AdminDecksPage'
import AdminUsersPage     from '@/pages/AdminUsersPage'

export const router = createBrowserRouter([
  { path: '/',         element: <LandingPage /> },
  { path: '/login',    element: <LoginPage /> },
  { path: '/register', element: <RegisterPage /> },

  {
    element: <ProtectedRoute />,
    children: [
      { path: '/dashboard',  element: <DashboardPage /> },
      { path: '/browse',     element: <BrowsePage /> },
      { path: '/decks/new',  element: <CreateDeckPage /> },
      { path: '/decks/:id',  element: <DeckDetailPage /> },
      { path: '/study/:id',  element: <StudyPage /> },
      { path: '/profile',    element: <ProfilePage /> },
    ],
  },

  {
    element: <ProtectedRoute />,
    children: [{
      element: <AdminRoute />,
      children: [
        { path: '/admin',        element: <AdminDashboardPage /> },
        { path: '/admin/decks',  element: <AdminDecksPage /> },
        { path: '/admin/users',  element: <AdminUsersPage /> },
      ],
    }],
  },
])