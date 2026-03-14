import { Link } from 'react-router-dom'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { BookOpen, Copy, Play, User } from 'lucide-react'
import { cn } from '@/lib/utils'

const CATEGORY_COLORS = {
  Math:     'bg-blue-100 text-blue-700',
  Science:  'bg-green-100 text-green-700',
  IT:       'bg-purple-100 text-purple-700',
  History:  'bg-amber-100 text-amber-700',
  Filipino: 'bg-red-100 text-red-700',
}

export function DeckCard({ deck, onCopy }) {
  return (
    <Card className="flex flex-col hover:shadow-md transition-shadow border">
      {/* Cover */}
      <div className="h-32 bg-gradient-to-br from-primary/10 to-primary/5 rounded-t-lg flex items-center justify-center">
        <BookOpen className="h-10 w-10 text-primary/40" />
      </div>

      <CardContent className="flex flex-col flex-1 p-5 gap-3">
        {/* Category badge */}
        <span className={cn('text-xs font-semibold px-2 py-0.5 rounded-full w-fit', CATEGORY_COLORS[deck.category] ?? 'bg-muted text-muted-foreground')}>
          {deck.category}
        </span>

        {/* Title + description */}
        <div className="flex-1">
          <h3 className="font-semibold text-foreground leading-snug line-clamp-2 mb-1">
            {deck.title}
          </h3>
          <p className="text-xs text-muted-foreground line-clamp-2">{deck.description}</p>
        </div>

        {/* Meta */}
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <User className="h-3 w-3" />{deck.owner?.username}
          </span>
          <span>{deck.cards?.length ?? 0} cards</span>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-1">
          <Button size="sm" className="flex-1" asChild>
            <Link to={`/decks/${deck._id}`}>
              <Play className="h-3 w-3 mr-1" />Study
            </Link>
          </Button>
          {onCopy && (
            <Button size="sm" variant="outline" onClick={() => onCopy(deck._id)}>
              <Copy className="h-3 w-3" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}