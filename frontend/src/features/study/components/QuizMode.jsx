import { useState, useEffect, useRef } from 'react'
import { useQuizMode }  from '../hooks/useQuizMode'
import { Button }       from '@/components/ui/button'
import { Progress }     from '@/components/ui/progress'
import { Link, useNavigate } from 'react-router-dom'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { cn }           from '@/lib/utils'
import { RotateCcw, ArrowLeft, ArrowRight, Clock } from 'lucide-react'

export function QuizMode({ deck }) {
  const [showRestartDialog, setShowRestartDialog] = useState(false)
  const [showExitDialog, setShowExitDialog]       = useState(false)
  const navigate                                  = useNavigate()
  const handleConfirmRestartRef                   = useRef(null)

  const {
    currentQuestion, currentIndex, selectedOption,
    timeLeft, score, isComplete, showFeedback,
    answer, goNext, restart, total,
  } = useQuizMode(deck.cards)

  const progress = Math.round((currentIndex / total) * 100)

  const handleConfirmRestart = () => {
    setShowRestartDialog(false)
    restart()
  }

  // Always keep ref fresh
  useEffect(() => {
    handleConfirmRestartRef.current = handleConfirmRestart
  })

  // Keyboard shortcuts — study screen
  useEffect(() => {
    if (isComplete || showRestartDialog || showExitDialog) return
    const handler = (e) => {
      if (!showFeedback && currentQuestion) {
        const keyMap = { '1': 0, 'a': 0, 'A': 0, '2': 1, 'b': 1, 'B': 1, '3': 2, 'c': 2, 'C': 2, '4': 3, 'd': 3, 'D': 3 }
        if (keyMap[e.key] !== undefined) {
          const option = currentQuestion.options[keyMap[e.key]]
          if (option) answer(option)
        }
      }
      if (showFeedback && (e.code === 'Space' || e.key === 'Enter')) {
        e.preventDefault()
        goNext()
      }
      if (e.key === 'r' || e.key === 'R') setShowRestartDialog(true)
      if (e.key === 'Escape')             setShowExitDialog(true)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [isComplete, showFeedback, currentQuestion, showRestartDialog, showExitDialog])

  // Exit dialog: Esc closes it, Q confirms exit
  useEffect(() => {
    if (!showExitDialog) return
    const handler = (e) => {
      if (e.key === 'Escape') {
        e.stopPropagation()
        setShowExitDialog(false)
      }
      if (e.key === 'q' || e.key === 'Q') {
        e.stopPropagation()
        navigate(`/decks/${deck._id}`)
      }
    }
    window.addEventListener('keydown', handler, true)
    return () => window.removeEventListener('keydown', handler, true)
  }, [showExitDialog])

  // Restart dialog: Esc closes it, R confirms restart
  useEffect(() => {
    if (!showRestartDialog) return
    const handler = (e) => {
      if (e.key === 'Escape') {
        e.stopPropagation()
        setShowRestartDialog(false)
      }
      if (e.key === 'r' || e.key === 'R') {
        e.stopPropagation()
        handleConfirmRestartRef.current?.()
      }
    }
    window.addEventListener('keydown', handler, true)
    return () => window.removeEventListener('keydown', handler, true)
  }, [showRestartDialog])

  // Keyboard shortcuts — completion screen
  useEffect(() => {
    if (!isComplete) return
    const handler = (e) => {
      if (e.key === 'r' || e.key === 'R') restart()
      if (e.key === 'Escape')             navigate(`/decks/${deck._id}`)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [isComplete])

  // ── Completion screen ──
  if (isComplete) {
    const pct   = Math.round((score / total) * 100)
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
            <kbd className="ml-2 text-[10px] bg-muted px-1.5 py-0.5 rounded opacity-70">R</kbd>
          </Button>
          <Button asChild>
            <Link to={`/decks/${deck._id}`}>
              Back to Deck
              <kbd className="ml-2 text-[10px] bg-white/20 px-1.5 py-0.5 rounded opacity-70">Esc</kbd>
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  if (!currentQuestion) return null

  // ── Study screen ──
  return (
    <div className="flex flex-col items-center gap-6 py-8 px-4 max-w-2xl mx-auto">

      {/* Header */}
      <div className="w-full flex items-center justify-between">
        <Button variant="ghost" size="sm" onClick={() => setShowExitDialog(true)}>
          <ArrowLeft className="h-4 w-4 mr-1" />Back
          <kbd className="ml-1.5 text-[10px] bg-muted px-1.5 py-0.5 rounded opacity-60">Esc</kbd>
        </Button>
        <span className="text-sm font-medium text-muted-foreground">
          {currentIndex + 1} / {total}
        </span>
        <div className="flex items-center gap-2">
          <div className={cn(
            'flex items-center gap-1.5 text-sm font-bold px-3 py-1 rounded-full',
            timeLeft > 10 ? 'bg-muted text-foreground' : 'bg-red-100 text-red-600'
          )}>
            <Clock className="h-3.5 w-3.5" />{timeLeft}s
          </div>
          <Button variant="ghost" size="sm" onClick={() => setShowRestartDialog(true)}>
            <RotateCcw className="h-4 w-4 mr-1" />Restart
            <kbd className="ml-1.5 text-[10px] bg-muted px-1.5 py-0.5 rounded opacity-60">R</kbd>
          </Button>
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

      {/* Options */}
      <div className="w-full grid grid-cols-2 gap-3">
        {currentQuestion.options.map((option, i) => {
          let style = 'border-border bg-background hover:border-primary hover:bg-primary/5'
          if (showFeedback) {
            if (option.isCorrect)                                    style = 'border-green-500 bg-green-50 text-green-700'
            else if (option === selectedOption && !option.isCorrect) style = 'border-red-400 bg-red-50 text-red-600'
            else                                                     style = 'border-border bg-muted/40 opacity-60'
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
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-muted-foreground">{['A','B','C','D'][i]}.</span>
                <kbd className={cn('text-[10px] px-1.5 py-0.5 rounded font-mono', showFeedback ? 'opacity-30 bg-muted' : 'bg-muted opacity-60')}>
                  {['1','2','3','4'][i]}
                </kbd>
              </div>
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
            <kbd className="ml-2 text-[10px] bg-white/20 px-1.5 py-0.5 rounded opacity-70">Space</kbd>
          </Button>
        </div>
      )}

      {/* Keyboard hint */}
      <p className="text-xs text-muted-foreground">
        <kbd className="px-1.5 py-0.5 bg-muted rounded">1–4</kbd> Select answer
        {' · '}
        <kbd className="px-1.5 py-0.5 bg-muted rounded">Space</kbd> Next
        {' · '}
        <kbd className="px-1.5 py-0.5 bg-muted rounded">R</kbd> Restart
        {' · '}
        <kbd className="px-1.5 py-0.5 bg-muted rounded">Esc</kbd> Exit
      </p>

      {/* Exit warning dialog */}
      <Dialog open={showExitDialog} onOpenChange={setShowExitDialog}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ArrowLeft className="h-5 w-5 text-destructive" />
              Leave Quiz?
            </DialogTitle>
          </DialogHeader>
          <div className="py-2">
            <p className="text-sm text-muted-foreground mb-4">
              Your quiz progress will be lost if you leave now.
            </p>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-primary/10 border border-primary/20 rounded-lg p-3 text-center">
                <p className="text-lg font-extrabold text-primary">{currentIndex}</p>
                <p className="text-xs text-muted-foreground">Questions done</p>
              </div>
              <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3 text-center">
                <p className="text-lg font-extrabold text-green-400">{score}</p>
                <p className="text-xs text-muted-foreground">Correct so far</p>
              </div>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setShowExitDialog(false)}>
              Keep Going
              <kbd className="ml-2 text-[10px] bg-muted px-1.5 py-0.5 rounded opacity-70">Esc</kbd>
            </Button>
            <Button variant="destructive" onClick={() => navigate(`/decks/${deck._id}`)}>
              Leave Quiz
              <kbd className="ml-2 text-[10px] bg-white/20 px-1.5 py-0.5 rounded opacity-70">Q</kbd>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Restart confirmation dialog */}
      <Dialog
        open={showRestartDialog}
        onOpenChange={(open) => { if (!open) setShowRestartDialog(false) }}
      >
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <RotateCcw className="h-5 w-5 text-primary" />
              Restart Quiz?
            </DialogTitle>
          </DialogHeader>
          <div className="py-2">
            <p className="text-sm text-muted-foreground mb-4">
              Your current progress will be lost and the quiz will restart from question 1.
            </p>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-primary/10 border border-primary/20 rounded-lg p-3 text-center">
                <p className="text-lg font-extrabold text-primary">{currentIndex}</p>
                <p className="text-xs text-muted-foreground">Questions done</p>
              </div>
              <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3 text-center">
                <p className="text-lg font-extrabold text-green-400">{score}</p>
                <p className="text-xs text-muted-foreground">Correct so far</p>
              </div>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setShowRestartDialog(false)}>
              Keep Going
              <kbd className="ml-2 text-[10px] bg-muted px-1.5 py-0.5 rounded opacity-70">Esc</kbd>
            </Button>
            <Button onClick={handleConfirmRestart}>
              <RotateCcw className="h-4 w-4 mr-2" />
              Yes, Restart
              <kbd className="ml-2 text-[10px] bg-white/20 px-1.5 py-0.5 rounded opacity-70">R</kbd>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}