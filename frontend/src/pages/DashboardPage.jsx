import { Link }            from 'react-router-dom'
import { useAuthStore }    from '@/features/auth/store/authStore'
import { useDashboard }    from '@/features/dashboard'
import { ActivityChart }   from '@/features/dashboard'
import { ClassCard }       from '@/features/classes/components/ClassCard'
import { PageWrapper }     from '@/components/layout/PageWrapper'
import { LoadingSpinner }  from '@/components/shared/LoadingSpinner'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button }          from '@/components/ui/button'
import { Progress }        from '@/components/ui/progress'
import { Plus, BookOpen, Trophy, Clock, Flame } from 'lucide-react'

export default function DashboardPage() {
  const user               = useAuthStore((s) => s.user)
  const { stats, isLoading } = useDashboard()

  if (isLoading) return <PageWrapper><LoadingSpinner /></PageWrapper>

  const mastery = stats?.cardsMastered
    ? Math.round((stats.cardsMastered / 30) * 100)
    : 0

  return (
    <PageWrapper>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-foreground">
            Welcome back, {user?.name?.split(' ')[0]} 👋
          </h1>
          <p className="text-muted-foreground mt-1">Ready to study? Here's your progress.</p>
        </div>
        <Button asChild>
          <Link to="/classes/new"><Plus className="h-4 w-4 mr-2" />New Class</Link>
        </Button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { icon: Flame,    label: 'Study Streak',   value: `${stats?.studyStreak ?? 0} days`,  color: 'text-orange-500' },
          { icon: Trophy,   label: 'Cards Mastered', value: stats?.cardsMastered ?? 0,           color: 'text-yellow-500' },
          { icon: BookOpen, label: 'Total Sessions', value: stats?.totalSessions ?? 0,           color: 'text-blue-500'   },
          { icon: Clock,    label: 'Mastery',        value: `${mastery}%`,                       color: 'text-green-500'  },
        ].map(({ icon: Icon, label, value, color }) => (
          <Card key={label}>
            <CardContent className="p-5 flex items-center gap-4">
              <div className="p-2.5 rounded-lg bg-muted">
                <Icon className={`h-5 w-5 ${color}`} />
              </div>
              <div>
                <p className="text-2xl font-extrabold text-foreground">{value}</p>
                <p className="text-xs text-muted-foreground">{label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        {/* Activity chart */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Weekly Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <ActivityChart data={stats?.weeklyActivity ?? []} />
          </CardContent>
        </Card>

        {/* Mastery */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Overall Mastery</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="text-center py-4">
              <p className="text-5xl font-extrabold text-primary">{mastery}%</p>
              <p className="text-sm text-muted-foreground mt-1">of cards mastered</p>
            </div>
            <Progress value={mastery} className="h-2" />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{stats?.cardsMastered ?? 0} known</span>
              <span>30 total</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Classes */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground">My Classes</h2>
          <Button variant="ghost" size="sm" asChild>
            <Link to="/browse">Browse all →</Link>
          </Button>
        </div>
        {stats?.recentClasses?.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground border border-dashed border-border rounded-2xl">
            <BookOpen className="h-10 w-10 mx-auto mb-3 opacity-30" />
            <p className="mb-3 text-sm">No classes yet.</p>
            <Button asChild size="sm">
              <Link to="/classes/new"><Plus className="h-3.5 w-3.5 mr-1" />Create your first class</Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {stats?.recentClasses?.map((cls) => (
              <ClassCard key={cls._id} cls={cls} />
            ))}
          </div>
        )}
      </div>
    </PageWrapper>
  )
}