import { useState } from 'react'
import { useDecks }       from '@/features/decks'
import { DeckGrid }       from '@/features/decks'
import { PageWrapper }    from '@/components/layout/PageWrapper'
import { Input }          from '@/components/ui/input'
import { Button }         from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useDebounce }    from '@/hooks/useDebounce'
import { copyDeck }       from '@/features/decks/api/decks.api'
import { CATEGORIES }     from '@/lib/constants'
import { Search }         from 'lucide-react'
import { cn }             from '@/lib/utils'


export default function BrowsePage() {
  const [query, setQuery]       = useState('')
  const [category, setCategory] = useState('All')
  const [sort, setSort]         = useState('newest')

  const debouncedQuery = useDebounce(query, 300)
  const { decks, isLoading } = useDecks({ q: debouncedQuery, category, sort })

  const handleCopy = async (id) => {
    await copyDeck(id)
    alert('Deck copied to your library!')
  }

  return (
    <PageWrapper>
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-foreground mb-1">Browse Decks</h1>
        <p className="text-muted-foreground">Discover flashcard decks made by the community.</p>
      </div>

      {/* Search + sort */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search decks..."
            className="pl-9"
          />
        </div>
        <Select value={sort} onValueChange={setSort}>
          <SelectTrigger className="w-full sm:w-44">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest First</SelectItem>
            <SelectItem value="oldest">Oldest First</SelectItem>
            <SelectItem value="az">A → Z</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Category chips */}
      <div className="flex flex-wrap gap-2 mb-8">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={cn(
              'px-4 py-1.5 rounded-full text-sm font-medium transition-colors border',
              category === cat
                ? 'bg-primary text-primary-foreground border-primary'
                : 'bg-background text-muted-foreground border-border hover:border-primary hover:text-primary'
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Results count */}
      {!isLoading && (
        <p className="text-sm text-muted-foreground mb-4">
          {decks.length} deck{decks.length !== 1 ? 's' : ''} found
        </p>
      )}

      <DeckGrid decks={decks} isLoading={isLoading} onCopy={handleCopy} />
    </PageWrapper>
  )
}