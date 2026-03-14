import { Link, useLocation } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { LayoutDashboard, Library, Users, BookOpen } from 'lucide-react'

const links = [
  { to: '/admin',       label: 'Overview', icon: LayoutDashboard },
  { to: '/admin/decks', label: 'Decks',    icon: Library },
  { to: '/admin/users', label: 'Users',    icon: Users },
]

export function AdminSidebar() {
  const { pathname } = useLocation()

  return (
    <aside className="w-56 min-h-screen bg-slate-900 text-slate-100 flex flex-col">
      <div className="h-16 flex items-center px-6 gap-2 border-b border-slate-700">
        <BookOpen className="h-5 w-5 text-primary" />
        <span className="font-bold text-lg">FlashMind</span>
      </div>
      <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
        {links.map(({ to, label, icon: Icon }) => (
          <Link
            key={to}
            to={to}
            className={cn(
              'flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors',
              pathname === to
                ? 'bg-slate-700 text-white'
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            )}
          >
            <Icon className="h-4 w-4" />
            {label}
          </Link>
        ))}
      </nav>
    </aside>
  )
}