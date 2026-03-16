import { cn } from '@/lib/utils'
import { BADGE_COLORS } from '../hooks/useFlashcardMode'

export function FlipCard({ front, back, isFlipped, onClick, prevLevel }) {
  return (
    <div
      className="w-full max-w-2xl mx-auto cursor-pointer"
      style={{ perspective: '1200px', height: '320px' }}
      onClick={onClick}
    >
      <div
        className="relative w-full h-full transition-transform duration-500"
        style={{
          transformStyle: 'preserve-3d',
          transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
        }}
      >
        {/* Front */}
        <div
          className="absolute inset-0 rounded-2xl border-2 bg-background shadow-lg flex flex-col items-center justify-center p-10 text-center"
          style={{ backfaceVisibility: 'hidden' }}
        >
          {/* Previous rating badge */}
          {prevLevel && (
            <div className={cn(
              'absolute top-4 right-4 flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border',
              BADGE_COLORS[prevLevel.value]
            )}>
              <span>{prevLevel.emoji}</span>
              <span>Last: {prevLevel.label}</span>
            </div>
          )}

          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-6">
            Term
          </p>
          <p className="text-2xl font-bold text-foreground leading-relaxed">{front}</p>
          <p className="text-xs text-muted-foreground mt-8">
            Click or press <kbd className="px-1.5 py-0.5 bg-muted rounded text-xs">Space</kbd> to flip
          </p>
        </div>

        {/* Back */}
        <div
          className="absolute inset-0 rounded-2xl border-2 border-primary bg-primary/5 shadow-lg flex flex-col items-center justify-center p-10 text-center"
          style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
        >
          {/* Previous rating badge on back too */}
          {prevLevel && (
            <div className={cn(
              'absolute top-4 right-4 flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border',
              BADGE_COLORS[prevLevel.value]
            )}>
              <span>{prevLevel.emoji}</span>
              <span>Last: {prevLevel.label}</span>
            </div>
          )}

          <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-6">
            Definition
          </p>
          <p className="text-xl font-medium text-foreground leading-relaxed">{back}</p>
        </div>
      </div>
    </div>
  )
}