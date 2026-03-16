import * as LucideIcons from 'lucide-react'
import { BookOpen } from 'lucide-react'
import { cn } from '@/lib/utils'

export function ClassIcon({ icon, size = 'md', className }) {
  const sizes = {
    sm:  'h-8 w-8 text-xl',
    md:  'h-12 w-12 text-2xl',
    lg:  'h-16 w-16 text-4xl',
    xl:  'h-20 w-20 text-5xl',
  }

  const containerSizes = {
    sm:  'h-8 w-8',
    md:  'h-12 w-12',
    lg:  'h-16 w-16',
    xl:  'h-20 w-20',
  }

  if (!icon) {
    return (
      <div className={cn('rounded-xl bg-primary/10 flex items-center justify-center', containerSizes[size], className)}>
        <BookOpen className={cn('text-primary', size === 'sm' ? 'h-4 w-4' : size === 'md' ? 'h-6 w-6' : 'h-8 w-8')} />
      </div>
    )
  }

  if (icon.type === 'emoji') {
    return (
      <div className={cn('rounded-xl bg-white/10 flex items-center justify-center', containerSizes[size], className)}>
        <span className={sizes[size]}>{icon.value}</span>
      </div>
    )
  }

  if (icon.type === 'lucide') {
    const Icon = LucideIcons[icon.value] ?? BookOpen
    return (
      <div className={cn('rounded-xl bg-white/10 flex items-center justify-center', containerSizes[size], className)}>
        <Icon className={cn('text-white', size === 'sm' ? 'h-4 w-4' : size === 'md' ? 'h-6 w-6' : 'h-8 w-8')} />
      </div>
    )
  }

  if (icon.type === 'image') {
    return (
      <img
        src={icon.value}
        alt="class icon"
        className={cn('rounded-xl object-cover', containerSizes[size], className)}
      />
    )
  }

  return null
}