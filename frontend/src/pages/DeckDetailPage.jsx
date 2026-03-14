import { useParams, Link } from 'react-router-dom'
import { useDeck }        from '@/features/decks'
import { PageWrapper }    from '@/components/layout/PageWrapper'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { Button }         from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge }          from '@/components/ui/badge'
import { Progress }       from '@/components/ui/progress'
import {
  BookOpen, RotateCcw, ClipboardList, User,
  Calendar, Lock, Globe, ChevronRight,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const CATEGORY_COLORS = {
  Math:     'bg-blue-100 text-blue-700',
  Science:  'bg-green-100 text-green-700',
  IT:       'bg-purple-100 text-purple-700',
  History:  'bg-amber-100 text-amber-700',
  Filipino: 'bg-red-100 text-red-700',
}

export default function DeckDetailPage() {
  const { id }              = useParams()
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

  const mastery = Math.round((2 / deck.cards.length) * 100) // mock 2 known

  return (
    <PageWrapper>
      {/* Hero banner */}
      <div className="rounded-2xl bg-gradient-to-br from-primary/15 to-primary/5 border p-8 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-start gap-5">
          <div className="p-4 bg-background rounded-xl shadow-sm border">
            <BookOpen className="h-8 w-8 text-primary" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className={cn('text-xs font-semibold px-2.5 py-1 rounded-full', CATEGORY_COLORS[deck.category] ?? 'bg-muted text-muted-foreground')}>
                {deck.category}
              </span>
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                {deck.isPublic
                  ? <><Globe className="h-3 w-3" />Public</>
                  : <><Lock className="h-3 w-3" />Private</>}
              </span>
            </div>
            <h1 className="text-2xl font-extrabold text-foreground mb-1">{deck.title}</h1>
            <p className="text-muted-foreground text-sm max-w-lg">{deck.description}</p>
            <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground flex-wrap">
              <span className="flex items-center gap-1"><User className="h-3 w-3" />{deck.owner?.username}</span>
              <span className="flex items-center gap-1"><BookOpen className="h-3 w-3" />{deck.cards.length} cards</span>
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {new Date(deck.createdAt).toLocaleDateString('en-PH', { year: 'numeric', month: 'short', day: 'numeric' })}
              </span>
            </div>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5">
          {deck.tags?.map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        {/* Study mode tiles */}
        <Link
          to={`/study/${deck._id}?mode=flashcard`}
          className="group"
        >
          <Card className="h-full hover:shadow-md hover:border-primary transition-all cursor-pointer">
            <CardContent className="p-6 flex flex-col items-center text-center gap-3">
              <div className="p-4 bg-blue-50 rounded-xl group-hover:bg-blue-100 transition-colors">
                <RotateCcw className="h-8 w-8 text-blue-500" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Flashcard Mode</h3>
                <p className="text-xs text-muted-foreground mt-1">Flip cards, mark known and still learning</p>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors mt-auto" />
            </CardContent>
          </Card>
        </Link>

        <Link
          to={`/study/${deck._id}?mode=quiz`}
          className="group"
        >
          <Card className="h-full hover:shadow-md hover:border-primary transition-all cursor-pointer">
            <CardContent className="p-6 flex flex-col items-center text-center gap-3">
              <div className="p-4 bg-purple-50 rounded-xl group-hover:bg-purple-100 transition-colors">
                <ClipboardList className="h-8 w-8 text-purple-500" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Quiz Mode</h3>
                <p className="text-xs text-muted-foreground mt-1">MCQ with 30s timer and instant feedback</p>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors mt-auto" />
            </CardContent>
          </Card>
        </Link>

        {/* Mastery card */}
        <Card>
          <CardContent className="p-6 flex flex-col gap-4">
            <div>
              <h3 className="font-semibold text-foreground mb-1">Your Mastery</h3>
              <p className="text-xs text-muted-foreground">Based on your last session</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-extrabold text-primary">{mastery}%</p>
            </div>
            <Progress value={mastery} className="h-2" />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>2 known</span>
              <span>{deck.cards.length} total</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Card preview table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Cards in this deck</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y">
            {deck.cards.map((card, i) => (
              <div key={card._id} className="flex items-start gap-4 px-6 py-4 hover:bg-muted/30 transition-colors">
                <span className="text-xs font-mono text-muted-foreground w-6 shrink-0 pt-0.5">{i + 1}</span>
                <div className="grid md:grid-cols-2 gap-2 flex-1 text-sm">
                  <p className="text-foreground font-medium">{card.front}</p>
                  <p className="text-muted-foreground">{card.back}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </PageWrapper>
  )
}