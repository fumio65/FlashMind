import { useState, useEffect, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useClass } from "@/features/classes";
import { useAuthStore } from "@/features/auth/store/authStore";
import { ClassIcon } from "@/features/classes/components/ClassIcon";
import { IconPicker } from "@/features/classes/components/IconPicker";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { CLASS_COLORS } from "@/features/classes/api/classes";
import {
  updateClass,
  updateDeck,
  deleteDeck,
  deleteClass,
} from "@/features/classes/api/classes";
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

// ── Edit Class Dialog ──
function EditClassDialog({
  open,
  onOpenChange,
  editName,
  setEditName,
  editDesc,
  setEditDesc,
  editIcon,
  setEditIcon,
  editColor,
  setEditColor,
  editPublic,
  setEditPublic,
  onSave,
}) {
  const onSaveRef = useRef(onSave);
  useEffect(() => {
    onSaveRef.current = onSave;
  });

  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        onOpenChange(false);
      }
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
        e.stopPropagation();
        onSaveRef.current();
      }
    };
    window.addEventListener("keydown", handler, true);
    return () => window.removeEventListener("keydown", handler, true);
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-hidden flex flex-col p-0 sm:max-w-2xl">
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
          <div className="w-56 shrink-0 bg-muted/30 border-r border-border p-5 flex flex-col gap-4">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Live Preview
            </p>
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

          <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-5">
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
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-foreground">
                Description{" "}
                <span className="text-muted-foreground font-normal ml-1 text-xs">
                  (optional)
                </span>
              </label>
              <textarea
                value={editDesc}
                onChange={(e) => setEditDesc(e.target.value)}
                placeholder="Topics and lessons covered in this subject"
                rows={3}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring placeholder:text-muted-foreground"
              />
            </div>
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
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-foreground">
                Subject Icon
              </label>
              <IconPicker value={editIcon} onChange={setEditIcon} />
            </div>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-border shrink-0 flex justify-end gap-2 bg-muted/20">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel{" "}
            <kbd className="ml-2 text-[10px] bg-muted px-1.5 py-0.5 rounded opacity-70">
              Esc
            </kbd>
          </Button>
          <Button onClick={() => onSaveRef.current()}>
            <Check className="h-4 w-4 mr-1.5" />
            Save Changes
            <kbd className="ml-2 text-[10px] bg-white/20 px-1.5 py-0.5 rounded opacity-70">
              Ctrl+S
            </kbd>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ── Main Page ──
