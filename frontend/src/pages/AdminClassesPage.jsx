import { useState }       from 'react'
import { Link }           from 'react-router-dom'
import { AdminSidebar }   from '@/components/layout/AdminSidebar'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { Input }          from '@/components/ui/input'
import { Button }         from '@/components/ui/button'
import { Badge }          from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { useDebounce }    from '@/hooks/useDebounce'
import { ClassIcon }      from '@/features/classes/components/ClassIcon'
import { useClasses }     from '@/features/classes'
import { Search, Trash2, ChevronRight, Globe, Lock } from 'lucide-react'
import { cn }             from '@/lib/utils'

const STATUS_FILTERS = ['all', 'public', 'private']

export default function AdminClassesPage() {
  const [query, setQuery]       = useState('')
  const [status, setStatus]     = useState('all')
  const [toDelete, setToDelete] = useState(null)

  const debouncedQuery          = useDebounce(query, 300)
  const { classes, isLoading }  = useClasses({ q: debouncedQuery })

  const filtered = classes.filter((c) => {
    if (status === 'public')  return c.isPublic
    if (status === 'private') return !c.isPublic
    return true
  })

  const handleDelete = () => {
    // Phase B: call real API
    setToDelete(null)
  }

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />

      <main className="flex-1 p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-extrabold text-foreground">Class Management</h1>
          <p className="text-muted-foreground text-sm mt-1">View, inspect, and remove classes.</p>
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
                {filtered.map((cls) => (
                  <tr key={cls._id} className="hover:bg-muted/20 transition-colors group">
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
                      {cls.deckCount} deck{cls.deckCount !== 1 ? 's' : ''}
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={cls.isPublic ? 'default' : 'secondary'} className="text-xs">
                        {cls.isPublic
                          ? <><Globe className="h-3 w-3 mr-1" />Public</>
                          : <><Lock className="h-3 w-3 mr-1" />Private</>
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
      </main>

      {/* Delete dialog */}
      <Dialog open={!!toDelete} onOpenChange={() => setToDelete(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete Class</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Are you sure you want to permanently delete{' '}
            <span className="font-semibold text-foreground">"{toDelete?.name}"</span>?
            All decks and cards inside will also be removed. This cannot be undone.
          </p>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setToDelete(null)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete}>Delete Class</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}