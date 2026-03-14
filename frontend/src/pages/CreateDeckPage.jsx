import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useCreateDeck }  from '@/features/decks'
import { PageWrapper }    from '@/components/layout/PageWrapper'
import { Button }         from '@/components/ui/button'
import { Input }          from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge }          from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Plus, Trash2, BookOpen } from 'lucide-react'
import { CATEGORIES }     from '@/lib/constants'
import { cn }             from '@/lib/utils'

const deckSchema = z.object({
  title:       z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  category:    z.string().min(1, 'Select a category'),
  isPublic:    z.boolean(),
})

const emptyCard = () => ({ id: Date.now(), front: '', back: '' })

export default function CreateDeckPage() {
  const { submit, isLoading, error } = useCreateDeck()
  const [cards, setCards]             = useState([emptyCard()])
  const [isPublic, setIsPublic]       = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(deckSchema),
    defaultValues: { isPublic: false },
  })

  const category = watch('category')

  const addCard = () => setCards((prev) => [...prev, emptyCard()])

  const removeCard = (id) =>
    setCards((prev) => prev.filter((c) => c.id !== id))

  const updateCard = (id, field, value) =>
    setCards((prev) =>
      prev.map((c) => (c.id === id ? { ...c, [field]: value } : c))
    )

  const onSubmit = (data) => {
    const validCards = cards.filter((c) => c.front.trim() && c.back.trim())
    submit({ ...data, cards: validCards })
  }

  return (
    <PageWrapper>
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-foreground mb-1">Create New Deck</h1>
        <p className="text-muted-foreground">Add your flashcards and start studying.</p>
      </div>

      {error && (
        <div className="mb-6 bg-destructive/10 text-destructive text-sm px-4 py-3 rounded-md">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left — Deck metadata */}
          <div className="flex flex-col gap-6">
            <Card>
              <CardHeader><CardTitle>Deck Info</CardTitle></CardHeader>
              <CardContent className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium">Title</label>
                  <Input {...register('title')} placeholder="e.g. Calculus — Limits & Derivatives" />
                  {errors.title && <p className="text-destructive text-xs">{errors.title.message}</p>}
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium">Description</label>
                  <Input {...register('description')} placeholder="What is this deck about?" />
                  {errors.description && <p className="text-destructive text-xs">{errors.description.message}</p>}
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium">Category</label>
                  <Select
                    value={category}
                    onValueChange={(val) => setValue('category', val, { shouldValidate: true })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.filter((c) => c !== 'All').map((cat) => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.category && <p className="text-destructive text-xs">{errors.category.message}</p>}
                </div>

                {/* Visibility toggle */}
                <div className="flex items-center justify-between pt-2 border-t">
                  <div>
                    <p className="text-sm font-medium">Make Public</p>
                    <p className="text-xs text-muted-foreground">Share this deck with the community</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setIsPublic((v) => !v)
                      setValue('isPublic', !isPublic)
                    }}
                    className={cn(
                      'w-11 h-6 rounded-full transition-colors relative',
                      isPublic ? 'bg-primary' : 'bg-muted'
                    )}
                  >
                    <span
                      className={cn(
                        'absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform',
                        isPublic ? 'translate-x-5' : 'translate-x-0.5'
                      )}
                    />
                  </button>
                </div>
              </CardContent>
            </Card>

            {/* Cover placeholder */}
            <Card>
              <CardHeader><CardTitle>Cover Image</CardTitle></CardHeader>
              <CardContent>
                <div className="h-32 rounded-lg border-2 border-dashed border-border flex flex-col items-center justify-center text-muted-foreground gap-2 cursor-pointer hover:border-primary hover:text-primary transition-colors">
                  <BookOpen className="h-8 w-8" />
                  <p className="text-sm">Upload cover image</p>
                  <p className="text-xs opacity-60">Available in Phase B</p>
                </div>
              </CardContent>
            </Card>

            <Button type="submit" size="lg" disabled={isLoading}>
              {isLoading ? 'Creating...' : `Create Deck (${cards.filter(c => c.front && c.back).length} cards)`}
            </Button>
          </div>

          {/* Right — Card editor */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">
                Cards
                <Badge variant="secondary" className="ml-2">{cards.length}</Badge>
              </h2>
              <Button type="button" variant="outline" size="sm" onClick={addCard}>
                <Plus className="h-4 w-4 mr-1" />Add Card
              </Button>
            </div>

            <div className="flex flex-col gap-3 max-h-[600px] overflow-y-auto pr-1">
              {cards.map((card, i) => (
                <Card key={card.id} className="border">
                  <CardContent className="p-4 flex flex-col gap-3">
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
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-medium text-muted-foreground">FRONT (Term)</label>
                      <Input
                        value={card.front}
                        onChange={(e) => updateCard(card.id, 'front', e.target.value)}
                        placeholder="e.g. What is a derivative?"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-medium text-muted-foreground">BACK (Definition)</label>
                      <Input
                        value={card.back}
                        onChange={(e) => updateCard(card.id, 'back', e.target.value)}
                        placeholder="e.g. The instantaneous rate of change..."
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
  )
}