import { useState }       from 'react'
import { useParams, Link } from 'react-router-dom'
import { AdminSidebar }   from '@/components/layout/AdminSidebar'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { Button }         from '@/components/ui/button'
import { Badge }          from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { ClassIcon }      from '@/features/classes/components/ClassIcon'
import { useClass }       from '@/features/classes'
import {
  ArrowLeft, BookOpen, Trash2,
  Globe, Lock, User, ChevronDown, ChevronUp,
} from 'lucide-react'
import { cn } from '@/lib/utils'

export default function AdminClassDetailPage() {
  const { id }                           = useParams()
  const { cls, decks, isLoading, error } = useClass(id)
  const [expandedDeck, setExpandedDeck]  = useState(null)
  const [toDelete, setToDelete]          = useState(null) // { type: 'deck'|'card', item }

  if (isLoading) return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />
      <main className="flex-1 p-8"><LoadingSpinner /></main>
    </div>
  )

  if (error || !cls) return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />
      <main className="flex-1 p-8">
        <p className="text-muted-foreground">Class not found.</p>
        <Button variant="link" asChild><Link to="/admin/classes">Back</Link></Button>
      </main>
    </div>
  )

  const handleDelete = () => {
    // Phase B: call real API
    setToDelete(null)
  }

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />

      <main className="flex-1 p-8">
        {/* Back */}
        <Button variant="ghost" size="sm" asChild className="mb-6 -ml-2">
          <Link to="/admin/classes">
            <ArrowLeft className="h-4 w-4 mr-1" />Back to Classes
          </Link>
        </Button>

        {/* Class hero */}
        <div className={cn('rounded-2xl h-36 mb-8 flex items-center px-8 gap-6 bg-gradient-to-br', cls.color)}>
          <ClassIcon icon={cls.icon} size="xl" />
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <h1 className="text-2xl font-extrabold text-white">{cls.name}</h1>
              <Badge
                variant="outline"
                className="border-white/30 text-white text-xs"
              >
                {cls.isPublic
                  ? <><Globe className="h-3 w-3 mr-1" />Public</>
                  : <><Lock className="h-3 w-3 mr-1" />Private</>
                }
              </Badge>
            </div>
            <p className="text-white/75 text-sm">{cls.description}</p>
            <p className="text-white/60 text-xs mt-2 flex items-center gap-1">
              <User className="h-3 w-3" />@{cls.owner?.username}
              <span className="mx-1">·</span>
              <BookOpen className="h-3 w-3" />{decks.length} deck{decks.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>

        {/* Decks list */}
        <h2 className="text-lg font-semibold text-foreground mb-4">
          Decks in this class
        </h2>

        {decks.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground border border-dashed border-border rounded-xl">
            <BookOpen className="h-10 w-10 mx-auto mb-3 opacity-30" />
            <p className="text-sm">No decks in this class.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {decks.map((deck) => {
              const isExpanded = expandedDeck === deck._id
              return (
                <div key={deck._id} className="rounded-xl border border-border overflow-hidden">
                  {/* Deck header */}
                  <div className="flex items-center justify-between px-5 py-4 bg-card hover:bg-muted/20 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <BookOpen className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">{deck.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {deck.cards.length} card{deck.cards.length !== 1 ? 's' : ''}
                          {deck.description && ` · ${deck.description}`}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm" variant="ghost"
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={() => setToDelete({ type: 'deck', item: deck })}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm" variant="ghost"
                        onClick={() => setExpandedDeck(isExpanded ? null : deck._id)}
                      >
                        {isExpanded
                          ? <ChevronUp className="h-4 w-4" />
                          : <ChevronDown className="h-4 w-4" />
                        }
                        {isExpanded ? 'Hide' : 'View'} Cards
                      </Button>
                    </div>
                  </div>

                  {/* Cards table */}
                  {isExpanded && (
                    <div className="border-t border-border">
                      <table className="w-full text-sm">
                        <thead className="bg-muted/40">
                          <tr>
                            <th className="text-left px-5 py-2.5 font-semibold text-muted-foreground w-8">#</th>
                            <th className="text-left px-5 py-2.5 font-semibold text-muted-foreground">Front</th>
                            <th className="text-left px-5 py-2.5 font-semibold text-muted-foreground">Back</th>
                            <th className="px-5 py-2.5 w-12" />
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                          {deck.cards.map((card, i) => (
                            <tr key={card._id} className="hover:bg-muted/10 transition-colors">
                              <td className="px-5 py-3 text-xs text-muted-foreground font-mono">{i + 1}</td>
                              <td className="px-5 py-3 text-foreground font-medium">{card.front}</td>
                              <td className="px-5 py-3 text-muted-foreground">{card.back}</td>
                              <td className="px-5 py-3 text-right">
                                <Button
                                  size="sm" variant="ghost"
                                  className="text-destructive hover:text-destructive hover:bg-destructive/10 h-7 w-7 p-0"
                                  onClick={() => setToDelete({ type: 'card', item: card, deck })}
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </main>

      {/* Delete confirmation dialog */}
      <Dialog open={!!toDelete} onOpenChange={() => setToDelete(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>
              {toDelete?.type === 'deck' ? 'Delete Deck' : 'Delete Card'}
            </DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            {toDelete?.type === 'deck' ? (
              <>
                Are you sure you want to permanently delete the deck{' '}
                <span className="font-semibold text-foreground">"{toDelete?.item?.title}"</span>?
                All {toDelete?.item?.cards?.length} cards inside will also be removed.
              </>
            ) : (
              <>
                Are you sure you want to delete the card{' '}
                <span className="font-semibold text-foreground">"{toDelete?.item?.front}"</span>{' '}
                from <span className="font-semibold text-foreground">"{toDelete?.deck?.title}"</span>?
              </>
            )}
            {' '}This cannot be undone.
          </p>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setToDelete(null)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete {toDelete?.type === 'deck' ? 'Deck' : 'Card'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}