import { Navbar } from './Navbar'
import { cn } from '@/lib/utils'

export function PageWrapper({ children, showNav = true, className }) {
  return (
    <div className="min-h-screen bg-background">
      {showNav && <Navbar />}
      <main className={cn('max-w-7xl mx-auto px-4 py-8', className)}>
        {children}
      </main>
    </div>
  )
}