import { cn } from '@/lib/utils'
import { BADGE_COLORS } from '../hooks/useFlashcardMode'

export function FlipCard({ front, back, frontImage, backImage, isFlipped, onClick, prevLevel }) {
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
        {/* ── Front ── */}
        <div
          className="absolute inset-0 rounded-2xl border-2 bg-background shadow-lg flex flex-col items-center justify-center p-10 text-center overflow-hidden"
          style={{ backfaceVisibility: 'hidden' }}
        >
          {prevLevel && (
            <div className={cn(
              'absolute top-4 right-4 flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border',
              BADGE_COLORS[prevLevel.value]
            )}>
              <span>{prevLevel.emoji}</span>
              <span>Last: {prevLevel.label}</span>
            </div>
          )}
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">Term</p>
          {frontImage && (
            <img
              src={frontImage}
              alt="card front"
              className="max-h-28 max-w-full object-contain rounded-lg mb-4 border border-border shadow-sm"
            />
          )}
          <p className="text-2xl font-bold text-foreground leading-relaxed">{front}</p>
          <p className="text-xs text-muted-foreground mt-6">
            Click or press <kbd className="px-1.5 py-0.5 bg-muted rounded text-xs">Space</kbd> to flip
          </p>
        </div>

        {/* ── Back ── */}
        <div
          className="absolute inset-0 rounded-2xl border-2 border-primary bg-primary/5 shadow-lg flex flex-col items-center justify-center p-10 text-center overflow-hidden"
          style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
        >
          {prevLevel && (
            <div className={cn(
              'absolute top-4 right-4 flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border',
              BADGE_COLORS[prevLevel.value]
            )}>
              <span>{prevLevel.emoji}</span>
              <span>Last: {prevLevel.label}</span>
            </div>
          )}
          <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-4">Definition</p>
          {backImage && (
            <img
              src={backImage}
              alt="card back"
              className="max-h-28 max-w-full object-contain rounded-lg mb-4 border border-border shadow-sm"
            />
          )}
          <p className="text-xl font-medium text-foreground leading-relaxed">{back}</p>
        </div>
      </div>
    </div>
  )
}