import { FlipCard }           from './FlipCard'
import { useFlashcardMode }   from '../hooks/useFlashcardMode'
import { Button }             from '@/components/ui/button'
import { Progress }           from '@/components/ui/progress'
import { Link }               from 'react-router-dom'
import { RotateCcw, ThumbsUp, ThumbsDown, ArrowLeft } from 'lucide-react'

export function FlashcardMode({ deck }) {
  const {
    currentCard, currentIndex, isFlipped, flip,
    next, restart, known, stillLearning, isComplete, total,
  } = useFlashcardMode(deck.cards)

  const progress = Math.round((currentIndex / total) * 100)

  if (isComplete) {
    const knownPct = Math.round((known.length / total) * 100)
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 text-center px-4">
        <div className="text-6xl">🎉</div>
        <h2 className="text-3xl font-extrabold text-foreground">Session Complete!</h2>
        <p className="text-muted-foreground">You went through all {total} cards.</p>

        <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
          <div className="bg-green-50 border border-green-200 rounded-xl p-5 text-center">
            <p className="text-3xl font-extrabold text-green-600">{known.length}</p>
            <p className="text-sm text-green-700 mt-1">Got It ✓</p>
          </div>
          <div className="bg-orange-50 border border-orange-200 rounded-xl p-5 text-center">
            <p className="text-3xl font-extrabold text-orange-500">{stillLearning.length}</p>
            <p className="text-sm text-orange-600 mt-1">Still Learning</p>
          </div>
        </div>

        <div className="text-2xl font-bold text-primary">{knownPct}% Mastery</div>

        <div className="flex gap-3">
          <Button onClick={restart} variant="outline">
            <RotateCcw className="h-4 w-4 mr-2" />Study Again
          </Button>
          <Button asChild>
            <Link to={`/decks/${deck._id}`}>Back to Deck</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center gap-8 py-8 px-4">
      {/* Header */}
      <div className="w-full max-w-2xl flex items-center justify-between">
        <Button variant="ghost" size="sm" asChild>
          <Link to={`/decks/${deck._id}`}>
            <ArrowLeft className="h-4 w-4 mr-1" />Back
          </Link>
        </Button>
        <span className="text-sm font-medium text-muted-foreground">
          {currentIndex + 1} / {total}
        </span>
        <Button variant="ghost" size="sm" onClick={restart}>
          <RotateCcw className="h-4 w-4 mr-1" />Restart
        </Button>
      </div>

      {/* Progress bar */}
      <div className="w-full max-w-2xl">
        <Progress value={progress} className="h-2" />
      </div>

      {/* Flip card */}
      <FlipCard
        front={currentCard?.front}
        back={currentCard?.back}
        isFlipped={isFlipped}
        onClick={flip}
      />

      {/* Action buttons */}
      <div className="flex gap-4 w-full max-w-sm">
        <Button
          variant="outline"
          className="flex-1 border-orange-300 text-orange-600 hover:bg-orange-50 hover:text-orange-700"
          onClick={() => next('stillLearning')}
        >
          <ThumbsDown className="h-4 w-4 mr-2" />
          Still Learning
        </Button>
        <Button
          className="flex-1 bg-green-500 hover:bg-green-600 text-white"
          onClick={() => next('known')}
        >
          <ThumbsUp className="h-4 w-4 mr-2" />
          Got It!
        </Button>
      </div>

      {/* Keyboard hint */}
      <p className="text-xs text-muted-foreground">
        <kbd className="px-1.5 py-0.5 bg-muted rounded">←</kbd> Still Learning
        {' · '}
        <kbd className="px-1.5 py-0.5 bg-muted rounded">Space</kbd> Flip
        {' · '}
        <kbd className="px-1.5 py-0.5 bg-muted rounded">→</kbd> Got It
      </p>
    </div>
  )
}