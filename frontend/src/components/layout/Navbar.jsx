import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/features/auth/store/authStore'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ThemeToggle } from '@/components/shared/ThemeToggle'
import { BookOpen, LayoutDashboard, Search, Shield } from 'lucide-react'

export function Navbar() {
  const { user, clearAuth } = useAuthStore()
  const navigate = useNavigate()

  const handleLogout = () => {
    clearAuth()
    navigate('/login')
  }

  return (
    <nav className="border-b bg-background/95 backdrop-blur sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-bold text-xl text-primary">
          <BookOpen className="h-6 w-6" />
          FlashMind
        </Link>

        {user ? (
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/dashboard">
                <LayoutDashboard className="h-4 w-4 mr-1" />Dashboard
              </Link>
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/browse">
                <Search className="h-4 w-4 mr-1" />Browse
              </Link>
            </Button>
            {user.role === 'admin' && (
              <Button variant="ghost" size="sm" asChild>
                <Link to="/admin">
                  <Shield className="h-4 w-4 mr-1" />Admin
                </Link>
              </Button>
            )}
            <ThemeToggle />
            <Link to="/profile">
              <Avatar className="h-8 w-8 cursor-pointer">
                <AvatarImage src={user.avatar} />
                <AvatarFallback>{user?.name?.[0]?.toUpperCase() ?? 'U'}</AvatarFallback>
              </Avatar>
            </Link>
            <Button variant="outline" size="sm" onClick={handleLogout}>Logout</Button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button variant="ghost" size="sm" asChild><Link to="/login">Log in</Link></Button>
            <Button size="sm" asChild><Link to="/register">Get Started</Link></Button>
          </div>
        )}
      </div>
    </nav>
  )
}