import { useState, useRef } from 'react'
import { useProfile }     from '@/features/profile'
import { PageWrapper }    from '@/components/layout/PageWrapper'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent } from '@/components/ui/card'
import { Button }         from '@/components/ui/button'
import { Progress }       from '@/components/ui/progress'
import { Input }          from '@/components/ui/input'
import { Badge }          from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Link }           from 'react-router-dom'
import { ClassIcon }      from '@/features/classes/components/ClassIcon'
import {
  Flame, Trophy, BookOpen, Clock,
  Play, Camera, Plus, ArrowRight,
  CheckCircle2, Timer, Globe, Lock,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const ROLE_COLORS = {
  admin:   'bg-red-500/15 text-red-400 border-red-500/20',
  creator: 'bg-purple-500/15 text-purple-400 border-purple-500/20',
  student: 'bg-primary/15 text-primary border-primary/20',
}

export default function ProfilePage() {
  const { data, isLoading }                   = useProfile()
  const [tab, setTab]                         = useState('subjects')
  const [showEditDialog, setShowEditDialog]   = useState(false)
  const [editName, setEditName]               = useState('')
  const [editUsername, setEditUsername]       = useState('')
  const [avatarPreview, setAvatarPreview]     = useState(null)
  const fileInputRef                          = useRef(null)

  if (isLoading) return <PageWrapper><LoadingSpinner /></PageWrapper>

  const { user, myClasses, mySessions } = data
  const masteryPct = Math.round((18 / 30) * 100)

  const handleOpenEdit = () => {
    setEditName(user?.name ?? '')
    setEditUsername(user?.username ?? '')
    setAvatarPreview(user?.avatar ?? null)
    setShowEditDialog(true)
  }

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setAvatarPreview(reader.result)
    reader.readAsDataURL(file)
  }

  const handleSaveProfile = () => {
    // Phase B: call real API here
    setShowEditDialog(false)
  }

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
                  <AvatarImage src={avatarPreview ?? user?.avatar} />
                  <AvatarFallback className="text-2xl font-bold bg-primary/20 text-primary">
                    {user?.name?.[0]?.toUpperCase() ?? 'U'}
                  </AvatarFallback>
                </Avatar>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-0 right-0 bg-primary text-primary-foreground rounded-full p-1.5 shadow-lg hover:bg-primary/90 transition-colors"
                >
                  <Camera className="h-3 w-3" />
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarChange}
                />
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
              <Button variant="outline" size="sm" onClick={handleOpenEdit}>Edit Profile</Button>
              <Button size="sm" asChild>
                <Link to="/classes/new"><Plus className="h-3.5 w-3.5 mr-1" />New Subject</Link>
              </Button>
            </div>
          </div>

          {/* Badges */}
          <div className="flex items-center gap-3 mt-4 flex-wrap">
            <div className="flex items-center gap-1.5 bg-orange-500/10 text-orange-400 border border-orange-500/20 px-3 py-1.5 rounded-full text-sm font-semibold">
              <Flame className="h-3.5 w-3.5" />{user?.studyStreak} day streak
            </div>
            <div className="flex items-center gap-1.5 bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 px-3 py-1.5 rounded-full text-sm font-semibold">
              <Trophy className="h-3.5 w-3.5" />18 cards mastered
            </div>
            <div className="flex items-center gap-1.5 bg-primary/10 text-primary border border-primary/20 px-3 py-1.5 rounded-full text-sm font-semibold">
              <BookOpen className="h-3.5 w-3.5" />{myClasses.length} subjects created
            </div>
          </div>
        </div>
      </div>

      {/* ── Stats row ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { icon: BookOpen, label: 'My Subjects',    value: myClasses.length,  color: 'text-primary',    bg: 'bg-primary/10'    },
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
        <div className="flex border-b border-border mb-5">
          <button
            onClick={() => setTab('subjects')}
            className={cn(
              'flex items-center gap-2 px-5 py-3 text-sm font-medium border-b-2 transition-colors -mb-px',
              tab === 'subjects'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            )}
          >
            <BookOpen className="h-3.5 w-3.5" />
            My Subjects
            <span className={cn(
              'text-xs px-1.5 py-0.5 rounded-full font-semibold',
              tab === 'subjects' ? 'bg-primary/15 text-primary' : 'bg-muted text-muted-foreground'
            )}>
              {myClasses.length}
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

        {/* ── My Subjects ── */}
        {tab === 'subjects' && (
          myClasses.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground border border-dashed border-border rounded-xl">
              <BookOpen className="h-10 w-10 mx-auto mb-3 opacity-30" />
              <p className="mb-3 text-sm">No subjects yet.</p>
              <Button asChild size="sm">
                <Link to="/classes/new"><Plus className="h-3.5 w-3.5 mr-1" />Create your first subject</Link>
              </Button>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {myClasses.map((cls) => (
                <div
                  key={cls._id}
                  className="rounded-2xl overflow-hidden border border-border hover:border-primary/50 hover:shadow-md transition-all group"
                >
                  {/* Gradient header */}
                  <div className={cn('h-20 bg-gradient-to-br flex items-center px-4 gap-3', cls.color)}>
                    <ClassIcon icon={cls.icon} size="sm" />
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-white text-sm line-clamp-1">{cls.name}</p>
                      <p className="text-white/70 text-xs flex items-center gap-1 mt-0.5">
                        {cls.isPublic
                          ? <><Globe className="h-3 w-3" />Public</>
                          : <><Lock className="h-3 w-3" />Private</>
                        }
                        <span className="mx-1">·</span>
                        <BookOpen className="h-3 w-3" />
                        {cls.deckCount} deck{cls.deckCount !== 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>

                  {/* Body */}
                  <div className="bg-card p-4 flex flex-col gap-3">
                    <p className="text-xs text-muted-foreground line-clamp-2 min-h-[2rem]">
                      {cls.description || 'No description.'}
                    </p>
                    <Button size="sm" className="w-full" asChild>
                      <Link to={`/classes/${cls._id}`}>
                        Open Subject <ArrowRight className="h-3.5 w-3.5 ml-1" />
                      </Link>
                    </Button>
                  </div>
                </div>
              ))}
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

      {/* ── Edit Profile Dialog ── */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
          </DialogHeader>

          <div className="flex flex-col gap-5 py-2">
            {/* Avatar */}
            <div className="flex flex-col items-center gap-3">
              <div className="relative">
                <Avatar className="h-20 w-20 border-4 border-card shadow-xl">
                  <AvatarImage src={avatarPreview} />
                  <AvatarFallback className="text-2xl font-bold bg-primary/20 text-primary">
                    {editName?.[0]?.toUpperCase() ?? 'U'}
                  </AvatarFallback>
                </Avatar>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-0 right-0 bg-primary text-primary-foreground rounded-full p-1.5 shadow-lg hover:bg-primary/90 transition-colors"
                >
                  <Camera className="h-3 w-3" />
                </button>
              </div>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="text-xs text-primary hover:underline"
              >
                Change profile photo
              </button>
              <p className="text-xs text-muted-foreground">
                JPG, PNG or GIF · Max 5MB · Upload available in Phase B
              </p>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-foreground">Full Name</label>
              <Input
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                placeholder="Your full name"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-foreground">Username</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">@</span>
                <Input
                  value={editUsername}
                  onChange={(e) => setEditUsername(e.target.value)}
                  placeholder="username"
                  className="pl-7"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-foreground">Email</label>
              <Input value={user?.email ?? ''} disabled className="opacity-50 cursor-not-allowed" />
              <p className="text-xs text-muted-foreground">Email cannot be changed here.</p>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>Cancel</Button>
            <Button onClick={handleSaveProfile}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </PageWrapper>
  )
}