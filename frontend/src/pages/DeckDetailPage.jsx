import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useDeck } from "@/features/decks";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  BookOpen,
  RotateCcw,
  ClipboardList,
  User,
  Calendar,
  Lock,
  Globe,
  ChevronRight,
  Pencil,
  Trash2,
  Plus,
  Check,
  AlertTriangle,
  ImagePlus,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useRef } from "react";

// ── Inline image upload button ──
function CardImageField({ image, onUpload, onRemove }) {
  const fileRef = useRef(null);
  const handleChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => onUpload(reader.result);
    reader.readAsDataURL(file);
  };
  return (
    <div className="mt-1">
      {image ? (
        <div className="relative">
          <img
            src={image}
            alt="card"
            className="w-full h-20 object-cover rounded-lg border border-border"
          />
          <button
            type="button"
            onClick={onRemove}
            className="absolute top-1 right-1 bg-destructive text-white rounded-full h-5 w-5 flex items-center justify-center"
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg border border-dashed border-border text-xs text-muted-foreground hover:border-primary hover:text-primary transition-colors"
        >
          <ImagePlus className="h-3.5 w-3.5" />
          Add image (optional)
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

export default function DeckDetailPage() {
  const { id } = useParams();
  const { deck, isLoading, error } = useDeck(id);

  // Edit deck dialog
  const [showEditDeck, setShowEditDeck] = useState(false);
  const [deckTitle, setDeckTitle] = useState("");
  const [deckDesc, setDeckDesc] = useState("");
  const [deckPublic, setDeckPublic] = useState(false);

  // Edit card dialog
  const [showEditCard, setShowEditCard] = useState(false);
  const [editingCard, setEditingCard] = useState(null);
  const [cardFront, setCardFront] = useState("");
  const [cardBack, setCardBack] = useState("");
  const [cardFrontImage, setCardFrontImage] = useState(null);
  const [cardBackImage, setCardBackImage] = useState(null);

  // Add card dialog
  const [showAddCard, setShowAddCard] = useState(false);
  const [newFront, setNewFront] = useState("");
  const [newBack, setNewBack] = useState("");
  const [newFrontImage, setNewFrontImage] = useState(null);
  const [newBackImage, setNewBackImage] = useState(null);

  // Delete card dialog
  const [toDeleteCard, setToDeleteCard] = useState(null);

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
          <Button variant="link" asChild className="mt-2">
            <Link to="/browse">Back to Browse</Link>
          </Button>
        </div>
      </PageWrapper>
    );
  }

  const mastery = Math.round((2 / deck.cards.length) * 100);

  const handleOpenEditDeck = () => {
    setDeckTitle(deck.title);
    setDeckDesc(deck.description ?? "");
    setDeckPublic(deck.isPublic ?? false);
    setShowEditDeck(true);
  };

  const handleSaveDeck = () => {
    // Phase B: call API
    setShowEditDeck(false);
  };

  const handleOpenEditCard = (card) => {
    setEditingCard(card);
    setCardFront(card.front);
    setCardBack(card.back);
    setCardFrontImage(card.frontImage ?? null);
    setCardBackImage(card.backImage ?? null);
    setShowEditCard(true);
  };

  const handleSaveCard = () => {
    // Phase B: call API
    setShowEditCard(false);
    setEditingCard(null);
  };

  const handleAddCard = () => {
    // Phase B: call API
    setNewFront("");
    setNewBack("");
    setNewFrontImage(null);
    setNewBackImage(null);
    setShowAddCard(false);
  };

  const handleDeleteCard = () => {
    // Phase B: call API
    setToDeleteCard(null);
  };

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
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                {deck.isPublic ? (
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
            <h1 className="text-2xl font-extrabold text-foreground mb-1">
              {deck.title}
            </h1>
            <p className="text-muted-foreground text-sm max-w-lg">
              {deck.description}
            </p>
            <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground flex-wrap">
              <span className="flex items-center gap-1">
                <User className="h-3 w-3" />
                {deck.owner?.username}
              </span>
              <span className="flex items-center gap-1">
                <BookOpen className="h-3 w-3" />
                {deck.cards.length} cards
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {new Date(deck.createdAt).toLocaleDateString("en-PH", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </span>
            </div>
          </div>
        </div>

        {/* Edit button */}
        <Button
          variant="outline"
          size="sm"
          onClick={handleOpenEditDeck}
          className="shrink-0"
        >
          <Pencil className="h-3.5 w-3.5 mr-1.5" />
          Edit Deck
        </Button>
      </div>

      {/* Study mode tiles + mastery */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <Link to={`/study/${deck._id}?mode=flashcard`} className="group">
          <Card className="h-full hover:shadow-md hover:border-primary transition-all cursor-pointer">
            <CardContent className="p-6 flex flex-col items-center text-center gap-3">
              <div className="p-4 bg-blue-50 rounded-xl group-hover:bg-blue-100 transition-colors">
                <RotateCcw className="h-8 w-8 text-blue-500" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">
                  Flashcard Mode
                </h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Flip cards, mark known and still learning
                </p>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors mt-auto" />
            </CardContent>
          </Card>
        </Link>

        <Link to={`/study/${deck._id}?mode=quiz`} className="group">
          <Card className="h-full hover:shadow-md hover:border-primary transition-all cursor-pointer">
            <CardContent className="p-6 flex flex-col items-center text-center gap-3">
              <div className="p-4 bg-purple-50 rounded-xl group-hover:bg-purple-100 transition-colors">
                <ClipboardList className="h-8 w-8 text-purple-500" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Quiz Mode</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  MCQ with 30s timer and instant feedback
                </p>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors mt-auto" />
            </CardContent>
          </Card>
        </Link>

        <Card>
          <CardContent className="p-6 flex flex-col gap-4">
            <div>
              <h3 className="font-semibold text-foreground mb-1">
                Your Mastery
              </h3>
              <p className="text-xs text-muted-foreground">
                Based on your last session
              </p>
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

      {/* Cards table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base">
            Cards in this deck
            <Badge variant="secondary" className="ml-2 text-xs">
              {deck.cards.length}
            </Badge>
          </CardTitle>
          <Button size="sm" onClick={() => setShowAddCard(true)}>
            <Plus className="h-3.5 w-3.5 mr-1" />
            Add Card
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y">
            {deck.cards.map((card, i) => (
              <div
                key={card._id}
                className="flex items-start gap-4 px-6 py-4 hover:bg-muted/20 transition-colors group"
              >
                <span className="text-xs font-mono text-muted-foreground w-6 shrink-0 pt-1">
                  {i + 1}
                </span>
                <div className="grid md:grid-cols-2 gap-3 flex-1 text-sm">
                  {/* Front */}
                  <div>
                    <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide mb-1">
                      Front
                    </p>
                    <p className="text-foreground font-medium">{card.front}</p>
                    {card.frontImage && (
                      <img
                        src={card.frontImage}
                        alt="front"
                        className="mt-2 h-14 rounded-lg object-cover border border-border"
                      />
                    )}
                  </div>
                  {/* Back */}
                  <div>
                    <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide mb-1">
                      Back
                    </p>
                    <p className="text-muted-foreground">{card.back}</p>
                    {card.backImage && (
                      <img
                        src={card.backImage}
                        alt="back"
                        className="mt-2 h-14 rounded-lg object-cover border border-border"
                      />
                    )}
                  </div>
                </div>

                {/* Actions — visible on hover */}
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-8 w-8 p-0"
                    onClick={() => handleOpenEditCard(card)}
                  >
                    <Pencil className="h-3.5 w-3.5 text-muted-foreground" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-8 w-8 p-0"
                    onClick={() => setToDeleteCard(card)}
                  >
                    <Trash2 className="h-3.5 w-3.5 text-destructive" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* ── Edit Deck Dialog ── */}
      <Dialog open={showEditDeck} onOpenChange={setShowEditDeck}>
        <DialogContent className="max-w-md p-0 overflow-hidden">
          <div className="px-6 pt-6 pb-4 border-b border-border">
            <DialogTitle className="flex items-center gap-2 text-lg font-bold">
              <div className="p-1.5 bg-primary/10 rounded-lg">
                <Pencil className="h-4 w-4 text-primary" />
              </div>
              Edit Deck
            </DialogTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Update deck info and visibility.
            </p>
          </div>

          <div className="px-6 py-5 flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold">Title</label>
              <Input
                value={deckTitle}
                onChange={(e) => setDeckTitle(e.target.value)}
                placeholder="Deck title"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold">
                Description{" "}
                <span className="text-muted-foreground font-normal text-xs">
                  (optional)
                </span>
              </label>
              <textarea
                value={deckDesc}
                onChange={(e) => setDeckDesc(e.target.value)}
                placeholder="What is this deck about?"
                rows={3}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-0 placeholder:text-muted-foreground"
              />
            </div>
            <div className="flex items-center justify-between p-4 bg-muted/30 rounded-xl border border-border">
              <div>
                <p className="text-sm font-semibold">Make Public</p>
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
          </div>

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

      {/* ── Edit Card Dialog ── */}
      <Dialog open={showEditCard} onOpenChange={setShowEditCard}>
        <DialogContent className="max-w-md p-0 overflow-hidden">
          <div className="px-6 pt-6 pb-4 border-b border-border">
            <DialogTitle className="flex items-center gap-2 text-lg font-bold">
              <div className="p-1.5 bg-primary/10 rounded-lg">
                <Pencil className="h-4 w-4 text-primary" />
              </div>
              Edit Card
            </DialogTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Update the front and back of this card.
            </p>
          </div>

          <div className="px-6 py-5 flex flex-col gap-5">
            {/* Front */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Front (Term)
              </label>
              <Input
                value={cardFront}
                onChange={(e) => setCardFront(e.target.value)}
                placeholder="Term or question"
              />
              <CardImageField
                image={cardFrontImage}
                onUpload={setCardFrontImage}
                onRemove={() => setCardFrontImage(null)}
              />
            </div>

            <div className="border-t border-dashed border-border" />

            {/* Back */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Back (Definition)
              </label>
              <Input
                value={cardBack}
                onChange={(e) => setCardBack(e.target.value)}
                placeholder="Answer or definition"
              />
              <CardImageField
                image={cardBackImage}
                onUpload={setCardBackImage}
                onRemove={() => setCardBackImage(null)}
              />
            </div>
          </div>

          <div className="px-6 py-4 border-t border-border flex justify-end gap-2 bg-muted/20">
            <Button variant="outline" onClick={() => setShowEditCard(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveCard}>
              <Check className="h-4 w-4 mr-1.5" />
              Save Card
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* ── Add Card Dialog ── */}
      <Dialog open={showAddCard} onOpenChange={setShowAddCard}>
        <DialogContent className="max-w-md p-0 overflow-hidden">
          <div className="px-6 pt-6 pb-4 border-b border-border">
            <DialogTitle className="flex items-center gap-2 text-lg font-bold">
              <div className="p-1.5 bg-green-500/10 rounded-lg">
                <Plus className="h-4 w-4 text-green-500" />
              </div>
              Add New Card
            </DialogTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Add a new flashcard to this deck.
            </p>
          </div>

          <div className="px-6 py-5 flex flex-col gap-5">
            {/* Front */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Front (Term)
              </label>
              <Input
                value={newFront}
                onChange={(e) => setNewFront(e.target.value)}
                placeholder="Term or question"
              />
              <CardImageField
                image={newFrontImage}
                onUpload={setNewFrontImage}
                onRemove={() => setNewFrontImage(null)}
              />
            </div>

            <div className="border-t border-dashed border-border" />

            {/* Back */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Back (Definition)
              </label>
              <Input
                value={newBack}
                onChange={(e) => setNewBack(e.target.value)}
                placeholder="Answer or definition"
              />
              <CardImageField
                image={newBackImage}
                onUpload={setNewBackImage}
                onRemove={() => setNewBackImage(null)}
              />
            </div>
          </div>

          <div className="px-6 py-4 border-t border-border flex justify-end gap-2 bg-muted/20">
            <Button variant="outline" onClick={() => setShowAddCard(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleAddCard}
              disabled={!newFront.trim() || !newBack.trim()}
            >
              <Plus className="h-4 w-4 mr-1.5" />
              Add Card
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* ── Delete Card Dialog ── */}
      <Dialog open={!!toDeleteCard} onOpenChange={() => setToDeleteCard(null)}>
        <DialogContent className="max-w-sm p-0 overflow-hidden">
          <div className="bg-destructive/10 border-b border-destructive/20 px-6 py-5">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-destructive/15 rounded-xl">
                <AlertTriangle className="h-5 w-5 text-destructive" />
              </div>
              <div>
                <DialogTitle className="text-base font-bold text-destructive">
                  Delete Card
                </DialogTitle>
                <p className="text-xs text-destructive/70 mt-0.5">
                  This action cannot be undone
                </p>
              </div>
            </div>
          </div>

          <div className="px-6 py-5">
            <p className="text-sm text-muted-foreground mb-4">
              You are about to delete this card:
            </p>
            <div className="rounded-xl border border-border overflow-hidden">
              <div className="px-4 py-3 border-b border-border bg-muted/30">
                <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide mb-1">
                  Front
                </p>
                <p className="text-sm font-medium text-foreground">
                  {toDeleteCard?.front}
                </p>
              </div>
              <div className="px-4 py-3">
                <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide mb-1">
                  Back
                </p>
                <p className="text-sm text-muted-foreground">
                  {toDeleteCard?.back}
                </p>
              </div>
            </div>
          </div>

          <div className="px-6 py-4 border-t border-border flex justify-end gap-2 bg-muted/20">
            <Button variant="outline" onClick={() => setToDeleteCard(null)}>
              Keep Card
            </Button>
            <Button variant="destructive" onClick={handleDeleteCard}>
              <Trash2 className="h-4 w-4 mr-1.5" />
              Delete Card
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </PageWrapper>
  );
}
