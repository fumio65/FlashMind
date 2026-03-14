import { useState }        from 'react'
import { useAdminDecks }   from '@/features/admin'
import { AdminSidebar }    from '@/components/layout/AdminSidebar'
import { LoadingSpinner }  from '@/components/shared/LoadingSpinner'
import { Input }           from '@/components/ui/input'
import { Button }          from '@/components/ui/button'
import { Badge }           from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { useDebounce }     from '@/hooks/useDebounce'
import { Search, Trash2 }  from 'lucide-react'
import { cn }              from '@/lib/utils'

const FILTERS = ['all', 'public', 'private', 'reported']

export default function AdminDecksPage() {
  const [query, setQuery]       = useState('')
  const [status, setStatus]     = useState('all')
  const [toDelete, setToDelete] = useState(null)

  const debouncedQuery          = useDebounce(query, 300)
  const { decks, isLoading, removeDeck } = useAdminDecks({ status, q: debouncedQuery })

  const confirmDelete = async () => {
    if (!toDelete) return
    await removeDeck(toDelete._id)
    setToDelete(null)
  }

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />

      <main className="flex-1 p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-extrabold text-foreground">Deck Management</h1>
          <p className="text-muted-foreground text-sm mt-1">Review, moderate, and remove decks.</p>
        </div>

        {/* Search */}
        <div className="relative max-w-sm mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search decks..."
            className="pl-9"
          />
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setStatus(f)}
              className={cn(
                'px-4 py-1.5 rounded-full text-sm font-medium capitalize transition-colors border',
                status === f
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-background text-muted-foreground border-border hover:border-primary hover:text-primary'
              )}
            >
              {f}
            </button>
          ))}
        </div>

        {isLoading ? <LoadingSpinner /> : (
          <div className="rounded-lg border overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Title</th>
                  <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Category</th>
                  <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Owner</th>
                  <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Status</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y">
                {decks.map((deck) => {
                  const isReported = !!deck.reportCount
                  return (
                    <tr key={deck._id} className={cn('hover:bg-muted/20 transition-colors', isReported && 'bg-red-50/50')}>
                      <td className="px-4 py-3 font-medium text-foreground">{deck.title}</td>
                      <td className="px-4 py-3 text-muted-foreground">{deck.category}</td>
                      <td className="px-4 py-3 text-muted-foreground">@{deck.owner?.username}</td>
                      <td className="px-4 py-3">
                        {isReported
                          ? <Badge variant="destructive" className="text-xs">{deck.reportCount} reports</Badge>
                          : <Badge variant={deck.isPublic ? 'default' : 'secondary'} className="text-xs">
                              {deck.isPublic ? 'Public' : 'Private'}
                            </Badge>
                        }
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                          onClick={() => setToDelete(deck)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </main>

      {/* Confirm delete dialog */}
      <Dialog open={!!toDelete} onOpenChange={() => setToDelete(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remove Deck</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Are you sure you want to permanently remove{' '}
            <span className="font-semibold text-foreground">"{toDelete?.title}"</span>?
            This cannot be undone.
          </p>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setToDelete(null)}>Cancel</Button>
            <Button variant="destructive" onClick={confirmDelete}>Remove Deck</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}