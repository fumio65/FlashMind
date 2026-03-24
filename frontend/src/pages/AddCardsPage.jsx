import { useState, useRef, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useDeck } from "@/features/decks";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { addCards } from "@/features/classes/api/classes";
import {
  ArrowLeft,
  Plus,
  Trash2,
  ImagePlus,
  X,
  BookOpen,
  AlertTriangle,
  Save,
} from "lucide-react";
import { cn } from "@/lib/utils";

const emptyCard = () => ({
  id: Date.now() + Math.random(),
  front: "",
  back: "",
  frontImage: null,
  backImage: null,
});

function ImageUploadButton({ image, onUpload, onRemove }) {
  const fileRef = useRef(null);
  const handleChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => onUpload(reader.result);
    reader.readAsDataURL(file);
  };
  return (
    <div className="mt-1.5">
      {image ? (
        <div className="relative">
          <img
            src={image}
            alt="card"
            className="w-full h-24 object-cover rounded-lg border border-border"
          />
          <button
            type="button"
            onClick={onRemove}
            className="absolute top-1.5 right-1.5 bg-destructive text-white rounded-full h-5 w-5 flex items-center justify-center hover:bg-destructive/90"
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="w-full flex items-center justify-center gap-2 py-2 rounded-lg border border-dashed border-border text-xs text-muted-foreground hover:border-primary hover:text-primary transition-colors"
        >
          <ImagePlus className="h-3.5 w-3.5" />
          Add image <span className="opacity-60">(optional)</span>
        </button>
      )}
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleChange}
      />
    </div>
  );
}

