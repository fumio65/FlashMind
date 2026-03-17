import { useState }        from 'react'
import { useAdminUsers }   from '@/features/admin'
import { AdminSidebar }    from '@/components/layout/AdminSidebar'
import { LoadingSpinner }  from '@/components/shared/LoadingSpinner'
import { Input }           from '@/components/ui/input'
import { Button }          from '@/components/ui/button'
import { Badge }           from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { useDebounce }     from '@/hooks/useDebounce'
import { Search, Ban, UserX } from 'lucide-react'
import { cn }              from '@/lib/utils'

const ROLE_FILTERS   = ['all', 'student', 'admin']
const STATUS_FILTERS = ['all', 'suspended']

const ROLE_COLORS = {
  admin:   'bg-red-100 text-red-700',
  student: 'bg-blue-100 text-blue-700',
}

export default function AdminUsersPage() {
  const [query, setQuery]   = useState('')
  const [role, setRole]     = useState('all')
  const [status, setStatus] = useState('all')
  const [toBan, setToBan]   = useState(null)

  const debouncedQuery      = useDebounce(query, 300)
  const { users, isLoading, toggleSuspend, removeUser } = useAdminUsers({
    role:   role === 'all' ? '' : role,
    status: status === 'suspended' ? 'suspended' : '',
    q:      debouncedQuery,
  })

  const confirmBan = async () => {
    if (!toBan) return
    await removeUser(toBan._id)
    setToBan(null)
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

        {/* Role filter tabs */}
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

        {/* Status filter tabs */}
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
              {f === 'all' ? 'All Status' : 'Suspended Only'}
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
                      user.status === 'suspended' && 'bg-orange-50/50'
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
                      <Badge
                        variant={user.status === 'suspended' ? 'destructive' : 'outline'}
                        className="text-xs capitalize"
                      >
                        {user.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground text-xs">
                      {new Date(user.createdAt).toLocaleDateString('en-PH', {
                        month: 'short', day: 'numeric', year: 'numeric'
                      })}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 justify-end">
                        {/* Suspend / Restore */}
                        {user.role !== 'admin' && (
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
                        )}
                        {/* Ban */}
                        {user.role !== 'admin' && (
                          <Button
                            size="sm" variant="ghost"
                            className="text-destructive hover:text-destructive hover:bg-destructive/10 text-xs"
                            onClick={() => setToBan(user)}
                          >
                            <UserX className="h-3.5 w-3.5 mr-1" />Ban
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

      {/* Confirm ban dialog */}
      <Dialog open={!!toBan} onOpenChange={() => setToBan(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ban User</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Are you sure you want to permanently ban{' '}
            <span className="font-semibold text-foreground">{toBan?.name}</span>{' '}
            (@{toBan?.username})? This will remove their account and cannot be undone.
          </p>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setToBan(null)}>Cancel</Button>
            <Button variant="destructive" onClick={confirmBan}>Ban User</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}