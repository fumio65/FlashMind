import { useParams, useSearchParams, Link } from 'react-router-dom'
import { useDeck }          from '@/features/decks'
import { FlashcardMode }    from '@/features/study'
import { QuizMode }         from '@/features/study'
import { PageWrapper }      from '@/components/layout/PageWrapper'
import { LoadingSpinner }   from '@/components/shared/LoadingSpinner'
import { Button }           from '@/components/ui/button'
import { BookOpen }         from 'lucide-react'

export default function StudyPage() {
  const { id }                    = useParams()
  const [searchParams]            = useSearchParams()
  const mode                      = searchParams.get('mode') ?? 'flashcard'
  const { deck, isLoading, error } = useDeck(id)

  if (isLoading) return <PageWrapper><LoadingSpinner /></PageWrapper>

  if (error || !deck) {
    return (
      <PageWrapper>
        <div className="text-center py-20 text-muted-foreground">
          <BookOpen className="h-10 w-10 mx-auto mb-3 opacity-30" />
          <p>Deck not found.</p>
          <Button variant="link" asChild className="mt-2">
            <Link to="/browse">Back to Browse</Link>
          </Button>
        </div>
      </PageWrapper>
    )
  }

  if (deck.cards.length < 2) {
    return (
      <PageWrapper>
        <div className="text-center py-20 text-muted-foreground">
          <BookOpen className="h-10 w-10 mx-auto mb-3 opacity-30" />
          <p>This deck needs at least 2 cards to study.</p>
          <Button variant="link" asChild className="mt-2">
            <Link to={`/decks/${id}`}>Back to Deck</Link>
          </Button>
        </div>
      </PageWrapper>
    )
  }

  return (
    <PageWrapper>
      <div className="mb-4">
        <h1 className="text-xl font-bold text-foreground">{deck.title}</h1>
        <p className="text-sm text-muted-foreground capitalize">{mode} mode</p>
      </div>

      {mode === 'flashcard'
        ? <FlashcardMode deck={deck} />
        : <QuizMode deck={deck} />
      }
    </PageWrapper>
  )
}