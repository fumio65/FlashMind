import { useAdminStats }     from '@/features/admin'
import { AdminSidebar }      from '@/components/layout/AdminSidebar'
import { LoadingSpinner }    from '@/components/shared/LoadingSpinner'
import { Card, CardContent } from '@/components/ui/card'
import { Badge }             from '@/components/ui/badge'
import { Users, BookOpen, Activity, Flag, LayoutDashboard } from 'lucide-react'
import { cn }                from '@/lib/utils'

export default function AdminDashboardPage() {
  const { stats, isLoading } = useAdminStats()

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />

      <main className="flex-1 p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-extrabold text-foreground">Admin Overview</h1>
          <p className="text-muted-foreground text-sm mt-1">Platform stats and recent activity.</p>
        </div>

        {isLoading ? <LoadingSpinner /> : (
          <>
            {/* Stats row */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {[
                { icon: Users,          label: 'Total Users',    value: stats?.totalUsers    ?? 0, color: 'text-blue-500'   },
                { icon: LayoutDashboard,label: 'Total Classes',  value: stats?.totalClasses  ?? 0, color: 'text-cyan-500'   },
                { icon: BookOpen,       label: 'Total Decks',    value: stats?.totalDecks    ?? 0, color: 'text-purple-500' },
                { icon: Activity,       label: 'Study Sessions', value: stats?.totalSessions ?? 0, color: 'text-green-500'  },
              ].map(({ icon: Icon, label, value, color }) => (
                <Card key={label}>
                  <CardContent className="p-5 flex items-center gap-4">
                    <div className="p-2.5 bg-muted rounded-lg">
                      <Icon className={cn('h-5 w-5', color)} />
                    </div>
                    <div>
                      <p className="text-2xl font-extrabold text-foreground">{value}</p>
                      <p className="text-xs text-muted-foreground">{label}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
              {/* Recent registrations */}
              <Card>
                <CardContent className="p-0">
                  <div className="px-6 py-4 border-b">
                    <h2 className="font-semibold text-foreground">Recent Registrations</h2>
                  </div>
                  {!stats?.recentUsers?.length ? (
                    <div className="px-6 py-10 text-center text-muted-foreground text-sm">
                      No users yet
                    </div>
                  ) : (
                    <table className="w-full text-sm">
                      <thead className="bg-muted/40">
                        <tr>
                          <th className="text-left px-6 py-2.5 text-muted-foreground font-medium">User</th>
                          <th className="text-left px-6 py-2.5 text-muted-foreground font-medium">Role</th>
                          <th className="text-left px-6 py-2.5 text-muted-foreground font-medium">Joined</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {stats.recentUsers.map((user) => (
                          <tr key={user._id} className="hover:bg-muted/20">
                            <td className="px-6 py-3">
                              <p className="font-medium text-foreground">{user.name}</p>
                              <p className="text-xs text-muted-foreground">@{user.username}</p>
                            </td>
                            <td className="px-6 py-3">
                              <Badge variant="outline" className="capitalize text-xs">{user.role}</Badge>
                            </td>
                            <td className="px-6 py-3 text-muted-foreground text-xs">
                              {new Date(user.createdAt).toLocaleDateString('en-PH', {
                                month: 'short', day: 'numeric', year: 'numeric'
                              })}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </CardContent>
              </Card>

              {/* Flagged content */}
              <Card>
                <CardContent className="p-0">
                  <div className="px-6 py-4 border-b flex items-center justify-between">
                    <h2 className="font-semibold text-foreground">Flagged Content</h2>
                    <Flag className="h-4 w-4 text-muted-foreground" />
                  </div>
                  {!stats?.flagged?.length ? (
                    <div className="px-6 py-10 text-center text-muted-foreground text-sm">
                      No flagged content 🎉
                    </div>
                  ) : (
                    <div className="divide-y">
                      {stats.flagged.map((deck) => (
                        <div key={deck._id} className="px-6 py-4 flex items-center justify-between">
                          <div>
                            <p className="font-medium text-foreground text-sm">{deck.title}</p>
                            <p className="text-xs text-muted-foreground">by @{deck.owner?.username}</p>
                          </div>
                          <Badge variant="destructive" className="text-xs">
                            {deck.reportCount} reports
                          </Badge>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </main>
    </div>
  )
}