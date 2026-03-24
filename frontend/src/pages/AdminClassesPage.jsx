import { useState, useEffect }  from 'react'
import { Link }                 from 'react-router-dom'
import { AdminSidebar }         from '@/components/layout/AdminSidebar'
import { LoadingSpinner }       from '@/components/shared/LoadingSpinner'
import { Input }                from '@/components/ui/input'
import { Button }               from '@/components/ui/button'
import { Badge }                from '@/components/ui/badge'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { useDebounce }          from '@/hooks/useDebounce'
import { ClassIcon }            from '@/features/classes/components/ClassIcon'
import { useAdminClasses }      from '@/features/admin'
import { Search, Trash2, ChevronRight, Globe, Lock, AlertTriangle } from 'lucide-react'
import { cn }                   from '@/lib/utils'

const STATUS_FILTERS = ['all', 'public', 'private']

export default function AdminClassesPage() {
  const [query, setQuery]       = useState('')
  const [status, setStatus]     = useState('all')
  const [toDelete, setToDelete] = useState(null)

  const debouncedQuery                      = useDebounce(query, 300)
  const { classes, isLoading, removeClass } = useAdminClasses({
    q:      debouncedQuery,
    status: status === 'all' ? '' : status,
  })

  const handleDelete = async () => {
    if (!toDelete) return
    await removeClass(toDelete._id)
    setToDelete(null)
  }

  // Delete dialog: Esc = cancel, Q = confirm
  useEffect(() => {
    if (!toDelete) return
    const handler = (e) => {
      if (e.key === 'Escape') { e.stopPropagation(); setToDelete(null) }
      if (e.key === 'q' || e.key === 'Q') { e.stopPropagation(); handleDelete() }
    }
    window.addEventListener('keydown', handler, true)
    return () => window.removeEventListener('keydown', handler, true)
  }, [toDelete])

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />

      <main className="flex-1 p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-extrabold text-foreground">Class Management</h1>
          <p className="text-muted-foreground text-sm mt-1">
            View, inspect, and remove classes. Showing all classes including private ones.
          </p>
        </div>

        {/* Search */}
        <div className="relative max-w-sm mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search classes..."
            className="pl-9"
          />
        </div>

        {/* Status filter */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {STATUS_FILTERS.map((f) => (
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
              {f === 'all' ? 'All' : f === 'public' ? 'Public' : 'Private'}
            </button>
          ))}
        </div>

        {isLoading ? <LoadingSpinner /> : (
          <>
            {classes.length === 0 ? (
              <div className="text-center py-20 text-muted-foreground border border-dashed border-border rounded-2xl">
                <p className="text-sm">No classes found.</p>
              </div>
            ) : (
              <div className="rounded-lg border overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Class</th>
                      <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Owner</th>
                      <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Decks</th>
                      <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Status</th>
                      <th className="px-4 py-3 text-right font-semibold text-muted-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {classes.map((cls) => (
                      <tr key={cls._id} className="hover:bg-muted/20 transition-colors">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className={cn('h-9 w-9 rounded-lg bg-gradient-to-br flex items-center justify-center shrink-0', cls.color)}>
                              <ClassIcon icon={cls.icon} size="sm" />
                            </div>
                            <div>
                              <p className="font-semibold text-foreground">{cls.name}</p>
                              <p className="text-xs text-muted-foreground line-clamp-1">{cls.description}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">
                          @{cls.owner?.username}
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">
                          {cls.deckCount ?? 0} deck{(cls.deckCount ?? 0) !== 1 ? 's' : ''}
                        </td>
                        <td className="px-4 py-3">
                          <Badge
                            variant={cls.isPublic ? 'default' : 'secondary'}
                            className="text-xs flex items-center gap-1 w-fit"
                          >
                            {cls.isPublic
                              ? <><Globe className="h-3 w-3" />Public</>
                              : <><Lock className="h-3 w-3" />Private</>
                            }
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center gap-1 justify-end">
                            <Button size="sm" variant="ghost" asChild>
                              <Link to={`/admin/classes/${cls._id}`}>
                                <ChevronRight className="h-4 w-4" />View
                              </Link>
                            </Button>
                            <Button
                              size="sm" variant="ghost"
                              className="text-destructive hover:text-destructive hover:bg-destructive/10"
                              onClick={() => setToDelete(cls)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </main>

      {/* ── Delete Class Dialog ── */}
      <Dialog open={!!toDelete} onOpenChange={() => setToDelete(null)}>
        <DialogContent className="max-w-sm p-0 overflow-hidden">
          <div className="bg-destructive/10 border-b border-destructive/20 px-6 py-5">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-destructive/15 rounded-xl">
                <AlertTriangle className="h-5 w-5 text-destructive" />
              </div>
              <div>
                <DialogTitle className="text-base font-bold text-destructive">Delete Class</DialogTitle>
                <p className="text-xs text-destructive/70 mt-0.5">This action cannot be undone</p>
              </div>
            </div>
          </div>
          <div className="px-6 py-5">
            <p className="text-sm text-muted-foreground mb-4">
              You are about to permanently delete:
            </p>
            <div className="flex items-center gap-3 p-3.5 bg-muted/40 rounded-xl border border-border">
              <div className={cn('h-9 w-9 rounded-lg bg-gradient-to-br flex items-center justify-center shrink-0', toDelete?.color)}>
                <ClassIcon icon={toDelete?.icon} size="sm" />
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-foreground text-sm truncate">{toDelete?.name}</p>
                <p className="text-xs text-muted-foreground">
                  {toDelete?.deckCount ?? 0} deck{(toDelete?.deckCount ?? 0) !== 1 ? 's' : ''} and all cards will be removed
                </p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-3">
              All decks and flashcards inside this class will be permanently deleted.
            </p>
          </div>
          <div className="px-6 py-4 border-t border-border flex justify-end gap-2 bg-muted/20">
            <Button variant="outline" onClick={() => setToDelete(null)}>
              Cancel
              <kbd className="ml-2 text-[10px] bg-muted px-1.5 py-0.5 rounded opacity-70">Esc</kbd>
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              <Trash2 className="h-4 w-4 mr-1.5" />Delete Class
              <kbd className="ml-2 text-[10px] bg-white/20 px-1.5 py-0.5 rounded opacity-70">Q</kbd>
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}