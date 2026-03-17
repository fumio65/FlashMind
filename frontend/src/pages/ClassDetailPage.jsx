import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useClass } from "@/features/classes";
import { ClassIcon } from "@/features/classes/components/ClassIcon";
import { IconPicker } from "@/features/classes/components/IconPicker";
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
  DialogFooter,
} from "@/components/ui/dialog";
import { CLASS_COLORS } from "@/features/classes/api/classes";
import {
  Plus,
  BookOpen,
  Play,
  RotateCcw,
  ClipboardList,
  Globe,
  Lock,
  ArrowLeft,
  Pencil,
  Trash2,
  AlertTriangle,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function ClassDetailPage() {
  const { id } = useParams();
  const { cls, decks, isLoading, error } = useClass(id);

  // Class edit
  const [showEditClass, setShowEditClass] = useState(false);
  const [editName, setEditName] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const [editIcon, setEditIcon] = useState(null);
  const [editColor, setEditColor] = useState("");
  const [editPublic, setEditPublic] = useState(false);

  // Deck edit
  const [showEditDeck, setShowEditDeck] = useState(false);
  const [editingDeck, setEditingDeck] = useState(null);
  const [deckTitle, setDeckTitle] = useState("");
  const [deckDesc, setDeckDesc] = useState("");
  const [deckPublic, setDeckPublic] = useState(false);

  // Delete deck
  const [toDeleteDeck, setToDeleteDeck] = useState(null);

  if (isLoading)
    return (
      <PageWrapper>
        <LoadingSpinner />
      </PageWrapper>
    );

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
    );
  }

  const handleOpenEditClass = () => {
    setEditName(cls.name);
    setEditDesc(cls.description ?? "");
    setEditIcon(cls.icon);
    setEditColor(cls.color);
    setEditPublic(cls.isPublic);
    setShowEditClass(true);
  };

  const handleSaveClass = () => {
    // Phase B: call API
    setShowEditClass(false);
  };

  const handleOpenEditDeck = (deck) => {
    setEditingDeck(deck);
    setDeckTitle(deck.title);
    setDeckDesc(deck.description ?? "");
    setDeckPublic(deck.isPublic ?? false);
    setShowEditDeck(true);
  };

  const handleSaveDeck = () => {
    // Phase B: call API
    setShowEditDeck(false);
    setEditingDeck(null);
  };

  const handleDeleteDeck = () => {
    // Phase B: call API
    setToDeleteDeck(null);
  };

  return (
    <PageWrapper>
      {/* Back */}
      <Button variant="ghost" size="sm" asChild className="mb-4 -ml-2">
        <Link to="/dashboard">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Dashboard
        </Link>
      </Button>

      {/* Hero */}
      <div
        className={cn(
          "rounded-2xl h-40 mb-6 flex items-center px-8 gap-6 bg-gradient-to-br relative",
          cls.color,
        )}
      >
        <ClassIcon icon={cls.icon} size="xl" />
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <h1 className="text-2xl font-extrabold text-white">{cls.name}</h1>
            <span className="flex items-center gap-1 text-white/70 text-xs bg-white/10 px-2 py-0.5 rounded-full">
              {cls.isPublic ? (
                <>
                  <Globe className="h-3 w-3" />
                  Public
                </>
              ) : (
                <>
                  <Lock className="h-3 w-3" />
                  Private
                </>
              )}
            </span>
          </div>
          <p className="text-white/75 text-sm max-w-lg">{cls.description}</p>
          <p className="text-white/60 text-xs mt-2">
            {decks.length} deck{decks.length !== 1 ? "s" : ""} · @
            {cls.owner?.username}
          </p>
        </div>
        <div className="flex gap-2 shrink-0">
          <Button
            variant="ghost"
            size="sm"
            className="bg-white/10 hover:bg-white/20 text-white border-0"
            onClick={handleOpenEditClass}
          >
            <Pencil className="h-3.5 w-3.5 mr-1" />
            Edit
          </Button>
          <Button
            asChild
            variant="ghost"
            className="bg-white/20 hover:bg-white/30 text-white border-0"
          >
            <Link to={`/classes/${id}/decks/new`}>
              <Plus className="h-4 w-4 mr-1" />
              New Deck
            </Link>
          </Button>
        </div>
      </div>

      {/* Decks grid */}
      {decks.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground border border-dashed border-border rounded-2xl">
          <BookOpen className="h-10 w-10 mx-auto mb-3 opacity-30" />
          <p className="mb-3 text-sm">No decks in this class yet.</p>
          <Button asChild size="sm">
            <Link to={`/classes/${id}/decks/new`}>
              <Plus className="h-3.5 w-3.5 mr-1" />
              Create First Deck
            </Link>
          </Button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {decks.map((deck) => (
            <Card
              key={deck._id}
              className="border-border hover:border-primary/50 hover:shadow-md transition-all group"
            >
              <CardContent className="p-5 flex flex-col gap-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="p-2.5 bg-primary/10 rounded-xl">
                    <BookOpen className="h-5 w-5 text-primary" />
                  </div>
                  <Badge variant="secondary" className="text-xs shrink-0">
                    {deck.cards.length} cards
                  </Badge>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground leading-snug line-clamp-2 mb-1">
                    {deck.title}
                  </h3>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {deck.description}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    asChild
                    className="text-xs"
                  >
                    <Link to={`/study/${deck._id}?mode=flashcard`}>
                      <RotateCcw className="h-3 w-3 mr-1" />
                      Flashcard
                    </Link>
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    asChild
                    className="text-xs"
                  >
                    <Link to={`/study/${deck._id}?mode=quiz`}>
                      <ClipboardList className="h-3 w-3 mr-1" />
                      Quiz
                    </Link>
                  </Button>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" asChild className="flex-1">
                    <Link to={`/decks/${deck._id}`}>
                      <Play className="h-3.5 w-3.5 mr-1.5" />
                      View Deck
                    </Link>
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="px-3"
                    onClick={() => handleOpenEditDeck(deck)}
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="px-3 text-destructive hover:text-destructive hover:border-destructive"
                    onClick={() => setToDeleteDeck(deck)}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* ── Edit Class Dialog ── */}
      <Dialog open={showEditClass} onOpenChange={setShowEditClass}>
        <DialogContent className="max-h-[90vh] overflow-hidden flex flex-col p-0 sm:max-w-2xl">
          {/* Dialog header */}
          <div className="px-6 pt-6 pb-4 border-b border-border shrink-0">
            <DialogTitle className="flex items-center gap-2 text-lg font-bold">
              <div className="p-1.5 bg-primary/10 rounded-lg">
                <Pencil className="h-4 w-4 text-primary" />
              </div>
              Edit Subject
            </DialogTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Update your subject's name, appearance, and visibility.
            </p>
          </div>

          <div className="flex flex-1 overflow-hidden">
            {/* Left — Preview panel */}
            <div className="w-56 shrink-0 bg-muted/30 border-r border-border p-5 flex flex-col gap-4">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Live Preview
              </p>

              {/* Card preview */}
              <div className="rounded-xl overflow-hidden border border-border shadow-sm">
                <div
                  className={cn(
                    "h-20 bg-gradient-to-br flex items-center px-4 gap-3",
                    editColor,
                  )}
                >
                  <ClassIcon icon={editIcon} size="sm" />
                  <p className="text-white font-semibold text-sm line-clamp-2 leading-tight">
                    {editName || "Subject Name"}
                  </p>
                </div>
                <div className="bg-card px-4 py-3">
                  <p className="text-xs text-muted-foreground line-clamp-2 min-h-[2rem]">
                    {editDesc || "No description."}
                  </p>
                  <div className="flex items-center gap-1 mt-2 text-[10px] text-muted-foreground">
                    {editPublic ? (
                      <>
                        <Globe className="h-3 w-3" />
                        Public
                      </>
                    ) : (
                      <>
                        <Lock className="h-3 w-3" />
                        Private
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Color swatches */}
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                  Color
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {CLASS_COLORS.map((c) => (
                    <button
                      key={c.value}
                      type="button"
                      onClick={() => setEditColor(c.value)}
                      title={c.label}
                      className={cn(
                        "h-8 w-full rounded-lg bg-gradient-to-br transition-all relative",
                        c.value,
                        editColor === c.value
                          ? "ring-2 ring-offset-1 ring-primary scale-105"
                          : "hover:scale-105",
                      )}
                    >
                      {editColor === c.value && (
                        <Check className="h-3.5 w-3.5 text-white absolute inset-0 m-auto" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right — Form */}
            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-5">
              {/* Name */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-foreground">
                  Subject Name
                </label>
                <Input
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder="e.g. Data Structures, Calculus"
                />
              </div>

              {/* Description */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-foreground">
                  Description
                  <span className="text-muted-foreground font-normal ml-1 text-xs">
                    (optional)
                  </span>
                </label>
                <textarea
                  value={editDesc}
                  onChange={(e) => setEditDesc(e.target.value)}
                  placeholder="Topics and lessons covered in this subject"
                  rows={3}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-0 placeholder:text-muted-foreground"
                />
              </div>

              {/* Visibility */}
              <div className="flex items-center justify-between p-4 bg-muted/30 rounded-xl border border-border">
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    Make Public
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Share this subject with the community
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setEditPublic((v) => !v)}
                  className={cn(
                    "relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none shrink-0",
                    editPublic ? "bg-primary" : "bg-muted-foreground/30",
                  )}
                >
                  <span
                    className={cn(
                      "inline-block h-4 w-4 transform rounded-full bg-white shadow-md transition-transform",
                      editPublic ? "translate-x-6" : "translate-x-1",
                    )}
                  />
                </button>
              </div>

              {/* Icon picker */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-foreground">
                  Subject Icon
                </label>
                <IconPicker value={editIcon} onChange={setEditIcon} />
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-border shrink-0 flex justify-end gap-2 bg-muted/20">
            <Button variant="outline" onClick={() => setShowEditClass(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveClass}>
              <Check className="h-4 w-4 mr-1.5" />
              Save Changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* ── Edit Deck Dialog ── */}
      <Dialog open={showEditDeck} onOpenChange={setShowEditDeck}>
        <DialogContent className="max-w-md p-0 overflow-hidden">
          {/* Header */}
          <div className="px-6 pt-6 pb-4 border-b border-border">
            <DialogTitle className="flex items-center gap-2 text-lg font-bold">
              <div className="p-1.5 bg-primary/10 rounded-lg">
                <Pencil className="h-4 w-4 text-primary" />
              </div>
              Edit Deck
            </DialogTitle>
            {editingDeck && (
              <p className="text-sm text-muted-foreground mt-1">
                Editing{" "}
                <span className="font-medium text-foreground">
                  "{editingDeck.title}"
                </span>
              </p>
            )}
          </div>

          <div className="px-6 py-5 flex flex-col gap-5">
            {/* Title */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-foreground">
                Deck Title
              </label>
              <Input
                value={deckTitle}
                onChange={(e) => setDeckTitle(e.target.value)}
                placeholder="e.g. Week 1 - Introduction"
              />
            </div>

            {/* Description */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-foreground">
                Description
                <span className="text-muted-foreground font-normal ml-1 text-xs">
                  (optional)
                </span>
              </label>
              <textarea
                value={deckDesc}
                onChange={(e) => setDeckDesc(e.target.value)}
                placeholder="What does this deck cover?"
                rows={3}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-0 placeholder:text-muted-foreground"
              />
            </div>

            {/* Visibility */}
            <div className="flex items-center justify-between p-4 bg-muted/30 rounded-xl border border-border">
              <div>
                <p className="text-sm font-semibold text-foreground">
                  Make Public
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Share this deck with the community
                </p>
              </div>
              <button
                type="button"
                onClick={() => setDeckPublic((v) => !v)}
                className={cn(
                  "relative inline-flex h-6 w-11 items-center rounded-full transition-colors shrink-0",
                  deckPublic ? "bg-primary" : "bg-muted-foreground/30",
                )}
              >
                <span
                  className={cn(
                    "inline-block h-4 w-4 transform rounded-full bg-white shadow-md transition-transform",
                    deckPublic ? "translate-x-6" : "translate-x-1",
                  )}
                />
              </button>
            </div>

            {/* Cards summary */}
            {editingDeck && (
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-semibold text-foreground">
                    Cards
                    <Badge variant="secondary" className="ml-2 text-xs">
                      {editingDeck.cards.length}
                    </Badge>
                  </label>
                  <Link
                    to={`/decks/${editingDeck._id}`}
                    className="text-xs text-primary hover:underline"
                    onClick={() => setShowEditDeck(false)}
                  >
                    Edit cards →
                  </Link>
                </div>
                <div className="rounded-xl border border-border overflow-hidden">
                  {editingDeck.cards.slice(0, 4).map((card, i) => (
                    <div
                      key={card._id}
                      className={cn(
                        "flex items-start gap-3 px-4 py-3 text-xs",
                        i < editingDeck.cards.length - 1 &&
                          "border-b border-border",
                      )}
                    >
                      <span className="text-muted-foreground font-mono shrink-0 bg-muted px-1.5 py-0.5 rounded text-[10px]">
                        {i + 1}
                      </span>
                      <div className="flex-1 min-w-0 grid grid-cols-2 gap-2">
                        <p className="font-medium text-foreground truncate">
                          {card.front}
                        </p>
                        <p className="text-muted-foreground truncate">
                          {card.back}
                        </p>
                      </div>
                    </div>
                  ))}
                  {editingDeck.cards.length > 4 && (
                    <div className="px-4 py-2.5 text-xs text-muted-foreground bg-muted/30 text-center">
                      +{editingDeck.cards.length - 4} more cards
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-border flex justify-end gap-2 bg-muted/20">
            <Button variant="outline" onClick={() => setShowEditDeck(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveDeck}>
              <Check className="h-4 w-4 mr-1.5" />
              Save Changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* ── Delete Deck Dialog ── */}
      <Dialog open={!!toDeleteDeck} onOpenChange={() => setToDeleteDeck(null)}>
        <DialogContent className="max-w-sm p-0 overflow-hidden">
          {/* Red warning header */}
          <div className="bg-destructive/10 border-b border-destructive/20 px-6 py-5">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-destructive/15 rounded-xl">
                <AlertTriangle className="h-5 w-5 text-destructive" />
              </div>
              <div>
                <DialogTitle className="text-base font-bold text-destructive">
                  Delete Deck
                </DialogTitle>
                <p className="text-xs text-destructive/70 mt-0.5">
                  This action cannot be undone
                </p>
              </div>
            </div>
          </div>

          <div className="px-6 py-5">
            <p className="text-sm text-muted-foreground mb-4">
              You are about to permanently delete:
            </p>
            {/* Deck info card */}
            <div className="flex items-center gap-3 p-3.5 bg-muted/40 rounded-xl border border-border mb-4">
              <div className="p-2 bg-primary/10 rounded-lg shrink-0">
                <BookOpen className="h-4 w-4 text-primary" />
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-foreground text-sm truncate">
                  {toDeleteDeck?.title}
                </p>
                <p className="text-xs text-muted-foreground">
                  {toDeleteDeck?.cards?.length} card
                  {toDeleteDeck?.cards?.length !== 1 ? "s" : ""} will be removed
                </p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              All flashcards inside this deck will be permanently deleted and
              cannot be recovered.
            </p>
          </div>

          <div className="px-6 py-4 border-t border-border flex justify-end gap-2 bg-muted/20">
            <Button variant="outline" onClick={() => setToDeleteDeck(null)}>
              Keep Deck
            </Button>
            <Button variant="destructive" onClick={handleDeleteDeck}>
              <Trash2 className="h-4 w-4 mr-1.5" />
              Delete Deck
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </PageWrapper>
  );
}
