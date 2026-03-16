import { Link } from 'react-router-dom'
import { ClassIcon } from './ClassIcon'
import { cn } from '@/lib/utils'
import { BookOpen, Copy, Globe, Lock, User } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function ClassCard({ cls, onCopy }) {
  return (
    <div className="group rounded-2xl overflow-hidden border border-border hover:border-primary/50 hover:shadow-lg transition-all">
      {/* Gradient header */}
      <div className={cn('h-24 bg-gradient-to-br flex items-center px-5 gap-4', cls.color)}>
        <ClassIcon icon={cls.icon} size="md" />
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-white text-base leading-snug line-clamp-1">
            {cls.name}
          </h3>
          <p className="text-white/70 text-xs mt-0.5 flex items-center gap-1">
            {cls.isPublic
              ? <><Globe className="h-3 w-3" />Public</>
              : <><Lock className="h-3 w-3" />Private</>
            }
            <span className="mx-1">·</span>
            <BookOpen className="h-3 w-3" />
            {cls.deckCount} deck{cls.deckCount !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      {/* Body */}
      <div className="bg-card p-4 flex flex-col gap-3">
        <p className="text-xs text-muted-foreground line-clamp-2 min-h-[2.5rem]">
          {cls.description || 'No description.'}
        </p>

        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <User className="h-3 w-3" />@{cls.owner?.username}
          </span>
          <span>{new Date(cls.createdAt).toLocaleDateString('en-PH', { month: 'short', year: 'numeric' })}</span>
        </div>

        <div className="flex gap-2">
          <Button size="sm" className="flex-1" asChild>
            <Link to={`/classes/${cls._id}`}>Open Class</Link>
          </Button>
          {onCopy && (
            <Button size="sm" variant="outline" onClick={() => onCopy(cls._id)}>
              <Copy className="h-3.5 w-3.5" />
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}