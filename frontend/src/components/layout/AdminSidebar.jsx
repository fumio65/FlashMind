import { Link, useLocation, useNavigate } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { LayoutDashboard, Library, Users, BookOpen, LogOut, Home } from 'lucide-react'
import { useAuthStore } from '@/features/auth/store/authStore'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

const links = [
  { to: '/admin',         label: 'Overview', icon: LayoutDashboard },
  { to: '/admin/classes', label: 'Classes',  icon: Library },
  { to: '/admin/users',   label: 'Users',    icon: Users },
]

export function AdminSidebar() {
  const { pathname }                      = useLocation()
  const { user, clearAuth }              = useAuthStore()
  const navigate                          = useNavigate()
  const [showLogoutDialog, setShowLogoutDialog] = useState(false)

  const handleLogout = () => {
    clearAuth()
    navigate('/login')
  }

  return (
    <>
      <aside className="w-56 min-h-screen bg-slate-900 text-slate-100 flex flex-col">

        {/* Logo */}
        <div className="h-16 flex items-center px-6 gap-2 border-b border-slate-700">
          <BookOpen className="h-5 w-5 text-primary" />
          <span className="font-bold text-lg">FlashMind</span>
          <span className="ml-auto text-[10px] bg-primary/20 text-primary px-1.5 py-0.5 rounded font-semibold">
            Admin
          </span>
        </div>

        {/* Nav links */}
        <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
          {links.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              className={cn(
                'flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors',
                pathname === to || (to !== '/admin' && pathname.startsWith(to))
                  ? 'bg-slate-700 text-white'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              )}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          ))}

          {/* Divider */}
          <div className="border-t border-slate-700 my-2" />

          {/* Back to app */}
          <Link
            to="/dashboard"
            className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <Home className="h-4 w-4" />
            Back to App
          </Link>
        </nav>

        {/* User info + logout */}
        <div className="border-t border-slate-700 p-3">
          <div className="flex items-center gap-3 px-2 py-2 mb-1">
            <Avatar className="h-8 w-8 shrink-0">
              <AvatarImage src={user?.avatar} />
              <AvatarFallback className="text-xs font-bold bg-primary/20 text-primary">
                {user?.name?.[0]?.toUpperCase() ?? 'A'}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">{user?.name}</p>
              <p className="text-xs text-slate-400 truncate">{user?.email}</p>
            </div>
          </div>

          <button
            onClick={() => setShowLogoutDialog(true)}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </aside>

      {/* Logout confirmation dialog */}
      <Dialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <LogOut className="h-5 w-5 text-destructive" />
              Log Out?
            </DialogTitle>
          </DialogHeader>
          <div className="py-2">
            <p className="text-sm text-muted-foreground">
              Are you sure you want to log out of the admin panel?
            </p>
            <div className="flex items-center gap-3 mt-4 p-3 bg-muted/40 rounded-lg border border-border">
              <Avatar className="h-9 w-9">
                <AvatarImage src={user?.avatar} />
                <AvatarFallback className="text-sm font-bold">
                  {user?.name?.[0]?.toUpperCase() ?? 'A'}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-semibold text-foreground">{user?.name}</p>
                <p className="text-xs text-muted-foreground">{user?.email}</p>
              </div>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setShowLogoutDialog(false)}>
              Stay Logged In
            </Button>
            <Button variant="destructive" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Yes, Log Out
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}