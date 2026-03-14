import { useState } from 'react'
import { useProfile }   from '@/features/profile'
import { PageWrapper }  from '@/components/layout/PageWrapper'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge }        from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button }       from '@/components/ui/button'
import { Link }         from 'react-router-dom'
import { Flame, Trophy, BookOpen, Clock, Play, Camera } from 'lucide-react'
import { cn }           from '@/lib/utils'

const ROLE_COLORS = {
  admin:   'bg-red-100 text-red-700',
  creator: 'bg-purple-100 text-purple-700',
  student: 'bg-blue-100 text-blue-700',
}

export default function ProfilePage() {
  const { data, isLoading } = useProfile()
  const [tab, setTab]       = useState('decks')

  if (isLoading) return <PageWrapper><LoadingSpinner /></PageWrapper>

  const { user, myDecks, mySessions } = data

  return (
    <PageWrapper>
      {/* Profile header */}
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-10">
        {/* Avatar with camera overlay */}
        <div className="relative shrink-0">
          <Avatar className="h-24 w-24 border-4 border-background shadow-md">
            <AvatarImage src={user?.avatar} />
            <AvatarFallback className="text-2xl font-bold">
              {user?.name?.[0]?.toUpperCase() ?? 'U'}
            </AvatarFallback>
          </Avatar>
          <button className="absolute bottom-0 right-0 bg-primary text-primary-foreground rounded-full p-1.5 shadow hover:bg-primary/90 transition-colors">
            <Camera className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Info */}
        <div className="flex-1 text-center sm:text-left">
          <div className="flex items-center gap-2 justify-center sm:justify-start flex-wrap mb-1">
            <h1 className="text-2xl font-extrabold text-foreground">{user?.name}</h1>
            <span className={cn('text-xs font-semibold px-2.5 py-1 rounded-full capitalize', ROLE_COLORS[user?.role] ?? 'bg-muted text-muted-foreground')}>
              {user?.role}
            </span>
          </div>
          <p className="text-muted-foreground text-sm mb-4">@{user?.username} · {user?.email}</p>

          {/* Badges */}
          <div className="flex items-center gap-3 justify-center sm:justify-start flex-wrap">
            <div className="flex items-center gap-1.5 bg-orange-50 text-orange-600 px-3 py-1.5 rounded-full text-sm font-semibold">
              <Flame className="h-4 w-4" />{user?.studyStreak} day streak
            </div>
            <div className="flex items-center gap-1.5 bg-yellow-50 text-yellow-600 px-3 py-1.5 rounded-full text-sm font-semibold">
              <Trophy className="h-4 w-4" />18 cards mastered
            </div>
          </div>
        </div>

        <Button variant="outline" size="sm">Edit Profile</Button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { icon: BookOpen, label: 'My Decks',      value: myDecks.length,    color: 'text-blue-500'   },
          { icon: Play,     label: 'Study Sessions', value: mySessions.length, color: 'text-purple-500' },
          { icon: Trophy,   label: 'Cards Mastered', value: 18,                color: 'text-yellow-500' },
          { icon: Flame,    label: 'Day Streak',     value: user?.studyStreak, color: 'text-orange-500' },
        ].map(({ icon: Icon, label, value, color }) => (
          <Card key={label}>
            <CardContent className="p-5 flex items-center gap-3">
              <Icon className={cn('h-5 w-5 shrink-0', color)} />
              <div>
                <p className="text-xl font-extrabold text-foreground">{value}</p>
                <p className="text-xs text-muted-foreground">{label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tabs */}
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="decks">My Decks</TabsTrigger>
          <TabsTrigger value="history">Study History</TabsTrigger>
        </TabsList>

        {/* My Decks */}
        <TabsContent value="decks">
          {myDecks.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              <BookOpen className="h-10 w-10 mx-auto mb-3 opacity-30" />
              <p className="mb-3">No decks yet.</p>
              <Button asChild size="sm"><Link to="/decks/new">Create your first deck</Link></Button>
            </div>
          ) : (
            <div className="rounded-lg border overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Title</th>
                    <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Category</th>
                    <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Cards</th>
                    <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Visibility</th>
                    <th className="px-4 py-3" />
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {myDecks.map((deck) => (
                    <tr key={deck._id} className="hover:bg-muted/20 transition-colors">
                      <td className="px-4 py-3 font-medium text-foreground">{deck.title}</td>
                      <td className="px-4 py-3 text-muted-foreground">{deck.category}</td>
                      <td className="px-4 py-3 text-muted-foreground">{deck.cards.length}</td>
                      <td className="px-4 py-3">
                        <Badge variant={deck.isPublic ? 'default' : 'secondary'}>
                          {deck.isPublic ? 'Public' : 'Private'}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Button size="sm" variant="ghost" asChild>
                          <Link to={`/decks/${deck._id}`}>View</Link>
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </TabsContent>

        {/* Study History */}
        <TabsContent value="history">
          <div className="rounded-lg border overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Deck</th>
                  <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Mode</th>
                  <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Result</th>
                  <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Duration</th>
                  <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {mySessions.map((session) => (
                  <tr key={session._id} className="hover:bg-muted/20 transition-colors">
                    <td className="px-4 py-3 font-medium text-foreground max-w-[200px] truncate">
                      {session.deck.title}
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant="outline" className="capitalize">{session.mode}</Badge>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {session.mode === 'quiz'
                        ? <span className={cn('font-semibold', session.score >= 80 ? 'text-green-600' : session.score >= 60 ? 'text-yellow-600' : 'text-red-500')}>{session.score}%</span>
                        : <span>{session.knownCount} known</span>
                      }
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {Math.round(session.timeTaken / 60)}m {session.timeTaken % 60}s
                      </span>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {new Date(session.completedAt).toLocaleDateString('en-PH', {
                        month: 'short', day: 'numeric', year: 'numeric'
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>
      </Tabs>
    </PageWrapper>
  )
}