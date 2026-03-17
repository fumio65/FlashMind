import * as LucideIcons from 'lucide-react'
import { BookOpen } from 'lucide-react'
import { cn } from '@/lib/utils'

export function ClassIcon({ icon, size = 'md', className }) {
  const sizeMap = {
    sm: { container: 'h-8 w-8',   icon: 'h-4 w-4', text: 'text-lg'  },
    md: { container: 'h-12 w-12', icon: 'h-6 w-6', text: 'text-2xl' },
    lg: { container: 'h-16 w-16', icon: 'h-8 w-8', text: 'text-4xl' },
    xl: { container: 'h-20 w-20', icon: 'h-9 w-9', text: 'text-5xl' },
  }

  const s = sizeMap[size] ?? sizeMap.md

  if (!icon) {
    return (
      <div className={cn(
        'rounded-xl bg-white/20 backdrop-blur-sm  shadow-sm flex items-center justify-center shrink-0',
        s.container, className
      )}>
        <BookOpen className={cn('text-white', s.icon)} />
      </div>
    )
  }

  if (icon.type === 'emoji') {
    return (
      <div className={cn(
        'rounded-xl bg-white/20 backdrop-blur-sm  shadow-sm flex items-center justify-center shrink-0',
        s.container, className
      )}>
        <span className={s.text} style={{ lineHeight: 1 }}>{icon.value}</span>
      </div>
    )
  }

  if (icon.type === 'lucide') {
    const Icon = LucideIcons[icon.value] ?? BookOpen
    return (
      <div className={cn(
        'rounded-xl bg-white/20 backdrop-blur-sm shadow-sm flex items-center justify-center shrink-0',
        s.container, className
      )}>
        <Icon className={cn('text-white', s.icon)} />
      </div>
    )
  }

  if (icon.type === 'image') {
    return (
      <div className={cn(
        'rounded-xl bg-white/20 backdrop-blur-sm shadow-sm flex items-center justify-center overflow-hidden shrink-0',
        s.container, className
      )}>
        <img
          src={icon.value}
          alt="class icon"
          className="w-full h-full object-cover"
        />
      </div>
    )
  }

  return null
}