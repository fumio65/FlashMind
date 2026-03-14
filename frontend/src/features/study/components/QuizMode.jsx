import { useQuizMode }  from '../hooks/useQuizMode'
import { Button }       from '@/components/ui/button'
import { Progress }     from '@/components/ui/progress'
import { Link }         from 'react-router-dom'
import { cn }           from '@/lib/utils'
import { RotateCcw, ArrowLeft, ArrowRight, Clock } from 'lucide-react'

export function QuizMode({ deck }) {
  const {
    currentQuestion, currentIndex, selectedOption,
    timeLeft, score, isComplete, showFeedback,
    answer, goNext, restart, total,
  } = useQuizMode(deck.cards)

  const progress = Math.round((currentIndex / total) * 100)

  if (isComplete) {
    const pct = Math.round((score / total) * 100)
    const emoji = pct >= 80 ? '🏆' : pct >= 60 ? '👍' : '📚'
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 text-center px-4">
        <div className="text-6xl">{emoji}</div>
        <h2 className="text-3xl font-extrabold text-foreground">Quiz Complete!</h2>

        <div className="bg-muted rounded-2xl p-8 w-full max-w-sm">
          <p className="text-6xl font-extrabold text-primary mb-2">{pct}%</p>
          <p className="text-muted-foreground">{score} out of {total} correct</p>
        </div>

        <div className="flex gap-3">
          <Button onClick={restart} variant="outline">
            <RotateCcw className="h-4 w-4 mr-2" />Try Again
          </Button>
          <Button asChild>
            <Link to={`/decks/${deck._id}`}>Back to Deck</Link>
          </Button>
        </div>
      </div>
    )
  }

  if (!currentQuestion) return null

  return (
    <div className="flex flex-col items-center gap-6 py-8 px-4 max-w-2xl mx-auto">
      {/* Header */}
      <div className="w-full flex items-center justify-between">
        <Button variant="ghost" size="sm" asChild>
          <Link to={`/decks/${deck._id}`}>
            <ArrowLeft className="h-4 w-4 mr-1" />Back
          </Link>
        </Button>
        <span className="text-sm font-medium text-muted-foreground">
          {currentIndex + 1} / {total}
        </span>
        <div className={cn(
          'flex items-center gap-1.5 text-sm font-bold px-3 py-1 rounded-full',
          timeLeft > 10 ? 'bg-muted text-foreground' : 'bg-red-100 text-red-600'
        )}>
          <Clock className="h-3.5 w-3.5" />
          {timeLeft}s
        </div>
      </div>

      {/* Progress */}
      <div className="w-full">
        <Progress value={progress} className="h-2" />
      </div>

      {/* Timer bar */}
      <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
        <div
          className={cn(
            'h-full rounded-full transition-all duration-1000',
            timeLeft > 10 ? 'bg-primary' : 'bg-red-500'
          )}
          style={{ width: `${(timeLeft / 30) * 100}%` }}
        />
      </div>

      {/* Question */}
      <div className="w-full bg-muted/40 rounded-2xl p-8 text-center border">
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">Question</p>
        <p className="text-xl font-bold text-foreground">{currentQuestion.question}</p>
      </div>

      {/* Options 2×2 grid */}
      <div className="w-full grid grid-cols-2 gap-3">
        {currentQuestion.options.map((option, i) => {
          let style = 'border-border bg-background hover:border-primary hover:bg-primary/5'
          if (showFeedback) {
            if (option.isCorrect)                             style = 'border-green-500 bg-green-50 text-green-700'
            else if (option === selectedOption && !option.isCorrect) style = 'border-red-400 bg-red-50 text-red-600'
            else                                              style = 'border-border bg-muted/40 opacity-60'
          }

          return (
            <button
              key={i}
              disabled={showFeedback}
              onClick={() => answer(option)}
              className={cn(
                'rounded-xl border-2 p-4 text-sm font-medium text-left transition-all',
                style,
                !showFeedback && 'cursor-pointer'
              )}
            >
              <span className="text-xs font-bold text-muted-foreground mr-2">
                {String.fromCharCode(65 + i)}.
              </span>
              {option.text}
            </button>
          )
        })}
      </div>

      {/* Feedback + Next */}
      {showFeedback && (
        <div className="w-full flex flex-col gap-3">
          <div className={cn(
            'rounded-xl p-4 text-sm font-medium text-center',
            selectedOption?.isCorrect || !selectedOption
              ? 'bg-green-50 text-green-700 border border-green-200'
              : 'bg-red-50 text-red-700 border border-red-200'
          )}>
            {!selectedOption
              ? "⏱ Time's up! The correct answer is highlighted above."
              : selectedOption.isCorrect
              ? '✅ Correct! Well done.'
              : '❌ Not quite. Review the correct answer above.'}
          </div>
          <Button onClick={goNext} className="w-full">
            {currentIndex + 1 >= total ? 'See Results' : 'Next Question'}
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      )}
    </div>
  )
}