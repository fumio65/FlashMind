import { useState, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useCreateDeck } from "@/features/classes";
import { useClass } from "@/features/classes";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, ArrowLeft, ImagePlus, X } from "lucide-react";
import { cn } from "@/lib/utils";

const deckSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().optional(),
  isPublic: z.boolean(),
});

const emptyCard = () => ({
  id: Date.now(),
  front: "",
  back: "",
  frontImage: null, // base64 preview
  backImage: null,
});

function ImageUploadButton({ image, onUpload, onRemove, side }) {
  const fileRef = useRef(null);

  const handleChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => onUpload(reader.result);
    reader.readAsDataURL(file);
  };

  return (
    <div>
      {image ? (
        <div className="relative mt-2">
          <img
            src={image}
            alt={`${side} image`}
            className="w-full h-28 object-cover rounded-lg border border-border"
          />
          <button
            type="button"
            onClick={onRemove}
            className="absolute top-1.5 right-1.5 bg-destructive text-white rounded-full h-5 w-5 flex items-center justify-center hover:bg-destructive/90 transition-colors"
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="mt-1.5 w-full flex items-center gap-2 px-3 py-2 rounded-lg border border-dashed border-border text-xs text-muted-foreground hover:border-primary hover:text-primary transition-colors"
        >
          <ImagePlus className="h-3.5 w-3.5 shrink-0" />
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

export default function CreateDeckPage() {
  const { id: classId } = useParams();
  const { submit, isLoading, error } = useCreateDeck();
  const { cls } = useClass(classId);
  const [cards, setCards] = useState([emptyCard()]);
  const [isPublic, setIsPublic] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(deckSchema),
    defaultValues: { isPublic: false },
  });

  const addCard = () => setCards((prev) => [...prev, emptyCard()]);
  const removeCard = (id) =>
    setCards((prev) => prev.filter((c) => c.id !== id));

  const updateCard = (id, field, value) =>
    setCards((prev) =>
      prev.map((c) => (c.id === id ? { ...c, [field]: value } : c)),
    );

  const onSubmit = (data) => {
    const validCards = cards.filter((c) => c.front.trim() && c.back.trim());
    submit({ ...data, classId, cards: validCards, isPublic });
  };

  const validCardCount = cards.filter((c) => c.front && c.back).length;

  return (
    <PageWrapper>
      {/* Back to class */}
      <Button variant="ghost" size="sm" asChild className="mb-4 -ml-2">
        <Link to={`/classes/${classId}`}>
          <ArrowLeft className="h-4 w-4 mr-1" />
          {cls?.name ?? "Back to Class"}
        </Link>
      </Button>

      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-foreground mb-1">
          Create New Deck
        </h1>
        <p className="text-muted-foreground">
          Adding to{" "}
          <span className="text-primary font-medium">
            {cls?.name ?? "class"}
          </span>
        </p>
      </div>

      {error && (
        <div className="mb-6 bg-destructive/10 text-destructive text-sm px-4 py-3 rounded-md">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left — Deck Info */}
          <div className="flex flex-col gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Deck Info</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium">Title</label>
                  <Input
                    {...register("title")}
                    placeholder="e.g. Data Structures & Algorithms"
                  />
                  {errors.title && (
                    <p className="text-destructive text-xs">
                      {errors.title.message}
                    </p>
                  )}
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium">
                    Description{" "}
                    <span className="text-muted-foreground font-normal text-xs">
                      (optional)
                    </span>
                  </label>
                  <textarea
                    {...register("description")}
                    placeholder="What is this deck about?"
                    rows={3}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-0 placeholder:text-muted-foreground"
                  />
                </div>

                {/* Visibility toggle */}
                <div className="flex items-center justify-between pt-2 border-t">
                  <div>
                    <p className="text-sm font-medium">Make Public</p>
                    <p className="text-xs text-muted-foreground">
                      Share this deck with the community
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setIsPublic((v) => !v);
                      setValue("isPublic", !isPublic);
                    }}
                    className={cn(
                      "relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none",
                      isPublic ? "bg-primary" : "bg-muted-foreground/30",
                    )}
                  >
                    <span
                      className={cn(
                        "inline-block h-4 w-4 transform rounded-full bg-white shadow-md transition-transform",
                        isPublic ? "translate-x-6" : "translate-x-1",
                      )}
                    />
                  </button>
                </div>
              </CardContent>
            </Card>

            <Button type="submit" size="lg" disabled={isLoading}>
              {isLoading
                ? "Creating..."
                : `Create Deck (${validCardCount} cards)`}
            </Button>
          </div>

          {/* Right — Card editor */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">
                Cards
                <Badge variant="secondary" className="ml-2">
                  {cards.length}
                </Badge>
              </h2>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addCard}
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Card
              </Button>
            </div>

            <div className="flex flex-col gap-3 max-h-[680px] overflow-y-auto pr-1">
              {cards.map((card, i) => (
                <Card key={card.id} className="border">
                  <CardContent className="p-4 flex flex-col gap-4">
                    {/* Card header */}
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                        Card {i + 1}
                      </span>
                      {cards.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeCard(card.id)}
                          className="text-muted-foreground hover:text-destructive transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>

                    {/* Front */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                        Front (Term)
                      </label>
                      <Input
                        value={card.front}
                        onChange={(e) =>
                          updateCard(card.id, "front", e.target.value)
                        }
                        placeholder="e.g. What is a stack?"
                      />
                      <ImageUploadButton
                        image={card.frontImage}
                        side="front"
                        onUpload={(img) =>
                          updateCard(card.id, "frontImage", img)
                        }
                        onRemove={() => updateCard(card.id, "frontImage", null)}
                      />
                    </div>

                    {/* Divider */}
                    <div className="border-t border-dashed border-border" />

                    {/* Back */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                        Back (Definition)
                      </label>
                      <Input
                        value={card.back}
                        onChange={(e) =>
                          updateCard(card.id, "back", e.target.value)
                        }
                        placeholder="e.g. A LIFO data structure..."
                      />
                      <ImageUploadButton
                        image={card.backImage}
                        side="back"
                        onUpload={(img) =>
                          updateCard(card.id, "backImage", img)
                        }
                        onRemove={() => updateCard(card.id, "backImage", null)}
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </form>
    </PageWrapper>
  );
}
