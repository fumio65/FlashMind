import { useState, useEffect, useRef } from "react";
import { FlipCard } from "./FlipCard";
import {
  useFlashcardMode,
  CONFIDENCE_LEVELS,
  DOT_COLORS,
} from "../hooks/useFlashcardMode";
import { getQueueSummary } from "../utils/buildReviewQueue";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { RotateCcw, ArrowLeft, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  saveSession,
  saveRatings,
  getDeckRatings,
} from "@/features/classes/api/classes";

export function FlashcardMode({ deck }) {
  const [previousRatings, setPreviousRatings] = useState({});
  const [ratingsLoaded, setRatingsLoaded] = useState(false);
  const [stamp, setStamp] = useState(null);
  const [sessionCount, setSessionCount] = useState(0);
  const [showRestartDialog, setShowRestartDialog] = useState(false);
  const [showExitDialog, setShowExitDialog] = useState(false);
  const [sessionSaved, setSessionSaved] = useState(false);
  const navigate = useNavigate();
  const handleConfirmRestartRef = useRef(null);

  const {
    currentCard,
    currentIndex,
    isFlipped,
    flip,
    rate,
    restart,
    known,
    stillLearning,
    hard,
    avgScore,
    isComplete,
    total,
    uniqueTotal,
    ratings,
    ratingMap,
    prevLevel,
    queueBuilt,
    onNavigateBack,
    onRestartStudy,
  } = useFlashcardMode(deck.cards, previousRatings);

  const summary = getQueueSummary(deck.cards, previousRatings);

  // Load previous ratings from DB on mount
  useEffect(() => {
    getDeckRatings(deck._id)
      .then((savedRatings) => {
        if (Object.keys(savedRatings).length > 0) {
          setPreviousRatings(savedRatings);
        }
      })
      .catch(console.error)
      .finally(() => setRatingsLoaded(true));
  }, [deck._id]);

  const handleRate = (level) => {
    if (!isFlipped || stamp) return;
    setStamp(level);
    rate(level.value);
    setTimeout(() => setStamp(null), 600);
  };

  const handleStudyAgain = () => {
    const merged = { ...previousRatings, ...ratingMap };
    setPreviousRatings(merged);
    setSessionCount((s) => s + 1);
    setSessionSaved(false);
    restart(merged);
  };

  const handleConfirmRestart = () => {
    setShowRestartDialog(false);
    handleStudyAgain();
  };

  // Always keep ref pointing to latest handleConfirmRestart
  useEffect(() => {
    handleConfirmRestartRef.current = handleConfirmRestart;
  });

  // Wire up Esc → show exit dialog, R → open restart dialog
  useEffect(() => {
    onNavigateBack.current = () => setShowExitDialog(true);
    onRestartStudy.current = () => setShowRestartDialog(true);
  });

  // Save session + ratings when complete
  useEffect(() => {
    if (!isComplete || sessionSaved) return;
    setSessionSaved(true);

    const mergedRatings = { ...previousRatings, ...ratingMap };

    // Save ratings to DB
    const ratingsArray = Object.entries(mergedRatings).map(
      ([cardId, rating]) => ({
        cardId,
        rating,
      }),
    );
    if (ratingsArray.length > 0) {
      saveRatings(deck._id, ratingsArray).catch(console.error);
    }

    // Save session to DB
    saveSession({
      deckId: deck._id,
      mode: "flashcard",
      score: avgScore,
      knownCount: known.length,
      timeTaken: 0,
    }).catch(console.error);
  }, [isComplete]);

  // Exit dialog: Esc closes it, Q confirms exit
  useEffect(() => {
    if (!showExitDialog) return;
    const handler = (e) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        setShowExitDialog(false);
      }
      if (e.key === "q" || e.key === "Q") {
        e.stopPropagation();
        navigate(`/decks/${deck._id}`);
      }
    };
    window.addEventListener("keydown", handler, true);
    return () => window.removeEventListener("keydown", handler, true);
  }, [showExitDialog]);

  // Restart dialog: Esc closes it, R confirms restart
  useEffect(() => {
    if (!showRestartDialog) return;
    const handler = (e) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        setShowRestartDialog(false);
      }
      if (e.key === "r" || e.key === "R") {
        e.stopPropagation();
        handleConfirmRestartRef.current?.();
      }
    };
    window.addEventListener("keydown", handler, true);
    return () => window.removeEventListener("keydown", handler, true);
  }, [showRestartDialog]);

  // Keyboard shortcuts for completion screen
  useEffect(() => {
    if (!isComplete) return;
    const handler = (e) => {
      if (e.key === "r" || e.key === "R") handleStudyAgain();
      if (e.key === "Escape") navigate(`/decks/${deck._id}`);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isComplete, ratingMap]);

  const progress = Math.round((currentIndex / total) * 100);

  // Wait for ratings to load before rendering
  if (!queueBuilt) return null;

  // ── Completion screen ──
  if (isComplete) {
    const nextSummary = getQueueSummary(deck.cards, {
      ...previousRatings,
      ...ratingMap,
    });

    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 text-center px-4">
        <div className="text-6xl">🎉</div>
        <h2 className="text-3xl font-extrabold text-foreground">
          Session Complete!
        </h2>
        <p className="text-muted-foreground text-sm">
          Session {sessionCount + 1} · {total} cards reviewed
        </p>

        {/* Score */}
        <div className="bg-primary/10 border border-primary/20 rounded-2xl px-10 py-6">
          <p className="text-6xl font-extrabold text-primary mb-1">
            {avgScore}%
          </p>
          <p className="text-sm text-muted-foreground">average confidence</p>
        </div>

        {/* Dot trail */}
        <div className="w-full max-w-md">
          <p className="text-xs text-muted-foreground mb-2 font-medium uppercase tracking-wide">
            Session trail
          </p>
          <div className="flex gap-1 flex-wrap justify-center">
            {ratings.map((r, i) => {
              const level = CONFIDENCE_LEVELS.find((l) => l.value === r.value);
              return (
                <div
                  key={i}
                  title={`Card ${i + 1}: ${level?.label}`}
                  className={cn(
                    "w-5 h-5 rounded-full flex items-center justify-center text-[10px]",
                    DOT_COLORS[r.value],
                  )}
                >
                  {level?.emoji}
                </div>
              );
            })}
          </div>
        </div>

        {/* Breakdown */}
        <div className="grid grid-cols-3 gap-3 w-full max-w-sm">
          <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4 text-center">
            <p className="text-2xl font-extrabold text-green-400">
              {known.length}
            </p>
            <p className="text-xs text-green-400/80 mt-1">Known</p>
          </div>
          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4 text-center">
            <p className="text-2xl font-extrabold text-yellow-400">
              {hard.length}
            </p>
            <p className="text-xs text-yellow-400/80 mt-1">Hard</p>
          </div>
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-center">
            <p className="text-2xl font-extrabold text-red-400">
              {stillLearning.length}
            </p>
            <p className="text-xs text-red-400/80 mt-1">Forgot</p>
          </div>
        </div>

        {/* Next session preview */}
        {nextSummary && nextSummary.total > 0 && (
          <div className="w-full max-w-sm bg-muted/40 border border-border rounded-xl p-4 text-left">
            <div className="flex items-center gap-2 mb-2">
              <Info className="h-4 w-4 text-primary" />
              <p className="text-sm font-semibold text-foreground">
                Next session preview
              </p>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {nextSummary.repeated > 0 && (
                <span className="text-orange-400 font-semibold">
                  {nextSummary.repeated} weak cards
                </span>
              )}
              {nextSummary.repeated > 0 && " will appear more often. "}
              {nextSummary.skipped > 0 && (
                <span className="text-green-400 font-semibold">
                  {nextSummary.skipped} easy cards
                </span>
              )}
              {nextSummary.skipped > 0 && " will be skipped. "}
              <span className="text-foreground font-semibold">
                {nextSummary.total} total cards
              </span>{" "}
              in queue.
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3">
          <Button onClick={handleStudyAgain} variant="outline">
            <RotateCcw className="h-4 w-4 mr-2" />
            Study Again
            <kbd className="ml-2 text-[10px] bg-muted px-1.5 py-0.5 rounded opacity-70">
              R
            </kbd>
          </Button>
          <Button asChild>
            <Link to={`/decks/${deck._id}`}>
              Back to Deck
              <kbd className="ml-2 text-[10px] bg-white/20 px-1.5 py-0.5 rounded opacity-70">
                Esc
              </kbd>
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  // ── Study screen ──
  return (
    <div className="flex flex-col items-center gap-6 py-8 px-4">
      {/* Header */}
      <div className="w-full max-w-2xl flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowExitDialog(true)}
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back
          <kbd className="ml-1.5 text-[10px] bg-muted px-1.5 py-0.5 rounded opacity-60">
            Esc
          </kbd>
        </Button>
        <div className="text-center">
          <span className="text-sm font-medium text-muted-foreground">
            {currentIndex + 1} / {total}
          </span>
          {total !== uniqueTotal && (
            <p className="text-xs text-orange-400">
              {total - uniqueTotal} weak cards repeated
            </p>
          )}
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowRestartDialog(true)}
        >
          <RotateCcw className="h-4 w-4 mr-1" />
          Restart
          <kbd className="ml-1.5 text-[10px] bg-muted px-1.5 py-0.5 rounded opacity-60">
            R
          </kbd>
        </Button>
      </div>

      {/* Smart review banner */}
      {sessionCount > 0 && summary && (
        <div className="w-full max-w-2xl bg-primary/5 border border-primary/20 rounded-xl px-4 py-2.5 flex items-center gap-2 text-xs text-muted-foreground">
          <Info className="h-3.5 w-3.5 text-primary shrink-0" />
          <span>
            Smart review active —
            {summary.repeated > 0 && (
              <span className="text-orange-400 font-semibold">
                {" "}
                {summary.repeated} weak cards appear more often
              </span>
            )}
            {summary.skipped > 0 && (
              <span className="text-green-400 font-semibold">
                , {summary.skipped} easy cards skipped
              </span>
            )}
          </span>
        </div>
      )}

      {/* Progress bar + history dots */}
      <div className="w-full max-w-2xl">
        <div className="h-2 bg-muted rounded-full overflow-hidden mb-2">
          <div
            className="h-full bg-primary rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex gap-1 flex-wrap min-h-[20px]">
          {ratings.map((r, i) => {
            const level = CONFIDENCE_LEVELS.find((l) => l.value === r.value);
            return (
              <div
                key={i}
                title={`Card ${i + 1}: ${level?.label}`}
                className={cn(
                  "w-4 h-4 rounded-full flex items-center justify-center text-[9px]",
                  DOT_COLORS[r.value],
                )}
              >
                {level?.emoji}
              </div>
            );
          })}
        </div>
      </div>

      {/* Card + stamp */}
      <div className="relative w-full max-w-2xl">
        <FlipCard
          front={currentCard?.front}
          back={currentCard?.back}
          frontImage={currentCard?.frontImage}
          backImage={currentCard?.backImage}
          isFlipped={isFlipped}
          onClick={!stamp ? flip : undefined}
          prevLevel={prevLevel}
        />
        {stamp && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
            <div
              className={cn(
                "flex flex-col items-center gap-1 px-8 py-5 rounded-2xl shadow-2xl",
                stamp.color,
              )}
              style={{ animation: "stamp 0.6s ease-out forwards" }}
            >
              <span className="text-5xl">{stamp.emoji}</span>
              <span className="text-lg font-extrabold text-white">
                {stamp.label}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Rating buttons */}
      <div className="w-full max-w-2xl">
        <p className="text-center text-xs text-muted-foreground mb-3">
          {isFlipped
            ? "How well did you know this?"
            : "Flip the card first, then rate your confidence"}
        </p>
        <div className="grid grid-cols-5 gap-2">
          {CONFIDENCE_LEVELS.map((level) => (
            <button
              key={level.value}
              onClick={() => handleRate(level)}
              disabled={!isFlipped || !!stamp}
              className={cn(
                "flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl text-xs font-semibold transition-all border-2 border-transparent",
                isFlipped && !stamp
                  ? cn(
                      level.color,
                      "hover:scale-105 hover:shadow-md cursor-pointer",
                    )
                  : "bg-muted text-muted-foreground opacity-40 cursor-not-allowed",
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
        {" · "}
        <kbd className="px-1.5 py-0.5 bg-muted rounded">1–5</kbd> Rate
        {" · "}
        <kbd className="px-1.5 py-0.5 bg-muted rounded">R</kbd> Restart
        {" · "}
        <kbd className="px-1.5 py-0.5 bg-muted rounded">Esc</kbd> Exit
      </p>

      {/* Exit warning dialog */}
      <Dialog open={showExitDialog} onOpenChange={setShowExitDialog}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ArrowLeft className="h-5 w-5 text-destructive" />
              Leave Session?
            </DialogTitle>
          </DialogHeader>
          <div className="py-2">
            <p className="text-sm text-muted-foreground mb-4">
              Your current session progress will be lost if you leave now.
            </p>
            <div className="grid grid-cols-3 gap-2 mb-3">
              <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3 text-center">
                <p className="text-lg font-extrabold text-green-400">
                  {known.length}
                </p>
                <p className="text-xs text-green-400/80">Known</p>
              </div>
              <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3 text-center">
                <p className="text-lg font-extrabold text-yellow-400">
                  {hard.length}
                </p>
                <p className="text-xs text-yellow-400/80">Hard</p>
              </div>
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-center">
                <p className="text-lg font-extrabold text-red-400">
                  {stillLearning.length}
                </p>
                <p className="text-xs text-red-400/80">Forgot</p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground text-center">
              {currentIndex} of {total} cards rated so far
            </p>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setShowExitDialog(false)}>
              Keep Studying
              <kbd className="ml-2 text-[10px] bg-muted px-1.5 py-0.5 rounded opacity-70">
                Esc
              </kbd>
            </Button>
            <Button
              variant="destructive"
              onClick={() => navigate(`/decks/${deck._id}`)}
            >
              Leave Session
              <kbd className="ml-2 text-[10px] bg-white/20 px-1.5 py-0.5 rounded opacity-70">
                Q
              </kbd>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Restart confirmation dialog */}
      <Dialog
        open={showRestartDialog}
        onOpenChange={(open) => {
          if (!open) setShowRestartDialog(false);
        }}
      >
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <RotateCcw className="h-5 w-5 text-primary" />
              Restart Session?
            </DialogTitle>
          </DialogHeader>
          <div className="py-2">
            <p className="text-sm text-muted-foreground mb-4">
              Your current progress will be used to build a smarter queue for
              the next round.
            </p>
            <div className="grid grid-cols-3 gap-2 mb-4">
              <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3 text-center">
                <p className="text-lg font-extrabold text-green-400">
                  {known.length}
                </p>
                <p className="text-xs text-green-400/80">Known</p>
              </div>
              <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3 text-center">
                <p className="text-lg font-extrabold text-yellow-400">
                  {hard.length}
                </p>
                <p className="text-xs text-yellow-400/80">Hard</p>
              </div>
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-center">
                <p className="text-lg font-extrabold text-red-400">
                  {stillLearning.length}
                </p>
                <p className="text-xs text-red-400/80">Forgot</p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground text-center">
              {currentIndex} of {total} cards rated so far
            </p>
          </div>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setShowRestartDialog(false)}
            >
              Keep Going
              <kbd className="ml-2 text-[10px] bg-muted px-1.5 py-0.5 rounded opacity-70">
                Esc
              </kbd>
            </Button>
            <Button onClick={handleConfirmRestart}>
              <RotateCcw className="h-4 w-4 mr-2" />
              Yes, Restart
              <kbd className="ml-2 text-[10px] bg-white/20 px-1.5 py-0.5 rounded opacity-70">
                R
              </kbd>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <style>{`
        @keyframes stamp {
          0%   { transform: scale(2) rotate(-10deg); opacity: 0; }
          40%  { transform: scale(1.1) rotate(3deg);  opacity: 1; }
          70%  { transform: scale(0.95) rotate(-1deg); opacity: 1; }
          100% { transform: scale(1) rotate(0deg);    opacity: 0.9; }
        }
      `}</style>
    </div>
  );
}