export default function AddCardsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { deck, isLoading, error } = useDeck(id);

  const [cards, setCards] = useState([emptyCard()]);
  const [activeCard, setActiveCard] = useState(0);
  const [toDelete, setToDelete] = useState(null);
  const [showEmptyWarning, setShowEmptyWarning] = useState(false);
  const [showLeaveWarning, setShowLeaveWarning] = useState(false);
  const backRef = useRef(null);

  const addCard = () => {
    const newCard = emptyCard();
    setCards((prev) => [...prev, newCard]);
    setActiveCard(cards.length);
  };

  const confirmDeleteCard = () => {
    if (!toDelete) return;
    const idx = cards.findIndex((c) => c.id === toDelete.id);
    setCards((prev) => prev.filter((c) => c.id !== toDelete.id));
    setActiveCard(Math.max(0, idx > 0 ? idx - 1 : 0));
    setToDelete(null);
  };

  const updateCard = (id, field, value) =>
    setCards((prev) =>
      prev.map((c) => (c.id === id ? { ...c, [field]: value } : c)),
    );

  const handleSave = async () => {
    const incomplete = cards.filter((c) => !c.front.trim() || !c.back.trim());
    if (incomplete.length > 0) {
      setShowEmptyWarning(true);
      return;
    }
    try {
      await addCards(id, cards);
      navigate(`/decks/${id}`);
    } catch (err) {
      console.error(err);
    }
  };

  const handleBackKeyDown = (e) => {
    if (e.key === "Tab" && !e.shiftKey) {
      e.preventDefault();
      addCard();
    }
  };

  // Derived state — declared BEFORE useEffects so they are in scope
  const incompleteCards = cards.filter(
    (c) => !c.front.trim() || !c.back.trim(),
  );
  const validCardCount = cards.length - incompleteCards.length;
  const currentCard = cards[activeCard];

  // Focus back textarea when active card changes
  useEffect(() => {
    const t = setTimeout(() => {
      if (backRef.current) backRef.current.focus();
    }, 50);
    return () => clearTimeout(t);
  }, [activeCard]);

  // Esc → always show leave warning
  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape") {
        if (showLeaveWarning || showEmptyWarning || toDelete) return;
        e.stopPropagation();
        setShowLeaveWarning(true);
      }
    };
    window.addEventListener("keydown", handler, true);
    return () => window.removeEventListener("keydown", handler, true);
  }, [showLeaveWarning, showEmptyWarning, toDelete]);

  // Del → delete current card (only if not typing and more than 1 card)
  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Delete") {
        if (showLeaveWarning || showEmptyWarning || toDelete) return;
        const tag = document.activeElement?.tagName;
        if (tag === "INPUT" || tag === "TEXTAREA") return;
        if (cards.length > 1 && currentCard) {
          setToDelete({ id: currentCard.id, index: activeCard });
        }
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [
    cards,
    currentCard,
    activeCard,
    showLeaveWarning,
    showEmptyWarning,
    toDelete,
  ]);

  // Ctrl+S → save cards
  useEffect(() => {
    const handler = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
        if (showLeaveWarning || showEmptyWarning || toDelete) return;
        handleSave();
      }
    };
    window.addEventListener("keydown", handler, true);
    return () => window.removeEventListener("keydown", handler, true);
  }, [cards, showLeaveWarning, showEmptyWarning, toDelete]);

  // Delete Card dialog: Esc = keep, Q = confirm delete
  useEffect(() => {
    if (!toDelete) return;
    const handler = (e) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        setToDelete(null);
      }
      if (e.key === "q" || e.key === "Q") {
        e.stopPropagation();
        confirmDeleteCard();
      }
    };
    window.addEventListener("keydown", handler, true);
    return () => window.removeEventListener("keydown", handler, true);
  }, [toDelete]);

  // Incomplete Cards dialog: Esc = close
  useEffect(() => {
    if (!showEmptyWarning) return;
    const handler = (e) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        setShowEmptyWarning(false);
      }
    };
    window.addEventListener("keydown", handler, true);
    return () => window.removeEventListener("keydown", handler, true);
  }, [showEmptyWarning]);

  // Leave Page dialog: Esc = stay, Q = leave
  useEffect(() => {
    if (!showLeaveWarning) return;
    const handler = (e) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        setShowLeaveWarning(false);
      }
      if (e.key === "q" || e.key === "Q") {
        e.stopPropagation();
        navigate(`/decks/${id}`);
      }
    };
    window.addEventListener("keydown", handler, true);
    return () => window.removeEventListener("keydown", handler, true);
  }, [showLeaveWarning]);

  if (isLoading)
    return (
      <PageWrapper>
        <LoadingSpinner />
      </PageWrapper>
    );

  if (error || !deck) {
    return (
      <PageWrapper>
        <div className="text-center py-20 text-muted-foreground">
          <BookOpen className="h-10 w-10 mx-auto mb-3 opacity-30" />
          <p>Deck not found.</p>
          <Button variant="link" asChild>
            <Link to="/dashboard">Go Home</Link>
          </Button>
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper className="max-w-5xl">
      {/* ── Top bar ── */}
      <div className="flex items-center justify-between mb-6">
        <Button
          variant="ghost"
          size="sm"
          className="-ml-2"
          onClick={() => setShowLeaveWarning(true)}
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Deck
          <kbd className="ml-2 text-[10px] bg-muted px-1.5 py-0.5 rounded opacity-60">
            Esc
          </kbd>
        </Button>

        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground">
            <span
              className={cn(
                "font-semibold",
                validCardCount > 0 ? "text-green-400" : "text-muted-foreground",
              )}
            >
              {validCardCount}
            </span>
            <span> / {cards.length} ready</span>
          </span>
          <Button onClick={handleSave} disabled={validCardCount === 0}>
            <Save className="h-4 w-4 mr-1.5" />
            Save{" "}
            {validCardCount > 0
              ? `${validCardCount} Card${validCardCount !== 1 ? "s" : ""}`
              : "Cards"}
            <kbd className="ml-2 text-[10px] bg-white/20 px-1.5 py-0.5 rounded opacity-70">
              Ctrl+S
            </kbd>
          </Button>
        </div>
      </div>

      {/* ── Deck info banner ── */}
      <div className="rounded-xl bg-muted/30 border border-border px-5 py-3 mb-6 flex items-center gap-3">
        <div className="p-2 bg-primary/10 rounded-lg">
          <BookOpen className="h-4 w-4 text-primary" />
        </div>
        <div>
          <p className="text-sm font-semibold text-foreground">{deck.title}</p>
          <p className="text-xs text-muted-foreground">
            Currently has {deck.cards.length} card
            {deck.cards.length !== 1 ? "s" : ""} · Adding {cards.length} new
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* ── Left: Card list sidebar ── */}
        <div className="lg:col-span-1 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-foreground">
              New Cards
              <Badge variant="secondary" className="ml-2 text-xs">
                {cards.length}
              </Badge>
            </h2>
            <Button type="button" variant="outline" size="sm" onClick={addCard}>
              <Plus className="h-3.5 w-3.5" />
            </Button>
          </div>

          {/* Card list */}
          <div
            className="flex flex-col gap-1.5 max-h-[520px] overflow-y-auto pr-1"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {cards.map((card, i) => {
              const filled = card.front.trim() && card.back.trim();
              const isActive = activeCard === i;
              return (
                <button
                  key={card.id}
                  type="button"
                  onClick={() => setActiveCard(i)}
                  className={cn(
                    "flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-left text-xs transition-all border",
                    isActive
                      ? "bg-primary/10 border-primary text-foreground"
                      : filled
                        ? "bg-green-500/5 border-green-500/20 text-foreground hover:bg-green-500/10"
                        : "bg-orange-500/5 border-orange-500/20 text-foreground hover:bg-orange-500/10",
                  )}
                >
                  <span
                    className={cn(
                      "h-5 w-5 rounded flex items-center justify-center text-[10px] font-bold shrink-0 text-white",
                      isActive
                        ? "bg-primary"
                        : filled
                          ? "bg-green-500"
                          : "bg-orange-500",
                    )}
                  >
                    {filled ? "✓" : i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p
                      className={cn(
                        "truncate font-medium",
                        !card.front.trim() && "text-muted-foreground italic",
                      )}
                    >
                      {card.front.trim() || "Empty front"}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Add card button */}
          <button
            type="button"
            onClick={addCard}
            className="flex items-center justify-center gap-2 py-2.5 rounded-lg border border-dashed border-border text-xs text-muted-foreground hover:border-primary hover:text-primary transition-colors"
          >
            <Plus className="h-3.5 w-3.5" />
            Add Card
          </button>

          {/* Summary + keyboard hints */}
          <div className="rounded-lg border border-border bg-muted/20 p-3 flex flex-col gap-2 text-xs mt-1">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Ready</span>
              <span
                className={cn(
                  "font-semibold",
                  validCardCount > 0
                    ? "text-green-400"
                    : "text-muted-foreground",
                )}
              >
                {validCardCount}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Incomplete</span>
              <span
                className={cn(
                  "font-semibold",
                  incompleteCards.length > 0
                    ? "text-orange-400"
                    : "text-muted-foreground",
                )}
              >
                {incompleteCards.length}
              </span>
            </div>
            <div className="flex flex-col gap-1.5 border-t border-border pt-2 text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <kbd className="px-1.5 py-0.5 bg-muted rounded">Tab</kbd>
                <span>Add next card</span>
              </span>
              <span className="flex items-center gap-1.5">
                <kbd className="px-1.5 py-0.5 bg-muted rounded">Del</kbd>
                <span>Remove card</span>
              </span>
              <span className="flex items-center gap-1.5">
                <kbd className="px-1.5 py-0.5 bg-muted rounded">Ctrl+S</kbd>
                <span>Save cards</span>
              </span>
              <span className="flex items-center gap-1.5">
                <kbd className="px-1.5 py-0.5 bg-muted rounded">Esc</kbd>
                <span>Back to deck</span>
              </span>
            </div>
          </div>
        </div>

        {/* ── Right: Active card editor ── */}
        <div className="lg:col-span-3">
          {currentCard && (
            <Card
              className={cn(
                "border-2 transition-colors",
                currentCard.front.trim() && currentCard.back.trim()
                  ? "border-green-500/30"
                  : "border-orange-500/30",
              )}
            >
              <CardContent className="p-6 flex flex-col gap-6">
                {/* Card header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div
                      className={cn(
                        "h-7 w-7 rounded-lg flex items-center justify-center text-xs font-bold text-white",
                        currentCard.front.trim() && currentCard.back.trim()
                          ? "bg-green-500"
                          : "bg-orange-500",
                      )}
                    >
                      {activeCard + 1}
                    </div>
                    <span className="font-semibold text-foreground">
                      Card {activeCard + 1}
                    </span>
                    {(!currentCard.front.trim() ||
                      !currentCard.back.trim()) && (
                      <Badge
                        variant="outline"
                        className="text-orange-400 border-orange-500/30 text-[10px]"
                      >
                        Incomplete
                      </Badge>
                    )}
                  </div>
                  {cards.length > 1 && (
                    <button
                      type="button"
                      onClick={() =>
                        setToDelete({ id: currentCard.id, index: activeCard })
                      }
                      className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-destructive transition-colors"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      Remove
                      <kbd className="text-[10px] bg-muted px-1.5 py-0.5 rounded opacity-60">
                        Del
                      </kbd>
                    </button>
                  )}
                </div>

                {/* Front */}
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-primary bg-primary/10 px-2 py-0.5 rounded">
                      Front
                    </span>
                    <span className="text-xs text-muted-foreground">
                      Term or question
                    </span>
                  </div>
                  <Input
                    value={currentCard.front}
                    onChange={(e) =>
                      updateCard(currentCard.id, "front", e.target.value)
                    }
                    placeholder="e.g. What is a stack?"
                    className="text-sm"
                  />
                  <ImageUploadButton
                    image={currentCard.frontImage}
                    onUpload={(img) =>
                      updateCard(currentCard.id, "frontImage", img)
                    }
                    onRemove={() =>
                      updateCard(currentCard.id, "frontImage", null)
                    }
                  />
                </div>

                {/* Flip divider */}
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-px bg-border" />
                  <span className="text-xs text-muted-foreground font-medium px-2">
                    flip
                  </span>
                  <div className="flex-1 h-px bg-border" />
                </div>

                {/* Back */}
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded">
                      Back
                    </span>
                    <span className="text-xs text-muted-foreground">
                      Answer or definition
                    </span>
                  </div>
                  <textarea
                    ref={backRef}
                    value={currentCard.back}
                    onChange={(e) =>
                      updateCard(currentCard.id, "back", e.target.value)
                    }
                    onKeyDown={handleBackKeyDown}
                    placeholder="e.g. A LIFO (Last In, First Out) data structure..."
                    rows={4}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring placeholder:text-muted-foreground"
                  />
                  <p className="text-[10px] text-muted-foreground">
                    Press{" "}
                    <kbd className="px-1.5 py-0.5 bg-muted rounded">Tab</kbd> to
                    save and add next card
                  </p>
                  <ImageUploadButton
                    image={currentCard.backImage}
                    onUpload={(img) =>
                      updateCard(currentCard.id, "backImage", img)
                    }
                    onRemove={() =>
                      updateCard(currentCard.id, "backImage", null)
                    }
                  />
                </div>

                {/* Navigation */}
                <div className="flex items-center justify-between pt-2 border-t border-border">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    disabled={activeCard === 0}
                    onClick={() => setActiveCard((v) => v - 1)}
                  >
                    ← Previous
                  </Button>
                  <span className="text-xs text-muted-foreground">
                    {activeCard + 1} / {cards.length}
                  </span>
                  {activeCard < cards.length - 1 ? (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setActiveCard((v) => v + 1)}
                    >
                      Next →
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={addCard}
                    >
                      <Plus className="h-3.5 w-3.5 mr-1" />
                      New Card
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* ── Delete Card Warning Dialog ── */}
      <Dialog open={!!toDelete} onOpenChange={() => setToDelete(null)}>
        <DialogContent className="max-w-sm p-0 overflow-hidden">
          <div className="bg-destructive/10 border-b border-destructive/20 px-6 py-5">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-destructive/15 rounded-xl">
                <AlertTriangle className="h-5 w-5 text-destructive" />
              </div>
              <div>
                <DialogTitle className="text-base font-bold text-destructive">
                  Remove Card?
                </DialogTitle>
                <p className="text-xs text-destructive/70 mt-0.5">
                  This cannot be undone
                </p>
              </div>
            </div>
          </div>
          <div className="px-6 py-5">
            <p className="text-sm text-muted-foreground mb-4">
              You are about to remove{" "}
              <span className="font-semibold text-foreground">
                Card {toDelete ? toDelete.index + 1 : ""}
              </span>
              .
            </p>
            {toDelete && cards.find((c) => c.id === toDelete.id) && (
              <div className="rounded-xl border border-border overflow-hidden text-sm">
                <div className="px-4 py-3 border-b border-border bg-muted/30">
                  <p className="text-[10px] font-bold uppercase tracking-wide text-primary mb-1">
                    Front
                  </p>
                  <p className="text-foreground font-medium">
                    {cards.find((c) => c.id === toDelete.id)?.front || (
                      <span className="text-muted-foreground italic">
                        Empty
                      </span>
                    )}
                  </p>
                </div>
                <div className="px-4 py-3">
                  <p className="text-[10px] font-bold uppercase tracking-wide text-purple-400 mb-1">
                    Back
                  </p>
                  <p className="text-muted-foreground">
                    {cards.find((c) => c.id === toDelete.id)?.back || (
                      <span className="italic">Empty</span>
                    )}
                  </p>
                </div>
              </div>
            )}
          </div>
          <div className="px-6 py-4 border-t border-border flex justify-end gap-2 bg-muted/20">
            <Button variant="outline" onClick={() => setToDelete(null)}>
              Keep Card
              <kbd className="ml-2 text-[10px] bg-muted px-1.5 py-0.5 rounded opacity-70">
                Esc
              </kbd>
            </Button>
            <Button variant="destructive" onClick={confirmDeleteCard}>
              <Trash2 className="h-4 w-4 mr-1.5" />
              Remove Card
              <kbd className="ml-2 text-[10px] bg-white/20 px-1.5 py-0.5 rounded opacity-70">
                Q
              </kbd>
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* ── Incomplete Cards Warning Dialog ── */}
      <Dialog open={showEmptyWarning} onOpenChange={setShowEmptyWarning}>
        <DialogContent className="max-w-sm p-0 overflow-hidden">
          <div className="bg-orange-500/10 border-b border-orange-500/20 px-6 py-5">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-500/15 rounded-xl">
                <AlertTriangle className="h-5 w-5 text-orange-500" />
              </div>
              <div>
                <DialogTitle className="text-base font-bold text-orange-500">
                  Incomplete Cards
                </DialogTitle>
                <p className="text-xs text-orange-500/70 mt-0.5">
                  Fill in all cards before saving
                </p>
              </div>
            </div>
          </div>
          <div className="px-6 py-5">
            <p className="text-sm text-muted-foreground mb-4">
              You have{" "}
              <span className="font-semibold text-foreground">
                {incompleteCards.length} incomplete card
                {incompleteCards.length !== 1 ? "s" : ""}
              </span>{" "}
              with missing front or back content.
            </p>
            <div className="flex flex-col gap-2">
              {cards.map((card, i) => {
                const missingFront = !card.front.trim();
                const missingBack = !card.back.trim();
                if (!missingFront && !missingBack) return null;
                return (
                  <div
                    key={card.id}
                    className="flex items-center justify-between px-3 py-2.5 bg-muted/40 rounded-lg border border-border cursor-pointer hover:border-orange-500/50 transition-colors"
                    onClick={() => {
                      setActiveCard(i);
                      setShowEmptyWarning(false);
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <span className="h-5 w-5 rounded bg-orange-500/20 text-orange-400 text-[10px] font-bold flex items-center justify-center">
                        {i + 1}
                      </span>
                      <span className="text-sm text-foreground font-medium">
                        Card {i + 1}
                      </span>
                    </div>
                    <div className="flex gap-1.5">
                      {missingFront && (
                        <span className="text-[10px] bg-orange-500/10 text-orange-400 px-2 py-0.5 rounded-full font-semibold">
                          Missing front
                        </span>
                      )}
                      {missingBack && (
                        <span className="text-[10px] bg-orange-500/10 text-orange-400 px-2 py-0.5 rounded-full font-semibold">
                          Missing back
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
            <p className="text-xs text-muted-foreground mt-3">
              Click a card above to jump to it.
            </p>
          </div>
          <div className="px-6 py-4 border-t border-border flex justify-end bg-muted/20">
            <Button onClick={() => setShowEmptyWarning(false)}>
              Go Back &amp; Fix
              <kbd className="ml-2 text-[10px] bg-white/20 px-1.5 py-0.5 rounded opacity-70">
                Esc
              </kbd>
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* ── Leave Warning Dialog ── */}
      <Dialog open={showLeaveWarning} onOpenChange={setShowLeaveWarning}>
        <DialogContent className="max-w-sm p-0 overflow-hidden">
          <div className="bg-destructive/10 border-b border-destructive/20 px-6 py-5">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-destructive/15 rounded-xl">
                <AlertTriangle className="h-5 w-5 text-destructive" />
              </div>
              <div>
                <DialogTitle className="text-base font-bold text-destructive">
                  Leave Page?
                </DialogTitle>
                <p className="text-xs text-destructive/70 mt-0.5">
                  Your unsaved cards will be lost
                </p>
              </div>
            </div>
          </div>
          <div className="px-6 py-5">
            <p className="text-sm text-muted-foreground">
              You have{" "}
              <span className="font-semibold text-foreground">
                {cards.length} card{cards.length !== 1 ? "s" : ""}
              </span>{" "}
              that haven't been saved yet. Are you sure you want to leave?
            </p>
          </div>
          <div className="px-6 py-4 border-t border-border flex justify-end gap-2 bg-muted/20">
            <Button
              variant="outline"
              onClick={() => setShowLeaveWarning(false)}
            >
              Stay &amp; Keep Editing
              <kbd className="ml-2 text-[10px] bg-muted px-1.5 py-0.5 rounded opacity-70">
                Esc
              </kbd>
            </Button>
            <Button
              variant="destructive"
              onClick={() => navigate(`/decks/${id}`)}
            >
              Leave Without Saving
              <kbd className="ml-2 text-[10px] bg-white/20 px-1.5 py-0.5 rounded opacity-70">
                Q
              </kbd>
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </PageWrapper>
  );
}
