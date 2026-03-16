import { FlipCard }         from './FlipCard'
import { useFlashcardMode, CONFIDENCE_LEVELS } from '../hooks/useFlashcardMode'
import { Button }           from '@/components/ui/button'
import { Progress }         from '@/components/ui/progress'
import { Link }             from 'react-router-dom'
import { RotateCcw, ArrowLeft } from 'lucide-react'
import { cn }               from '@/lib/utils'

export function FlashcardMode({ deck }) {
  const {
    currentCard, currentIndex, isFlipped, flip,
    rate, restart, known, stillLearning, hard,
    avgScore, isComplete, total,
  } = useFlashcardMode(deck.cards)

  const progress = Math.round((currentIndex / total) * 100)

  if (isComplete) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 text-center px-4">
        <div className="text-6xl">🎉</div>
        <h2 className="text-3xl font-extrabold text-foreground">Session Complete!</h2>
        <p className="text-muted-foreground">You rated all {total} cards.</p>

        {/* Score */}
        <div className="bg-primary/10 border border-primary/20 rounded-2xl px-10 py-6">
          <p className="text-6xl font-extrabold text-primary mb-1">{avgScore}%</p>
          <p className="text-sm text-muted-foreground">average confidence</p>
        </div>

        {/* Breakdown */}
        <div className="grid grid-cols-5 gap-3 w-full max-w-lg">
          {CONFIDENCE_LEVELS.map((level) => {
            const count = deck.cards.filter((_, i) =>
              i < total && useFlashcardMode ? true : true
            ).length
            const ratingCount = known.concat(stillLearning).concat(hard)
              .filter(() => true).length
            // just show per-level counts from ratings prop
            return null
          })}
        </div>

        {/* Simple breakdown */}
        <div className="grid grid-cols-3 gap-3 w-full max-w-sm">
          <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4 text-center">
            <p className="text-2xl font-extrabold text-green-400">{known.length}</p>
            <p className="text-xs text-green-400/80 mt-1">Known<br/>(Good + Easy)</p>
          </div>
          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4 text-center">
            <p className="text-2xl font-extrabold text-yellow-400">{hard.length}</p>
            <p className="text-xs text-yellow-400/80 mt-1">Hard<br/>(Review)</p>
          </div>
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-center">
            <p className="text-2xl font-extrabold text-red-400">{stillLearning.length}</p>
            <p className="text-xs text-red-400/80 mt-1">Forgot<br/>(Again + Blackout)</p>
          </div>
        </div>

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
    <div className="flex flex-col items-center gap-6 py-8 px-4">
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

      {/* Progress */}
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

      {/* Rating prompt */}
      <div className="w-full max-w-2xl">
        <p className="text-center text-xs text-muted-foreground mb-3">
          {isFlipped
            ? 'How well did you know this?'
            : 'Flip the card first, then rate your confidence'}
        </p>

        {/* 5 confidence buttons */}
        <div className="grid grid-cols-5 gap-2">
          {CONFIDENCE_LEVELS.map((level) => (
            <button
              key={level.value}
              onClick={() => isFlipped && rate(level.value)}
              disabled={!isFlipped}
              className={cn(
                'flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl text-xs font-semibold transition-all border-2 border-transparent',
                isFlipped
                  ? cn(level.color, 'hover:scale-105 hover:shadow-md cursor-pointer')
                  : 'bg-muted text-muted-foreground opacity-40 cursor-not-allowed'
              )}
            >
              <span className="text-xl">{level.emoji}</span>
              <span>{level.label}</span>
              <kbd className="text-[10px] opacity-70 bg-black/20 px-1.5 py-0.5 rounded">
                {level.value}
              </kbd>
            </button>
          ))}
        </div>
      </div>

      {/* Keyboard hint */}
      <p className="text-xs text-muted-foreground">
        <kbd className="px-1.5 py-0.5 bg-muted rounded">Space</kbd> Flip
        {' · '}
        <kbd className="px-1.5 py-0.5 bg-muted rounded">1–5</kbd> Rate confidence
      </p>
    </div>
  )
}