import { createBrowserRouter } from 'react-router-dom'
import { ProtectedRoute }     from '@/components/shared/ProtectedRoute'
import { AdminRoute }         from '@/components/shared/AdminRoute'

import LandingPage        from '@/pages/LandingPage'
import LoginPage          from '@/pages/LoginPage'
import RegisterPage       from '@/pages/RegisterPage'
import DashboardPage      from '@/pages/DashboardPage'
import BrowsePage         from '@/pages/BrowsePage'
import CreateClassPage    from '@/pages/CreateClassPage'
import ClassDetailPage    from '@/pages/ClassDetailPage'
import CreateDeckPage     from '@/pages/CreateDeckPage'
import DeckDetailPage     from '@/pages/DeckDetailPage'
import StudyPage          from '@/pages/StudyPage'
import ProfilePage        from '@/pages/ProfilePage'
import AdminDashboardPage from '@/pages/AdminDashboardPage'
import AdminUsersPage     from '@/pages/AdminUsersPage'
import AdminClassesPage   from '@/pages/AdminClassesPage'
import AdminClassDetailPage from '@/pages/AdminClassDetailPage'

export const router = createBrowserRouter([
  { path: '/',         element: <LandingPage /> },
  { path: '/login',    element: <LoginPage /> },
  { path: '/register', element: <RegisterPage /> },

  {
    element: <ProtectedRoute />,
    children: [
      { path: '/dashboard',              element: <DashboardPage /> },
      { path: '/browse',                 element: <BrowsePage /> },
      { path: '/classes/new',            element: <CreateClassPage /> },
      { path: '/classes/:id',            element: <ClassDetailPage /> },
      { path: '/classes/:id/decks/new',  element: <CreateDeckPage /> },
      { path: '/decks/:id',              element: <DeckDetailPage /> },
      { path: '/study/:id',              element: <StudyPage /> },
      { path: '/profile',                element: <ProfilePage /> },
    ],
  },

  {
    element: <ProtectedRoute />,
    children: [{
      element: <AdminRoute />,
      children: [
        { path: '/admin',                element: <AdminDashboardPage /> },
        { path: '/admin/classes',        element: <AdminClassesPage /> },
        { path: '/admin/classes/:id',    element: <AdminClassDetailPage /> },
        { path: '/admin/users',          element: <AdminUsersPage /> },
      ],
    }],
  },
])