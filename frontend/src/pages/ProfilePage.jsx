import { useState } from 'react'
import { useProfile }     from '@/features/profile'
import { PageWrapper }    from '@/components/layout/PageWrapper'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge }          from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Button }         from '@/components/ui/button'
import { Progress }       from '@/components/ui/progress'
import { Link }           from 'react-router-dom'
import {
  Flame, Trophy, BookOpen, Clock,
  Play, Camera, Plus, ArrowRight,
  CheckCircle2, Timer,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const ROLE_COLORS = {
  admin:   'bg-red-500/15 text-red-400 border-red-500/20',
  creator: 'bg-purple-500/15 text-purple-400 border-purple-500/20',
  student: 'bg-primary/15 text-primary border-primary/20',
}

export default function ProfilePage() {
  const { data, isLoading } = useProfile()
  const [tab, setTab]       = useState('decks')

  if (isLoading) return <PageWrapper><LoadingSpinner /></PageWrapper>

  const { user, myDecks, mySessions } = data
  const masteryPct = Math.round((18 / 30) * 100)

  return (
    <PageWrapper className="max-w-6xl">

      {/* ── Hero banner ── */}
      <div className="relative rounded-2xl overflow-hidden mb-6">
        <div className="h-36 bg-gradient-to-br from-primary via-primary/80 to-cyan-400" />
        <div className="bg-card border border-border rounded-b-2xl px-6 pb-6">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div className="flex items-end gap-5 -mt-10">
              <div className="relative shrink-0">
                <Avatar className="h-20 w-20 border-4 border-card shadow-xl">
                  <AvatarImage src={user?.avatar} />
                  <AvatarFallback className="text-2xl font-bold bg-primary/20 text-primary">
                    {user?.name?.[0]?.toUpperCase() ?? 'U'}
                  </AvatarFallback>
                </Avatar>
                <button className="absolute bottom-0 right-0 bg-primary text-primary-foreground rounded-full p-1.5 shadow-lg hover:bg-primary/90 transition-colors">
                  <Camera className="h-3 w-3" />
                </button>
              </div>
              <div className="pb-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-xl font-extrabold text-foreground">{user?.name}</h1>
                  <span className={cn(
                    'text-xs font-semibold px-2.5 py-0.5 rounded-full border capitalize',
                    ROLE_COLORS[user?.role] ?? 'bg-muted text-muted-foreground'
                  )}>
                    {user?.role}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">@{user?.username} · {user?.email}</p>
              </div>
            </div>
            <div className="flex gap-2 pb-1">
              <Button variant="outline" size="sm">Edit Profile</Button>
              <Button size="sm" asChild>
                <Link to="/decks/new"><Plus className="h-3.5 w-3.5 mr-1" />New Deck</Link>
              </Button>
            </div>
          </div>
          <div className="flex items-center gap-3 mt-4 flex-wrap">
            <div className="flex items-center gap-1.5 bg-orange-500/10 text-orange-400 border border-orange-500/20 px-3 py-1.5 rounded-full text-sm font-semibold">
              <Flame className="h-3.5 w-3.5" />{user?.studyStreak} day streak
            </div>
            <div className="flex items-center gap-1.5 bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 px-3 py-1.5 rounded-full text-sm font-semibold">
              <Trophy className="h-3.5 w-3.5" />18 cards mastered
            </div>
            <div className="flex items-center gap-1.5 bg-primary/10 text-primary border border-primary/20 px-3 py-1.5 rounded-full text-sm font-semibold">
              <BookOpen className="h-3.5 w-3.5" />{myDecks.length} decks created
            </div>
          </div>
        </div>
      </div>

      {/* ── Stats row ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { icon: BookOpen, label: 'My Decks',      value: myDecks.length,    color: 'text-primary',    bg: 'bg-primary/10'    },
          { icon: Play,     label: 'Sessions',       value: mySessions.length, color: 'text-purple-400', bg: 'bg-purple-500/10' },
          { icon: Trophy,   label: 'Cards Mastered', value: 18,                color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
          { icon: Flame,    label: 'Day Streak',     value: user?.studyStreak, color: 'text-orange-400', bg: 'bg-orange-500/10' },
        ].map(({ icon: Icon, label, value, color, bg }) => (
          <Card key={label} className="border-border">
            <CardContent className="p-5 flex items-center gap-4">
              <div className={cn('p-2.5 rounded-xl', bg)}>
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

      {/* ── Mastery card ── */}
      <Card className="border-border mb-6">
        <CardContent className="p-5">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-sm font-semibold text-foreground">Overall Mastery</p>
              <p className="text-xs text-muted-foreground">Based on all completed sessions</p>
            </div>
            <span className="text-2xl font-extrabold text-primary">{masteryPct}%</span>
          </div>
          <Progress value={masteryPct} className="h-2.5" />
          <div className="flex justify-between text-xs text-muted-foreground mt-2">
            <span className="flex items-center gap-1">
              <CheckCircle2 className="h-3 w-3 text-green-400" />18 known
            </span>
            <span>30 total cards</span>
          </div>
        </CardContent>
      </Card>

      {/* ── Custom tabs ── */}
      <div>
        {/* Tab buttons */}
        <div className="flex border-b border-border mb-5">
          <button
            onClick={() => setTab('decks')}
            className={cn(
              'flex items-center gap-2 px-5 py-3 text-sm font-medium border-b-2 transition-colors -mb-px',
              tab === 'decks'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            )}
          >
            <BookOpen className="h-3.5 w-3.5" />
            My Decks
            <span className={cn(
              'text-xs px-1.5 py-0.5 rounded-full font-semibold',
              tab === 'decks' ? 'bg-primary/15 text-primary' : 'bg-muted text-muted-foreground'
            )}>
              {myDecks.length}
            </span>
          </button>
          <button
            onClick={() => setTab('history')}
            className={cn(
              'flex items-center gap-2 px-5 py-3 text-sm font-medium border-b-2 transition-colors -mb-px',
              tab === 'history'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            )}
          >
            <Clock className="h-3.5 w-3.5" />
            Study History
            <span className={cn(
              'text-xs px-1.5 py-0.5 rounded-full font-semibold',
              tab === 'history' ? 'bg-primary/15 text-primary' : 'bg-muted text-muted-foreground'
            )}>
              {mySessions.length}
            </span>
          </button>
        </div>

        {/* ── My Decks ── */}
        {tab === 'decks' && (
          myDecks.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground border border-dashed border-border rounded-xl">
              <BookOpen className="h-10 w-10 mx-auto mb-3 opacity-30" />
              <p className="mb-3 text-sm">No decks yet.</p>
              <Button asChild size="sm">
                <Link to="/decks/new"><Plus className="h-3.5 w-3.5 mr-1" />Create your first deck</Link>
              </Button>
            </div>
          ) : (
            <div className="rounded-xl border border-border overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-muted/40 border-b border-border">
                    <th className="text-left px-5 py-3.5 font-semibold text-muted-foreground">Deck</th>
                    <th className="text-left px-5 py-3.5 font-semibold text-muted-foreground">Category</th>
                    <th className="text-left px-5 py-3.5 font-semibold text-muted-foreground">Cards</th>
                    <th className="text-left px-5 py-3.5 font-semibold text-muted-foreground">Visibility</th>
                    <th className="px-5 py-3.5" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {myDecks.map((deck) => (
                    <tr key={deck._id} className="hover:bg-muted/20 transition-colors group">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-primary/10 rounded-lg shrink-0">
                            <BookOpen className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <p className="font-semibold text-foreground leading-snug">{deck.title}</p>
                            <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{deck.description}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span className="text-xs font-semibold text-primary bg-primary/10 px-2.5 py-1 rounded-full">
                          {deck.category}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-muted-foreground font-medium">{deck.cards.length}</td>
                      <td className="px-5 py-4">
                        <Badge variant={deck.isPublic ? 'default' : 'secondary'} className="text-xs">
                          {deck.isPublic ? 'Public' : 'Private'}
                        </Badge>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <Button
                          size="sm" variant="outline" asChild
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Link to={`/decks/${deck._id}`}>
                            Study <ArrowRight className="h-3 w-3 ml-1" />
                          </Link>
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        )}

        {/* ── Study History ── */}
        {tab === 'history' && (
          <div className="rounded-xl border border-border overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-muted/40 border-b border-border">
                  <th className="text-left px-5 py-3.5 font-semibold text-muted-foreground">Deck</th>
                  <th className="text-left px-5 py-3.5 font-semibold text-muted-foreground">Mode</th>
                  <th className="text-left px-5 py-3.5 font-semibold text-muted-foreground">Result</th>
                  <th className="text-left px-5 py-3.5 font-semibold text-muted-foreground">Duration</th>
                  <th className="text-left px-5 py-3.5 font-semibold text-muted-foreground">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {mySessions.map((session) => {
                  const isQuiz     = session.mode === 'quiz'
                  const scoreColor = session.score >= 80
                    ? 'text-green-400 bg-green-500/10'
                    : session.score >= 60
                    ? 'text-yellow-400 bg-yellow-500/10'
                    : 'text-red-400 bg-red-500/10'
                  const mins = Math.floor(session.timeTaken / 60)
                  const secs = session.timeTaken % 60

                  return (
                    <tr key={session._id} className="hover:bg-muted/20 transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className={cn('p-2 rounded-lg shrink-0', isQuiz ? 'bg-purple-500/10' : 'bg-primary/10')}>
                            {isQuiz
                              ? <CheckCircle2 className="h-4 w-4 text-purple-400" />
                              : <BookOpen className="h-4 w-4 text-primary" />
                            }
                          </div>
                          <p className="font-medium text-foreground line-clamp-1 max-w-[200px]">
                            {session.deck.title}
                          </p>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <Badge variant="outline" className="capitalize text-xs">{session.mode}</Badge>
                      </td>
                      <td className="px-5 py-4">
                        {isQuiz ? (
                          <span className={cn('text-xs font-bold px-2.5 py-1 rounded-full', scoreColor)}>
                            {session.score}%
                          </span>
                        ) : (
                          <span className="text-xs font-bold px-2.5 py-1 rounded-full text-green-400 bg-green-500/10">
                            {session.knownCount} known
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-4">
                        <span className="flex items-center gap-1.5 text-muted-foreground">
                          <Timer className="h-3.5 w-3.5" />{mins}m {secs}s
                        </span>
                      </td>
                      <td className="px-5 py-4 text-muted-foreground">
                        {new Date(session.completedAt).toLocaleDateString('en-PH', {
                          month: 'short', day: 'numeric', year: 'numeric'
                        })}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </PageWrapper>
  )
}