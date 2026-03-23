import { useState, useRef, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useCreateDeck }  from '@/features/classes'
import { useClass }       from '@/features/classes'
import { PageWrapper }    from '@/components/layout/PageWrapper'
import { Button }         from '@/components/ui/button'
import { Input }          from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Badge }          from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Plus, Trash2, ArrowLeft, ImagePlus, X, BookOpen, AlertTriangle, Save } from 'lucide-react'
import { cn } from '@/lib/utils'

const deckSchema = z.object({
  title:       z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().optional(),
  isPublic:    z.boolean(),
})

const emptyCard = () => ({
  id:         Date.now() + Math.random(),
  front:      '',
  back:       '',
  frontImage: null,
  backImage:  null,
})

function ImageUploadButton({ image, onUpload, onRemove }) {
  const fileRef = useRef(null)
  const handleChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => onUpload(reader.result)
    reader.readAsDataURL(file)
  }
  return (
    <div className="mt-1.5">
      {image ? (
        <div className="relative">
          <img src={image} alt="card" className="w-full h-24 object-cover rounded-lg border border-border" />
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
      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleChange} />
    </div>
  )
}

export default function CreateDeckPage() {
  const { id: classId }              = useParams()
  const navigate                     = useNavigate()
  const { submit, isLoading, error } = useCreateDeck()
  const { cls }                      = useClass(classId)
  const [cards, setCards]            = useState([emptyCard()])
  const [isPublic, setIsPublic]      = useState(false)
  const [activeCard, setActiveCard]  = useState(0)
  const [toDelete, setToDelete]      = useState(null)
  const [showEmptyWarning, setShowEmptyWarning] = useState(false)
  const [showLeaveWarning, setShowLeaveWarning] = useState(false)
  const backRef                      = useRef(null)

  const { register, handleSubmit, setValue, formState: { errors } } = useForm({
    resolver: zodResolver(deckSchema),
    defaultValues: { isPublic: false },
  })

  const addCard = () => {
    const newCard = emptyCard()
    setCards((prev) => [...prev, newCard])
    setActiveCard(cards.length)
  }

  const confirmDeleteCard = () => {
    if (!toDelete) return
    const idx = cards.findIndex((c) => c.id === toDelete.id)
    setCards((prev) => prev.filter((c) => c.id !== toDelete.id))
    setActiveCard(Math.max(0, idx > 0 ? idx - 1 : 0))
    setToDelete(null)
  }

  const updateCard = (id, field, value) =>
    setCards((prev) => prev.map((c) => (c.id === id ? { ...c, [field]: value } : c)))

  const onSubmit = (data) => {
    const incompleteCards = cards.filter((c) => !c.front.trim() || !c.back.trim())
    if (incompleteCards.length > 0) {
      setShowEmptyWarning(true)
      return
    }
    submit({ ...data, classId, cards, isPublic })
  }

  const handleBackKeyDown = (e) => {
    if (e.key === 'Tab' && !e.shiftKey) {
      e.preventDefault()
      addCard()
    }
  }

  // Derived state — before useEffects
  const incompleteCards = cards.filter((c) => !c.front.trim() || !c.back.trim())
  const validCardCount  = cards.length - incompleteCards.length
  const currentCard     = cards[activeCard]

  // Focus back textarea when active card changes
  useEffect(() => {
    const t = setTimeout(() => {
      if (backRef.current) backRef.current.focus()
    }, 50)
    return () => clearTimeout(t)
  }, [activeCard])

  // Esc → always show leave warning
  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape') {
        if (showLeaveWarning || showEmptyWarning || toDelete) return
        e.stopPropagation()
        setShowLeaveWarning(true)
      }
    }
    window.addEventListener('keydown', handler, true)
    return () => window.removeEventListener('keydown', handler, true)
  }, [showLeaveWarning, showEmptyWarning, toDelete])

  // Del → delete current card
  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Delete') {
        if (showLeaveWarning || showEmptyWarning || toDelete) return
        const tag = document.activeElement?.tagName
        if (tag === 'INPUT' || tag === 'TEXTAREA') return
        if (cards.length > 1 && currentCard) {
          setToDelete({ id: currentCard.id, index: activeCard })
        }
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [cards, currentCard, activeCard, showLeaveWarning, showEmptyWarning, toDelete])

  // Ctrl+S → submit form
  useEffect(() => {
    const handler = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault()
        if (showLeaveWarning || showEmptyWarning || toDelete) return
        handleSubmit(onSubmit)()
      }
    }
    window.addEventListener('keydown', handler, true)
    return () => window.removeEventListener('keydown', handler, true)
  }, [cards, showLeaveWarning, showEmptyWarning, toDelete])

  // Delete Card dialog: Esc = keep, Q = confirm delete
  useEffect(() => {
    if (!toDelete) return
    const handler = (e) => {
      if (e.key === 'Escape') {
        e.stopPropagation()
        setToDelete(null)
      }
      if (e.key === 'q' || e.key === 'Q') {
        e.stopPropagation()
        confirmDeleteCard()
      }
    }
    window.addEventListener('keydown', handler, true)
    return () => window.removeEventListener('keydown', handler, true)
  }, [toDelete])

  // Incomplete Cards dialog: Esc = close
  useEffect(() => {
    if (!showEmptyWarning) return
    const handler = (e) => {
      if (e.key === 'Escape') {
        e.stopPropagation()
        setShowEmptyWarning(false)
      }
    }
    window.addEventListener('keydown', handler, true)
    return () => window.removeEventListener('keydown', handler, true)
  }, [showEmptyWarning])

  // Leave Page dialog: Esc = stay, Q = leave
  useEffect(() => {
    if (!showLeaveWarning) return
    const handler = (e) => {
      if (e.key === 'Escape') {
        e.stopPropagation()
        setShowLeaveWarning(false)
      }
      if (e.key === 'q' || e.key === 'Q') {
        e.stopPropagation()
        navigate(`/classes/${classId}`)
      }
    }
    window.addEventListener('keydown', handler, true)
    return () => window.removeEventListener('keydown', handler, true)
  }, [showLeaveWarning])

  return (
    <PageWrapper className="max-w-6xl">

      {/* Back */}
      <Button
        variant="ghost" size="sm"
        className="mb-4 -ml-2"
        onClick={() => setShowLeaveWarning(true)}
      >
        <ArrowLeft className="h-4 w-4 mr-1" />{cls?.name ?? 'Back'}
        <kbd className="ml-2 text-[10px] bg-muted px-1.5 py-0.5 rounded opacity-60">Esc</kbd>
      </Button>

      <div className="mb-6">
        <h1 className="text-3xl font-extrabold text-foreground mb-1">Create New Deck</h1>
        <p className="text-muted-foreground">
          Adding to <span className="text-primary font-medium">{cls?.name ?? 'class'}</span>
        </p>
      </div>

      {error && (
        <div className="mb-6 bg-destructive/10 text-destructive text-sm px-4 py-3 rounded-md">{error}</div>
      )}

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid lg:grid-cols-5 gap-6">

          {/* ── Left: Deck info ── */}
          <div className="lg:col-span-2 flex flex-col gap-5">
            <Card>
              <CardContent className="p-5 flex flex-col gap-4">
                <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  Deck Info
                </h2>

                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium">Title</label>
                  <Input {...register('title')} placeholder="e.g. Week 1 — Introduction" />
                  {errors.title && <p className="text-destructive text-xs">{errors.title.message}</p>}
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium">
                    Description{' '}
                    <span className="text-muted-foreground font-normal text-xs">(optional)</span>
                  </label>
                  <textarea
                    {...register('description')}
                    placeholder="What does this deck cover?"
                    rows={3}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring placeholder:text-muted-foreground"
                  />
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-border">
                  <div>
                    <p className="text-sm font-medium">Make Public</p>
                    <p className="text-xs text-muted-foreground">Share with the community</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => { setIsPublic((v) => !v); setValue('isPublic', !isPublic) }}
                    className={cn(
                      'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
                      isPublic ? 'bg-primary' : 'bg-muted-foreground/30'
                    )}
                  >
                    <span className={cn(
                      'inline-block h-4 w-4 transform rounded-full bg-white shadow-md transition-transform',
                      isPublic ? 'translate-x-6' : 'translate-x-1'
                    )} />
                  </button>
                </div>
              </CardContent>
            </Card>

            {/* Summary */}
            <Card>
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    Summary
                  </h2>
                  <Badge variant="secondary">{cards.length} cards</Badge>
                </div>
                <div className="flex flex-col gap-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Ready</span>
                    <span className={cn('font-semibold', validCardCount > 0 ? 'text-green-400' : 'text-muted-foreground')}>
                      {validCardCount} cards
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Incomplete</span>
                    <span className={cn('font-semibold', incompleteCards.length > 0 ? 'text-orange-400' : 'text-muted-foreground')}>
                      {incompleteCards.length} cards
                    </span>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-3">
                  All cards must have both front and back filled before submitting.
                </p>

                {/* Keyboard hints */}
                <div className="flex flex-col gap-1.5 border-t border-border pt-3 mt-3 text-xs text-muted-foreground">
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
                    <span>Create deck</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <kbd className="px-1.5 py-0.5 bg-muted rounded">Esc</kbd>
                    <span>Back to class</span>
                  </span>
                </div>
              </CardContent>
            </Card>

            <Button type="submit" size="lg" disabled={isLoading}>
              {isLoading ? 'Creating...' : `Create Deck (${cards.length} cards)`}
              <kbd className="ml-2 text-[10px] bg-white/20 px-1.5 py-0.5 rounded opacity-70">Ctrl+S</kbd>
            </Button>
          </div>

          {/* ── Right: Card editor ── */}
          <div className="lg:col-span-3 flex flex-col gap-4">

            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-foreground">
                Cards
                <Badge variant="secondary" className="ml-2">{cards.length}</Badge>
              </h2>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground hidden sm:block">
                  <kbd className="px-1.5 py-0.5 bg-muted rounded text-[10px]">Tab</kbd> on back = new card
                </span>
                <Button type="button" variant="outline" size="sm" onClick={addCard}>
                  <Plus className="h-4 w-4 mr-1" />Add Card
                </Button>
              </div>
            </div>

            {/* Card tabs */}
            <div className="flex gap-1.5 flex-wrap">
              {cards.map((card, i) => {
                const filled = card.front.trim() && card.back.trim()
                return (
                  <button
                    key={card.id}
                    type="button"
                    onClick={() => setActiveCard(i)}
                    className={cn(
                      'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all border',
                      activeCard === i
                        ? 'bg-primary text-primary-foreground border-primary'
                        : filled
                        ? 'bg-green-500/10 text-green-400 border-green-500/20 hover:bg-green-500/20'
                        : 'bg-orange-500/10 text-orange-400 border-orange-500/20 hover:bg-orange-500/20'
                    )}
                  >
                    <span>{i + 1}</span>
                    {filled
                      ? <span className="text-[10px]">✓</span>
                      : <span className="text-[10px]">!</span>
                    }
                  </button>
                )
              })}
            </div>

            {/* Active card editor */}
            {currentCard && (
              <Card className={cn(
                'border-2 transition-colors',
                currentCard.front.trim() && currentCard.back.trim()
                  ? 'border-green-500/30'
                  : 'border-orange-500/30'
              )}>
                <CardContent className="p-5 flex flex-col gap-5">

                  {/* Card header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={cn(
                        'h-6 w-6 rounded-md flex items-center justify-center text-xs font-bold text-white',
                        currentCard.front.trim() && currentCard.back.trim()
                          ? 'bg-green-500'
                          : 'bg-orange-500'
                      )}>
                        {activeCard + 1}
                      </div>
                      <span className="text-sm font-semibold text-foreground">Card {activeCard + 1}</span>
                      {(!currentCard.front.trim() || !currentCard.back.trim()) && (
                        <span className="text-[10px] bg-orange-500/10 text-orange-400 px-2 py-0.5 rounded-full font-semibold">
                          Incomplete
                        </span>
                      )}
                    </div>
                    {cards.length > 1 && (
                      <button
                        type="button"
                        onClick={() => setToDelete({ id: currentCard.id, index: activeCard })}
                        className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-destructive transition-colors"
                      >
                        <Trash2 className="h-3.5 w-3.5" />Remove
                        <kbd className="text-[10px] bg-muted px-1.5 py-0.5 rounded opacity-60">Del</kbd>
                      </button>
                    )}
                  </div>

                  {/* Front */}
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-primary bg-primary/10 px-2 py-0.5 rounded">
                        Front
                      </span>
                      <span className="text-xs text-muted-foreground">Term or question</span>
                    </div>
                    <Input
                      value={currentCard.front}
                      onChange={(e) => updateCard(currentCard.id, 'front', e.target.value)}
                      placeholder="e.g. What is a stack?"
                    />
                    <ImageUploadButton
                      image={currentCard.frontImage}
                      onUpload={(img) => updateCard(currentCard.id, 'frontImage', img)}
                      onRemove={() => updateCard(currentCard.id, 'frontImage', null)}
                    />
                  </div>

                  {/* Flip divider */}
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-px bg-border" />
                    <span className="text-xs text-muted-foreground font-medium">flip</span>
                    <div className="flex-1 h-px bg-border" />
                  </div>

                  {/* Back */}
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded">
                        Back
                      </span>
                      <span className="text-xs text-muted-foreground">Answer or definition</span>
                    </div>
                    <textarea
                      ref={backRef}
                      value={currentCard.back}
                      onChange={(e) => updateCard(currentCard.id, 'back', e.target.value)}
                      onKeyDown={handleBackKeyDown}
                      placeholder="e.g. A LIFO data structure..."
                      rows={3}
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring placeholder:text-muted-foreground"
                    />
                    <p className="text-[10px] text-muted-foreground">
                      Press <kbd className="px-1 py-0.5 bg-muted rounded">Tab</kbd> to add next card
                    </p>
                    <ImageUploadButton
                      image={currentCard.backImage}
                      onUpload={(img) => updateCard(currentCard.id, 'backImage', img)}
                      onRemove={() => updateCard(currentCard.id, 'backImage', null)}
                    />
                  </div>

                  {/* Navigation */}
                  <div className="flex items-center justify-between pt-2 border-t border-border">
                    <Button
                      type="button" variant="ghost" size="sm"
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
                        type="button" variant="ghost" size="sm"
                        onClick={() => setActiveCard((v) => v + 1)}
                      >
                        Next →
                      </Button>
                    ) : (
                      <Button
                        type="button" variant="ghost" size="sm"
                        onClick={addCard}
                      >
                        <Plus className="h-3.5 w-3.5 mr-1" />New Card
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Empty state */}
            {cards.length === 0 && (
              <div className="text-center py-16 border border-dashed border-border rounded-xl text-muted-foreground">
                <BookOpen className="h-10 w-10 mx-auto mb-3 opacity-30" />
                <p className="text-sm mb-3">No cards yet.</p>
                <Button type="button" size="sm" onClick={addCard}>
                  <Plus className="h-3.5 w-3.5 mr-1" />Add First Card
                </Button>
              </div>
            )}
          </div>
        </div>
      </form>

      {/* ── Delete Card Warning Dialog ── */}
      <Dialog open={!!toDelete} onOpenChange={() => setToDelete(null)}>
        <DialogContent className="max-w-sm p-0 overflow-hidden">
          <div className="bg-destructive/10 border-b border-destructive/20 px-6 py-5">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-destructive/15 rounded-xl">
                <AlertTriangle className="h-5 w-5 text-destructive" />
              </div>
              <div>
                <DialogTitle className="text-base font-bold text-destructive">Remove Card?</DialogTitle>
                <p className="text-xs text-destructive/70 mt-0.5">This cannot be undone</p>
              </div>
            </div>
          </div>
          <div className="px-6 py-5">
            <p className="text-sm text-muted-foreground mb-4">
              You are about to remove{' '}
              <span className="font-semibold text-foreground">
                Card {toDelete ? toDelete.index + 1 : ''}
              </span>.
            </p>
            {toDelete && cards.find((c) => c.id === toDelete.id) && (
              <div className="rounded-xl border border-border overflow-hidden text-sm">
                <div className="px-4 py-3 border-b border-border bg-muted/30">
                  <p className="text-[10px] font-bold uppercase tracking-wide text-primary mb-1">Front</p>
                  <p className="text-foreground font-medium">
                    {cards.find((c) => c.id === toDelete.id)?.front ||
                      <span className="text-muted-foreground italic">Empty</span>
                    }
                  </p>
                </div>
                <div className="px-4 py-3">
                  <p className="text-[10px] font-bold uppercase tracking-wide text-purple-400 mb-1">Back</p>
                  <p className="text-muted-foreground">
                    {cards.find((c) => c.id === toDelete.id)?.back ||
                      <span className="italic">Empty</span>
                    }
                  </p>
                </div>
              </div>
            )}
          </div>
          <div className="px-6 py-4 border-t border-border flex justify-end gap-2 bg-muted/20">
            <Button variant="outline" onClick={() => setToDelete(null)}>
              Keep Card
              <kbd className="ml-2 text-[10px] bg-muted px-1.5 py-0.5 rounded opacity-70">Esc</kbd>
            </Button>
            <Button variant="destructive" onClick={confirmDeleteCard}>
              <Trash2 className="h-4 w-4 mr-1.5" />Remove Card
              <kbd className="ml-2 text-[10px] bg-white/20 px-1.5 py-0.5 rounded opacity-70">Q</kbd>
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
                <DialogTitle className="text-base font-bold text-orange-500">Incomplete Cards</DialogTitle>
                <p className="text-xs text-orange-500/70 mt-0.5">Fill in all cards before creating</p>
              </div>
            </div>
          </div>
          <div className="px-6 py-5">
            <p className="text-sm text-muted-foreground mb-4">
              You have{' '}
              <span className="font-semibold text-foreground">
                {incompleteCards.length} incomplete card{incompleteCards.length !== 1 ? 's' : ''}
              </span>{' '}
              with missing front or back content.
            </p>
            <div className="flex flex-col gap-2">
              {cards.map((card, i) => {
                const missingFront = !card.front.trim()
                const missingBack  = !card.back.trim()
                if (!missingFront && !missingBack) return null
                return (
                  <div
                    key={card.id}
                    className="flex items-center justify-between px-3 py-2.5 bg-muted/40 rounded-lg border border-border cursor-pointer hover:border-orange-500/50 transition-colors"
                    onClick={() => { setActiveCard(i); setShowEmptyWarning(false) }}
                  >
                    <div className="flex items-center gap-2">
                      <span className="h-5 w-5 rounded bg-orange-500/20 text-orange-400 text-[10px] font-bold flex items-center justify-center">
                        {i + 1}
                      </span>
                      <span className="text-sm text-foreground font-medium">Card {i + 1}</span>
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
                )
              })}
            </div>
            <p className="text-xs text-muted-foreground mt-3">Click a card above to jump to it.</p>
          </div>
          <div className="px-6 py-4 border-t border-border flex justify-end bg-muted/20">
            <Button onClick={() => setShowEmptyWarning(false)}>
              Go Back &amp; Fix
              <kbd className="ml-2 text-[10px] bg-white/20 px-1.5 py-0.5 rounded opacity-70">Esc</kbd>
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
                <DialogTitle className="text-base font-bold text-destructive">Leave Page?</DialogTitle>
                <p className="text-xs text-destructive/70 mt-0.5">Your unsaved deck will be lost</p>
              </div>
            </div>
          </div>
          <div className="px-6 py-5">
            <p className="text-sm text-muted-foreground">
              You have{' '}
              <span className="font-semibold text-foreground">
                {cards.length} card{cards.length !== 1 ? 's' : ''}
              </span>{' '}
              that haven't been saved yet. Are you sure you want to leave?
            </p>
          </div>
          <div className="px-6 py-4 border-t border-border flex justify-end gap-2 bg-muted/20">
            <Button variant="outline" onClick={() => setShowLeaveWarning(false)}>
              Stay &amp; Keep Editing
              <kbd className="ml-2 text-[10px] bg-muted px-1.5 py-0.5 rounded opacity-70">Esc</kbd>
            </Button>
            <Button variant="destructive" onClick={() => navigate(`/classes/${classId}`)}>
              Leave Without Saving
              <kbd className="ml-2 text-[10px] bg-white/20 px-1.5 py-0.5 rounded opacity-70">Q</kbd>
            </Button>
          </div>
        </DialogContent>
      </Dialog>

    </PageWrapper>
  )
}