export default function ClassDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const currentUser = useAuthStore((s) => s.user);
  const { cls, setCls, decks, setDecks, isLoading, error, refetch } =
    useClass(id);

  // Class edit
  const [showEditClass, setShowEditClass] = useState(false);
  const [editName, setEditName] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const [editIcon, setEditIcon] = useState(null);
  const [editColor, setEditColor] = useState("");
  const [editPublic, setEditPublic] = useState(false);

  // Class delete
  const [showDeleteClass, setShowDeleteClass] = useState(false);

  // Deck edit
  const [showEditDeck, setShowEditDeck] = useState(false);
  const [editingDeck, setEditingDeck] = useState(null);
  const [deckTitle, setDeckTitle] = useState("");
  const [deckDesc, setDeckDesc] = useState("");
  const [deckPublic, setDeckPublic] = useState(false);

  // Deck delete
  const [toDeleteDeck, setToDeleteDeck] = useState(null);

  // Refs
  const handleSaveDeckRef = useRef(null);
  const handleDeleteDeckRef = useRef(null);
  const handleDeleteClassRef = useRef(null);

  // Ownership / permission checks — computed after cls loads
  const isOwner = cls
    ? String(cls.owner?._id) === String(currentUser?._id) ||
      String(cls.owner?._id) === String(currentUser?.id) ||
      String(cls.owner?.id) === String(currentUser?._id) ||
      String(cls.owner?.id) === String(currentUser?.id)
    : false;
  const isAdmin = currentUser?.role === "admin";
  const canEdit = isOwner;
  const canDelete = isOwner || isAdmin;

  const handleOpenEditClass = () => {
    if (!cls) return;
    setEditName(cls.name);
    setEditDesc(cls.description ?? "");
    setEditIcon(cls.icon);
    setEditColor(cls.color);
    setEditPublic(cls.isPublic);
    setShowEditClass(true);
  };

  const handleOpenEditDeck = (deck) => {
    setEditingDeck(deck);
    setDeckTitle(deck.title);
    setDeckDesc(deck.description ?? "");
    setDeckPublic(deck.isPublic ?? false);
    setShowEditDeck(true);
  };

  const handleSaveClass = async () => {
    setCls((prev) => ({
      ...prev,
      name: editName,
      description: editDesc,
      icon: editIcon,
      color: editColor,
      isPublic: editPublic,
    }));
    setShowEditClass(false);
    try {
      await updateClass(id, {
        name: editName,
        description: editDesc,
        icon: editIcon,
        color: editColor,
        isPublic: editPublic,
      });
      refetch();
    } catch (err) {
      console.error("Failed to update class:", err);
      refetch();
    }
  };

  const handleSaveDeck = async () => {
    if (!editingDeck) return;
    setDecks((prev) =>
      prev.map((d) =>
        d._id === editingDeck._id
          ? {
              ...d,
              title: deckTitle,
              description: deckDesc,
              isPublic: deckPublic,
            }
          : d,
      ),
    );
    setShowEditDeck(false);
    setEditingDeck(null);
    try {
      await updateDeck(editingDeck._id, {
        title: deckTitle,
        description: deckDesc,
        isPublic: deckPublic,
      });
      refetch();
    } catch (err) {
      console.error("Failed to update deck:", err);
      refetch();
    }
  };

  const handleDeleteDeck = async () => {
    if (!toDeleteDeck) return;
    const deletedId = toDeleteDeck._id;
    setDecks((prev) => prev.filter((d) => d._id !== deletedId));
    setToDeleteDeck(null);
    try {
      await deleteDeck(deletedId);
    } catch (err) {
      console.error("Failed to delete deck:", err);
      refetch();
    }
  };

  const handleDeleteClass = async () => {
    setShowDeleteClass(false);
    try {
      await deleteClass(id);
      navigate("/dashboard");
    } catch (err) {
      console.error("Failed to delete class:", err);
    }
  };

  // Always keep refs fresh
  useEffect(() => {
    handleSaveDeckRef.current = handleSaveDeck;
  });
  useEffect(() => {
    handleDeleteDeckRef.current = handleDeleteDeck;
  });
  useEffect(() => {
    handleDeleteClassRef.current = handleDeleteClass;
  });

  // Ctrl+E → open edit class (owner only)
  useEffect(() => {
    if (!canEdit) return;
    const handler = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "e") {
        e.preventDefault();
        if (
          !showEditClass &&
          !showEditDeck &&
          !toDeleteDeck &&
          !showDeleteClass &&
          cls
        ) {
          handleOpenEditClass();
        }
      }
    };
    window.addEventListener("keydown", handler, true);
    return () => window.removeEventListener("keydown", handler, true);
  }, [
    showEditClass,
    showEditDeck,
    toDeleteDeck,
    showDeleteClass,
    cls,
    canEdit,
  ]);

  // Edit Deck dialog: Esc = close, Ctrl+S = save
  useEffect(() => {
    if (!showEditDeck) return;
    const handler = (e) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        setShowEditDeck(false);
      }
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
        e.stopPropagation();
        handleSaveDeckRef.current?.();
      }
    };
    window.addEventListener("keydown", handler, true);
    return () => window.removeEventListener("keydown", handler, true);
  }, [showEditDeck]);

  // Delete Deck dialog: Esc = keep, Q = confirm
  useEffect(() => {
    if (!toDeleteDeck) return;
    const handler = (e) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        setToDeleteDeck(null);
      }
      if (e.key === "q" || e.key === "Q") {
        e.stopPropagation();
        handleDeleteDeckRef.current?.();
      }
    };
    window.addEventListener("keydown", handler, true);
    return () => window.removeEventListener("keydown", handler, true);
  }, [toDeleteDeck]);

  // Delete Class dialog: Esc = keep, Q = confirm
  useEffect(() => {
    if (!showDeleteClass) return;
    const handler = (e) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        setShowDeleteClass(false);
      }
      if (e.key === "q" || e.key === "Q") {
        e.stopPropagation();
        handleDeleteClassRef.current?.();
      }
    };
    window.addEventListener("keydown", handler, true);
    return () => window.removeEventListener("keydown", handler, true);
  }, [showDeleteClass]);

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
          {canEdit && (
            <Button
              variant="ghost"
              size="sm"
              className="bg-white/10 hover:bg-white/20 text-white border-0"
              onClick={handleOpenEditClass}
            >
              <Pencil className="h-3.5 w-3.5 mr-1" />
              Edit
              <kbd className="ml-1.5 text-[10px] bg-white/10 px-1.5 py-0.5 rounded opacity-70">
                Ctrl+E
              </kbd>
            </Button>
          )}
          {canDelete && (
            <Button
              variant="ghost"
              size="sm"
              className="bg-white/10 hover:bg-red-500/30 text-white border-0"
              onClick={() => setShowDeleteClass(true)}
            >
              <Trash2 className="h-3.5 w-3.5 mr-1" />
              Delete
            </Button>
          )}
          {canEdit && (
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
          )}
        </div>
      </div>

      {/* Decks grid */}
      {decks.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground border border-dashed border-border rounded-2xl">
          <BookOpen className="h-10 w-10 mx-auto mb-3 opacity-30" />
          <p className="mb-3 text-sm">No decks in this class yet.</p>
          {canEdit && (
            <Button asChild size="sm">
              <Link to={`/classes/${id}/decks/new`}>
                <Plus className="h-3.5 w-3.5 mr-1" />
                Create First Deck
              </Link>
            </Button>
          )}
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
                  {canEdit && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="px-3"
                      onClick={() => handleOpenEditDeck(deck)}
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                  )}
                  {canDelete && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="px-3 text-destructive hover:text-destructive hover:border-destructive"
                      onClick={() => setToDeleteDeck(deck)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* ── Edit Class Dialog ── */}
      <EditClassDialog
        open={showEditClass}
        onOpenChange={setShowEditClass}
        editName={editName}
        setEditName={setEditName}
        editDesc={editDesc}
        setEditDesc={setEditDesc}
        editIcon={editIcon}
        setEditIcon={setEditIcon}
        editColor={editColor}
        setEditColor={setEditColor}
        editPublic={editPublic}
        setEditPublic={setEditPublic}
        onSave={handleSaveClass}
      />

      {/* ── Edit Deck Dialog ── */}
      <Dialog open={showEditDeck} onOpenChange={setShowEditDeck}>
        <DialogContent className="w-[680px] p-0 overflow-hidden">
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
          <div
            className="px-6 py-5 flex flex-col gap-5 max-h-[65vh] overflow-y-auto"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-foreground">
                Deck Title
              </label>
              <Input
                value={deckTitle}
                onChange={(e) => setDeckTitle(e.target.value)}
                placeholder="e.g. Week 1 — Introduction"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-foreground">
                Description{" "}
                <span className="text-muted-foreground font-normal ml-1 text-xs">
                  (optional)
                </span>
              </label>
              <textarea
                value={deckDesc}
                onChange={(e) => setDeckDesc(e.target.value)}
                placeholder="What does this deck cover?"
                rows={3}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring placeholder:text-muted-foreground"
              />
            </div>
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
            {editingDeck && (
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <label className="text-sm font-semibold text-foreground">
                      Cards
                    </label>
                    <Badge variant="secondary" className="text-xs">
                      {editingDeck.cards.length}
                    </Badge>
                  </div>
                  <Link
                    to={`/decks/${editingDeck._id}`}
                    className="flex items-center gap-1 text-xs text-primary hover:underline font-medium"
                    onClick={() => setShowEditDeck(false)}
                  >
                    Edit individual cards →
                  </Link>
                </div>
                <div className="rounded-xl border border-border overflow-hidden">
                  {editingDeck.cards.slice(0, 4).map((card, i) => (
                    <div
                      key={card._id}
                      className={cn(
                        "flex items-center gap-3 px-4 py-3 hover:bg-muted/20 transition-colors",
                        i < Math.min(editingDeck.cards.length, 4) - 1 &&
                          "border-b border-border",
                      )}
                    >
                      <span className="h-6 w-6 rounded-md bg-primary/10 text-primary text-[10px] font-bold flex items-center justify-center shrink-0">
                        {i + 1}
                      </span>
                      <div className="flex-1 min-w-0 grid grid-cols-2 gap-4 text-xs">
                        <div className="min-w-0">
                          <p className="text-[9px] font-bold uppercase tracking-wide text-primary mb-0.5">
                            Front
                          </p>
                          <p className="text-foreground font-medium truncate">
                            {card.front}
                          </p>
                        </div>
                        <div className="min-w-0">
                          <p className="text-[9px] font-bold uppercase tracking-wide text-purple-400 mb-0.5">
                            Back
                          </p>
                          <p className="text-muted-foreground truncate">
                            {card.back}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                  {editingDeck.cards.length > 4 && (
                    <div className="px-4 py-3 bg-muted/20 text-center">
                      <Link
                        to={`/decks/${editingDeck._id}`}
                        className="text-xs text-primary font-medium hover:underline"
                        onClick={() => setShowEditDeck(false)}
                      >
                        +{editingDeck.cards.length - 4} more cards — click to
                        view all
                      </Link>
                    </div>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  To add, edit, or delete individual cards use{" "}
                  <Link
                    to={`/decks/${editingDeck._id}`}
                    className="text-primary hover:underline font-medium"
                    onClick={() => setShowEditDeck(false)}
                  >
                    View Deck
                  </Link>
                </p>
              </div>
            )}
          </div>
          <div className="px-6 py-4 border-t border-border flex justify-between items-center bg-muted/20">
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-foreground"
              asChild
              onClick={() => setShowEditDeck(false)}
            >
              <Link to={editingDeck ? `/decks/${editingDeck._id}` : "#"}>
                <BookOpen className="h-3.5 w-3.5 mr-1.5" />
                Open Full Deck
              </Link>
            </Button>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setShowEditDeck(false)}>
                Cancel{" "}
                <kbd className="ml-2 text-[10px] bg-muted px-1.5 py-0.5 rounded opacity-70">
                  Esc
                </kbd>
              </Button>
              <Button onClick={() => handleSaveDeckRef.current?.()}>
                <Check className="h-4 w-4 mr-1.5" />
                Save Changes
                <kbd className="ml-2 text-[10px] bg-white/20 px-1.5 py-0.5 rounded opacity-70">
                  Ctrl+S
                </kbd>
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* ── Delete Deck Dialog ── */}
      <Dialog open={!!toDeleteDeck} onOpenChange={() => setToDeleteDeck(null)}>
        <DialogContent className="max-w-sm p-0 overflow-hidden">
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
            <div className="flex items-center gap-3 p-3.5 bg-muted/40 rounded-xl border border-border">
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
            <p className="text-xs text-muted-foreground mt-3">
              All flashcards inside this deck will be permanently deleted.
            </p>
          </div>
          <div className="px-6 py-4 border-t border-border flex justify-end gap-2 bg-muted/20">
            <Button variant="outline" onClick={() => setToDeleteDeck(null)}>
              Keep Deck{" "}
              <kbd className="ml-2 text-[10px] bg-muted px-1.5 py-0.5 rounded opacity-70">
                Esc
              </kbd>
            </Button>
            <Button
              variant="destructive"
              onClick={() => handleDeleteDeckRef.current?.()}
            >
              <Trash2 className="h-4 w-4 mr-1.5" />
              Delete Deck
              <kbd className="ml-2 text-[10px] bg-white/20 px-1.5 py-0.5 rounded opacity-70">
                Q
              </kbd>
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* ── Delete Class Dialog ── */}
      <Dialog open={showDeleteClass} onOpenChange={setShowDeleteClass}>
        <DialogContent className="max-w-sm p-0 overflow-hidden">
          <div className="bg-destructive/10 border-b border-destructive/20 px-6 py-5">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-destructive/15 rounded-xl">
                <AlertTriangle className="h-5 w-5 text-destructive" />
              </div>
              <div>
                <DialogTitle className="text-base font-bold text-destructive">
                  Delete Subject
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
            <div className="flex items-center gap-3 p-3.5 bg-muted/40 rounded-xl border border-border">
              <ClassIcon icon={cls?.icon} size="sm" />
              <div className="min-w-0">
                <p className="font-semibold text-foreground text-sm truncate">
                  {cls?.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {decks.length} deck{decks.length !== 1 ? "s" : ""} and all
                  cards will be removed
                </p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-3">
              All decks and flashcards inside this subject will be permanently
              deleted.
            </p>
          </div>
          <div className="px-6 py-4 border-t border-border flex justify-end gap-2 bg-muted/20">
            <Button variant="outline" onClick={() => setShowDeleteClass(false)}>
              Keep Subject{" "}
              <kbd className="ml-2 text-[10px] bg-muted px-1.5 py-0.5 rounded opacity-70">
                Esc
              </kbd>
            </Button>
            <Button
              variant="destructive"
              onClick={() => handleDeleteClassRef.current?.()}
            >
              <Trash2 className="h-4 w-4 mr-1.5" />
              Delete Subject
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
