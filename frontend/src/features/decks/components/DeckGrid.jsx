import { DeckCard } from './DeckCard'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { BookOpen } from 'lucide-react'

export function DeckGrid({ decks, isLoading, onCopy }) {
  if (isLoading) return <LoadingSpinner />

  if (!decks.length) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-muted-foreground gap-3">
        <BookOpen className="h-10 w-10 opacity-30" />
        <p className="text-sm">No decks found</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {decks.map((deck) => (
        <DeckCard key={deck._id} deck={deck} onCopy={onCopy} />
      ))}
    </div>
  )
}