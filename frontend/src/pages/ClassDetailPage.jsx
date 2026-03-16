import { useParams, Link } from 'react-router-dom'
import { useClass }        from '@/features/classes'
import { ClassIcon }       from '@/features/classes/components/ClassIcon'
import { PageWrapper }     from '@/components/layout/PageWrapper'
import { LoadingSpinner }  from '@/components/shared/LoadingSpinner'
import { Button }          from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge }           from '@/components/ui/badge'
import {
  Plus, BookOpen, Play, RotateCcw,
  ClipboardList, Globe, Lock, ArrowLeft,
} from 'lucide-react'
import { cn } from '@/lib/utils'

export default function ClassDetailPage() {
  const { id }                    = useParams()
  const { cls, decks, isLoading, error } = useClass(id)

  if (isLoading) return <PageWrapper><LoadingSpinner /></PageWrapper>

  if (error || !cls) {
    return (
      <PageWrapper>
        <div className="text-center py-20 text-muted-foreground">
          <BookOpen className="h-10 w-10 mx-auto mb-3 opacity-30" />
          <p>Class not found.</p>
          <Button variant="link" asChild className="mt-2">
            <Link to="/dashboard">Back to Dashboard</Link>
          </Button>
        </div>
      </PageWrapper>
    )
  }

  return (
    <PageWrapper>
      {/* Back */}
      <Button variant="ghost" size="sm" asChild className="mb-4 -ml-2">
        <Link to="/dashboard"><ArrowLeft className="h-4 w-4 mr-1" />Dashboard</Link>
      </Button>

      {/* Hero */}
      <div className={cn('rounded-2xl h-40 mb-6 flex items-center px-8 gap-6 bg-gradient-to-br', cls.color)}>
        <ClassIcon icon={cls.icon} size="xl" />
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-extrabold text-white">{cls.name}</h1>
            <span className="flex items-center gap-1 text-white/70 text-xs bg-white/10 px-2 py-0.5 rounded-full">
              {cls.isPublic ? <><Globe className="h-3 w-3" />Public</> : <><Lock className="h-3 w-3" />Private</>}
            </span>
          </div>
          <p className="text-white/75 text-sm max-w-lg">{cls.description}</p>
          <p className="text-white/60 text-xs mt-2">
            {decks.length} deck{decks.length !== 1 ? 's' : ''} · @{cls.owner?.username}
          </p>
        </div>
        <Button asChild className="bg-white/20 hover:bg-white/30 text-white border-white/20 shrink-0" variant="outline">
          <Link to={`/classes/${id}/decks/new`}>
            <Plus className="h-4 w-4 mr-2" />New Deck
          </Link>
        </Button>
      </div>

      {/* Decks grid */}
      {decks.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground border border-dashed border-border rounded-2xl">
          <BookOpen className="h-10 w-10 mx-auto mb-3 opacity-30" />
          <p className="mb-3 text-sm">No decks in this class yet.</p>
          <Button asChild size="sm">
            <Link to={`/classes/${id}/decks/new`}>
              <Plus className="h-3.5 w-3.5 mr-1" />Create First Deck
            </Link>
          </Button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {decks.map((deck) => (
            <Card key={deck._id} className="border-border hover:border-primary/50 hover:shadow-md transition-all group">
              <CardContent className="p-5 flex flex-col gap-4">
                {/* Header */}
                <div className="flex items-start justify-between gap-2">
                  <div className="p-2.5 bg-primary/10 rounded-xl">
                    <BookOpen className="h-5 w-5 text-primary" />
                  </div>
                  <Badge variant="secondary" className="text-xs shrink-0">
                    {deck.cards.length} cards
                  </Badge>
                </div>

                {/* Title + description */}
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground leading-snug line-clamp-2 mb-1">
                    {deck.title}
                  </h3>
                  <p className="text-xs text-muted-foreground line-clamp-2">{deck.description}</p>
                </div>

                {/* Study mode buttons */}
                <div className="grid grid-cols-2 gap-2">
                  <Button size="sm" variant="outline" asChild className="text-xs">
                    <Link to={`/study/${deck._id}?mode=flashcard`}>
                      <RotateCcw className="h-3 w-3 mr-1" />Flashcard
                    </Link>
                  </Button>
                  <Button size="sm" variant="outline" asChild className="text-xs">
                    <Link to={`/study/${deck._id}?mode=quiz`}>
                      <ClipboardList className="h-3 w-3 mr-1" />Quiz
                    </Link>
                  </Button>
                </div>

                {/* View deck */}
                <Button size="sm" asChild className="w-full">
                  <Link to={`/decks/${deck._id}`}>
                    <Play className="h-3.5 w-3.5 mr-1.5" />View Deck
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </PageWrapper>
  )
}