import { useState }       from 'react'
import { useAdminUsers }  from '@/features/admin'
import { AdminSidebar }   from '@/components/layout/AdminSidebar'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { Input }          from '@/components/ui/input'
import { Button }         from '@/components/ui/button'
import { Badge }          from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { useDebounce }    from '@/hooks/useDebounce'
import { Search, Ban, UserX, UserCheck } from 'lucide-react'
import { cn }             from '@/lib/utils'

const ROLE_FILTERS   = ['all', 'student', 'admin']
const STATUS_FILTERS = ['all', 'suspended', 'banned']

const ROLE_COLORS = {
  admin:   'bg-red-100 text-red-700',
  student: 'bg-blue-100 text-blue-700',
}

const STATUS_COLORS = {
  active:    'bg-green-500/10 text-green-400 border-green-500/20',
  suspended: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
  banned:    'bg-red-500/10 text-red-400 border-red-500/20',
}

export default function AdminUsersPage() {
  const [query, setQuery]     = useState('')
  const [role, setRole]       = useState('all')
  const [status, setStatus]   = useState('all')
  const [toAction, setToAction] = useState(null) // { type: 'ban'|'unban', user }

  const debouncedQuery        = useDebounce(query, 300)
  const { users, isLoading, toggleSuspend, removeUser, restoreUser } = useAdminUsers({
    role:   role === 'all' ? '' : role,
    status: status === 'all' ? '' : status,
    q:      debouncedQuery,
  })

  const confirmAction = async () => {
    if (!toAction) return
    if (toAction.type === 'ban')   await removeUser(toAction.user._id)
    if (toAction.type === 'unban') await restoreUser(toAction.user._id)
    setToAction(null)
  }

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />

      <main className="flex-1 p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-extrabold text-foreground">User Management</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage suspensions and bans.</p>
        </div>

        {/* Search */}
        <div className="relative max-w-sm mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search users..."
            className="pl-9"
          />
        </div>

        {/* Role filter */}
        <div className="flex gap-2 mb-3 flex-wrap">
          {ROLE_FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setRole(f)}
              className={cn(
                'px-4 py-1.5 rounded-full text-sm font-medium capitalize transition-colors border',
                role === f
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-background text-muted-foreground border-border hover:border-primary hover:text-primary'
              )}
            >
              {f}
            </button>
          ))}
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
                  ? 'bg-destructive text-destructive-foreground border-destructive'
                  : 'bg-background text-muted-foreground border-border hover:border-destructive hover:text-destructive'
              )}
            >
              {f === 'all' ? 'All Status' : f === 'suspended' ? 'Suspended' : 'Banned'}
            </button>
          ))}
        </div>

        {isLoading ? <LoadingSpinner /> : (
          <div className="rounded-lg border overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left px-4 py-3 font-semibold text-muted-foreground">User</th>
                  <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Role</th>
                  <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Status</th>
                  <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Joined</th>
                  <th className="px-4 py-3 text-right font-semibold text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {users.map((user) => (
                  <tr
                    key={user._id}
                    className={cn(
                      'hover:bg-muted/20 transition-colors',
                      user.status === 'suspended' && 'bg-orange-50/5',
                      user.status === 'banned'    && 'bg-red-50/5',
                    )}
                  >
                    <td className="px-4 py-3">
                      <p className="font-medium text-foreground">{user.name}</p>
                      <p className="text-xs text-muted-foreground">@{user.username} · {user.email}</p>
                    </td>

                    <td className="px-4 py-3">
                      <span className={cn(
                        'text-xs font-semibold px-2.5 py-1 rounded-full capitalize',
                        ROLE_COLORS[user.role] ?? 'bg-muted text-muted-foreground'
                      )}>
                        {user.role}
                      </span>
                    </td>

                    <td className="px-4 py-3">
                      <span className={cn(
                        'text-xs font-semibold px-2.5 py-1 rounded-full border capitalize',
                        STATUS_COLORS[user.status] ?? 'bg-muted text-muted-foreground'
                      )}>
                        {user.status}
                      </span>
                    </td>

                    <td className="px-4 py-3 text-muted-foreground text-xs">
                      {new Date(user.createdAt).toLocaleDateString('en-PH', {
                        month: 'short', day: 'numeric', year: 'numeric'
                      })}
                    </td>

                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 justify-end">
                        {user.role !== 'admin' && user.status !== 'banned' && (
                          <>
                            {/* Suspend / Restore */}
                            <Button
                              size="sm" variant="ghost"
                              className={cn(
                                'text-xs',
                                user.status === 'suspended'
                                  ? 'text-green-600 hover:text-green-700 hover:bg-green-50'
                                  : 'text-orange-500 hover:text-orange-600 hover:bg-orange-50'
                              )}
                              onClick={() => toggleSuspend(user._id)}
                            >
                              <Ban className="h-3.5 w-3.5 mr-1" />
                              {user.status === 'suspended' ? 'Restore' : 'Suspend'}
                            </Button>

                            {/* Ban */}
                            <Button
                              size="sm" variant="ghost"
                              className="text-destructive hover:text-destructive hover:bg-destructive/10 text-xs"
                              onClick={() => setToAction({ type: 'ban', user })}
                            >
                              <UserX className="h-3.5 w-3.5 mr-1" />Ban
                            </Button>
                          </>
                        )}

                        {/* Unban */}
                        {user.role !== 'admin' && user.status === 'banned' && (
                          <Button
                            size="sm" variant="ghost"
                            className="text-green-600 hover:text-green-700 hover:bg-green-50 text-xs"
                            onClick={() => setToAction({ type: 'unban', user })}
                          >
                            <UserCheck className="h-3.5 w-3.5 mr-1" />Unban
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>

      {/* ── Ban confirmation dialog ── */}
      <Dialog open={toAction?.type === 'ban'} onOpenChange={() => setToAction(null)}>
        <DialogContent className="max-w-sm p-0 overflow-hidden">
          <div className="bg-destructive/10 border-b border-destructive/20 px-6 py-5">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-destructive/15 rounded-xl">
                <UserX className="h-5 w-5 text-destructive" />
              </div>
              <div>
                <DialogTitle className="text-base font-bold text-destructive">Ban User</DialogTitle>
                <p className="text-xs text-destructive/70 mt-0.5">This will restrict their access</p>
              </div>
            </div>
          </div>
          <div className="px-6 py-5">
            <p className="text-sm text-muted-foreground mb-4">
              Are you sure you want to ban{' '}
              <span className="font-semibold text-foreground">{toAction?.user?.name}</span>{' '}
              (@{toAction?.user?.username})?
            </p>
            <div className="flex items-center gap-3 p-3 bg-muted/40 rounded-lg border border-border text-xs text-muted-foreground">
              <UserX className="h-4 w-4 shrink-0 text-destructive" />
              <p>They will lose access to FlashMind. You can unban them later.</p>
            </div>
          </div>
          <div className="px-6 py-4 border-t border-border flex justify-end gap-2 bg-muted/20">
            <Button variant="outline" onClick={() => setToAction(null)}>Cancel</Button>
            <Button variant="destructive" onClick={confirmAction}>
              <UserX className="h-4 w-4 mr-1.5" />Ban User
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* ── Unban confirmation dialog ── */}
      <Dialog open={toAction?.type === 'unban'} onOpenChange={() => setToAction(null)}>
        <DialogContent className="max-w-sm p-0 overflow-hidden">
          <div className="bg-green-500/10 border-b border-green-500/20 px-6 py-5">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-500/15 rounded-xl">
                <UserCheck className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <DialogTitle className="text-base font-bold text-green-500">Unban User</DialogTitle>
                <p className="text-xs text-green-500/70 mt-0.5">Restore their access to FlashMind</p>
              </div>
            </div>
          </div>
          <div className="px-6 py-5">
            <p className="text-sm text-muted-foreground mb-4">
              Are you sure you want to unban{' '}
              <span className="font-semibold text-foreground">{toAction?.user?.name}</span>{' '}
              (@{toAction?.user?.username})?
            </p>
            <div className="flex items-center gap-3 p-3 bg-muted/40 rounded-lg border border-border text-xs text-muted-foreground">
              <UserCheck className="h-4 w-4 shrink-0 text-green-500" />
              <p>They will regain full access to FlashMind as a student.</p>
            </div>
          </div>
          <div className="px-6 py-4 border-t border-border flex justify-end gap-2 bg-muted/20">
            <Button variant="outline" onClick={() => setToAction(null)}>Cancel</Button>
            <Button
              className="bg-green-600 hover:bg-green-700 text-white"
              onClick={confirmAction}
            >
              <UserCheck className="h-4 w-4 mr-1.5" />Unban User
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}