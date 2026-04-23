import { useState, useRef } from "react";
import { useProfile }        from "@/features/profile";
import { PageWrapper }       from "@/components/layout/PageWrapper";
import { LoadingSpinner }    from "@/components/shared/LoadingSpinner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Button }            from "@/components/ui/button";
import { Progress }          from "@/components/ui/progress";
import { Input }             from "@/components/ui/input";
import { Badge }             from "@/components/ui/badge";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Link }              from "react-router-dom";
import { ClassIcon }         from "@/features/classes/components/ClassIcon";
import { updateProfile, updatePassword } from "@/features/auth/api/auth.api";
import { useAuthStore }      from "@/features/auth/store/authStore";
import {
  Flame, Trophy, BookOpen, Clock, Play,
  Camera, Plus, ArrowRight, CheckCircle2,
  Timer, Globe, Lock, Check, X,
  KeyRound, Eye, EyeOff, User, Shield,
} from "lucide-react";
import { cn } from "@/lib/utils";

const ROLE_COLORS = {
  admin:   "bg-red-500/15 text-red-400 border-red-500/20",
  creator: "bg-purple-500/15 text-purple-400 border-purple-500/20",
  student: "bg-primary/15 text-primary border-primary/20",
};

// Password input with show/hide toggle
function PasswordInput({ value, onChange, placeholder }) {
  const [show, setShow] = useState(false)
  return (
    <div className="relative">
      <Input
        type={show ? "text" : "password"}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="pr-10"
      />
      <button type="button" onClick={() => setShow((v) => !v)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
        {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </button>
    </div>
  )
}

export default function ProfilePage() {
  const { data, isLoading } = useProfile()
  const [tab, setTab]                         = useState("subjects")
  const [showEditDialog, setShowEditDialog]   = useState(false)
  const [editTab, setEditTab]                 = useState("profile") // "profile" | "password"
  const [showAvatarPreview, setShowAvatarPreview] = useState(false)

  // Profile fields
  const [editName, setEditName]               = useState("")
  const [editUsername, setEditUsername]       = useState("")
  const [pendingAvatar, setPendingAvatar]     = useState(null)
  const [isSaving, setIsSaving]               = useState(false)
  const [saveError, setSaveError]             = useState(null)
  const [saveSuccess, setSaveSuccess]         = useState(null)

  // Password fields
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword]         = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isSavingPassword, setIsSavingPassword] = useState(false)
  const [passwordError, setPasswordError]     = useState(null)
  const [passwordSuccess, setPasswordSuccess] = useState(null)

  // Avatar preview
  const [isSavingAvatar, setIsSavingAvatar]   = useState(false)

  const fileInputRef     = useRef(null)
  const heroFileInputRef = useRef(null)

  const setAuth = useAuthStore((s) => s.setAuth)
  const token   = useAuthStore((s) => s.token)

  if (isLoading) return <PageWrapper><LoadingSpinner /></PageWrapper>

  const {
    user, myClasses, mySessions,
    cardsMastered = 0, totalCards = 0,
    mastery = 0, totalSessions = 0,
  } = data

  const currentAvatar = user?.avatar ?? null

  // ── Avatar handlers ──
  const handleHeroAvatarChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => { setPendingAvatar(reader.result); setShowAvatarPreview(true) }
    reader.readAsDataURL(file)
  }

  const handleConfirmAvatar = async () => {
    setIsSavingAvatar(true)
    try {
      const { user: updatedUser } = await updateProfile({ name: user.name, username: user.username, avatar: pendingAvatar })
      setAuth({ token, user: updatedUser })
      setShowAvatarPreview(false)
      setPendingAvatar(null)
    } catch (err) { console.error(err) }
    finally { setIsSavingAvatar(false) }
  }

  const handleDialogAvatarChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setPendingAvatar(reader.result)
    reader.readAsDataURL(file)
  }

  // ── Open edit dialog ──
  const handleOpenEdit = (tab = "profile") => {
    setEditName(user?.name ?? "")
    setEditUsername(user?.username ?? "")
    setPendingAvatar(null)
    setSaveError(null)
    setSaveSuccess(null)
    setPasswordError(null)
    setPasswordSuccess(null)
    setCurrentPassword("")
    setNewPassword("")
    setConfirmPassword("")
    setEditTab(tab)
    setShowEditDialog(true)
  }

  // ── Save profile ──
  const handleSaveProfile = async () => {
    setIsSaving(true)
    setSaveError(null)
    setSaveSuccess(null)
    try {
      const { user: updatedUser } = await updateProfile({
        name:     editName,
        username: editUsername,
        avatar:   pendingAvatar ?? user?.avatar,
      })
      setAuth({ token, user: updatedUser })
      setPendingAvatar(null)
      setSaveSuccess("Profile updated successfully!")
      setTimeout(() => setShowEditDialog(false), 1000)
    } catch (err) {
      setSaveError(err.response?.data?.message ?? 'Failed to save profile')
    } finally { setIsSaving(false) }
  }

  // ── Save password ──
  const handleSavePassword = async () => {
    setPasswordError(null)
    setPasswordSuccess(null)

    if (!currentPassword) return setPasswordError("Current password is required")
    if (!newPassword)      return setPasswordError("New password is required")
    if (newPassword.length < 8) return setPasswordError("New password must be at least 8 characters")
    if (newPassword !== confirmPassword) return setPasswordError("Passwords do not match")

    setIsSavingPassword(true)
    try {
      await updatePassword({ currentPassword, newPassword })
      setPasswordSuccess("Password changed successfully!")
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
      setTimeout(() => setShowEditDialog(false), 1000)
    } catch (err) {
      setPasswordError(err.response?.data?.message ?? 'Failed to change password')
    } finally { setIsSavingPassword(false) }
  }

  return (
    <PageWrapper className="max-w-6xl">

      {/* ── Avatar Preview Modal ── */}
      <Dialog open={showAvatarPreview} onOpenChange={setShowAvatarPreview}>
        <DialogContent className="max-w-sm p-0 overflow-hidden">
          <div className="px-6 pt-6 pb-4 border-b border-border">
            <DialogTitle className="text-base font-bold">Preview Profile Photo</DialogTitle>
            <p className="text-xs text-muted-foreground mt-1">Does this look good?</p>
          </div>
          <div className="p-6 flex flex-col items-center gap-6">
            <div className="h-32 w-32 rounded-full overflow-hidden border-4 border-border shadow-xl">
              <img src={pendingAvatar} alt="preview" className="w-full h-full object-cover" />
            </div>
            <div className="flex items-center gap-3 w-full">
              <div className="h-12 w-12 rounded-full overflow-hidden border-2 border-border shrink-0">
                <img src={pendingAvatar} alt="preview sm" className="w-full h-full object-cover" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">{user?.name}</p>
                <p className="text-xs text-muted-foreground">@{user?.username}</p>
              </div>
            </div>
          </div>
          <div className="px-6 py-4 border-t border-border flex justify-end gap-2 bg-muted/20">
            <Button variant="outline" onClick={() => { setShowAvatarPreview(false); setPendingAvatar(null) }}>
              <X className="h-4 w-4 mr-1.5" />Cancel
            </Button>
            <Button onClick={handleConfirmAvatar} disabled={isSavingAvatar}>
              <Check className="h-4 w-4 mr-1.5" />
              {isSavingAvatar ? "Saving..." : "Use this photo"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* ── Hero banner ── */}
      <div className="relative rounded-2xl overflow-hidden mb-6">
        <div className="h-36 bg-gradient-to-br from-primary via-primary/80 to-cyan-400" />
        <div className="bg-card border border-border rounded-b-2xl px-6 pb-6">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div className="flex items-end gap-5 -mt-10">
              <div className="relative shrink-0 group cursor-pointer" onClick={() => heroFileInputRef.current?.click()}>
                <Avatar className="h-20 w-20 border-4 border-card shadow-xl">
                  <AvatarImage src={currentAvatar} />
                  <AvatarFallback className="text-2xl font-bold bg-primary/20 text-primary">
                    {user?.name?.[0]?.toUpperCase() ?? "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Camera className="h-5 w-5 text-white" />
                </div>
                <input ref={heroFileInputRef} type="file" accept="image/*" className="hidden" onChange={handleHeroAvatarChange} />
              </div>
              <div className="pb-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-xl font-extrabold text-foreground">{user?.name}</h1>
                  <span className={cn("text-xs font-semibold px-2.5 py-0.5 rounded-full border capitalize",
                    ROLE_COLORS[user?.role] ?? "bg-muted text-muted-foreground")}>
                    {user?.role}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">@{user?.username} · {user?.email}</p>
              </div>
            </div>
            <div className="flex gap-2 pb-1">
              <Button variant="outline" size="sm" onClick={() => handleOpenEdit("profile")}>
                Edit Profile
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleOpenEdit("password")}>
                <KeyRound className="h-3.5 w-3.5 mr-1.5" />Change Password
              </Button>
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
              <Trophy className="h-3.5 w-3.5" />{cardsMastered} cards mastered
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
          { icon: BookOpen, label: "My Subjects",    value: myClasses.length,  color: "text-primary",    bg: "bg-primary/10"    },
          { icon: Play,     label: "Sessions",       value: totalSessions,     color: "text-purple-400", bg: "bg-purple-500/10" },
          { icon: Trophy,   label: "Cards Mastered", value: cardsMastered,     color: "text-yellow-400", bg: "bg-yellow-500/10" },
          { icon: Flame,    label: "Day Streak",     value: user?.studyStreak, color: "text-orange-400", bg: "bg-orange-500/10" },
        ].map(({ icon: Icon, label, value, color, bg }) => (
          <Card key={label} className="border-border">
            <CardContent className="p-5 flex items-center gap-4">
              <div className={cn("p-2.5 rounded-xl", bg)}>
                <Icon className={cn("h-5 w-5", color)} />
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
            <span className="text-2xl font-extrabold text-primary">{mastery}%</span>
          </div>
          <Progress value={mastery} className="h-2.5" />
          <div className="flex justify-between text-xs text-muted-foreground mt-2">
            <span className="flex items-center gap-1">
              <CheckCircle2 className="h-3 w-3 text-green-400" />{cardsMastered} known
            </span>
            <span>{totalCards} total cards</span>
          </div>
        </CardContent>
      </Card>

      {/* ── Tabs ── */}
      <div>
        <div className="flex border-b border-border mb-5">
          {[
            { id: "subjects", icon: BookOpen, label: "My Subjects",   count: myClasses.length  },
            { id: "history",  icon: Clock,    label: "Study History", count: mySessions.length },
          ].map(({ id, icon: Icon, label, count }) => (
            <button key={id} onClick={() => setTab(id)}
              className={cn("flex items-center gap-2 px-5 py-3 text-sm font-medium border-b-2 transition-colors -mb-px",
                tab === id ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground")}>
              <Icon className="h-3.5 w-3.5" />{label}
              <span className={cn("text-xs px-1.5 py-0.5 rounded-full font-semibold",
                tab === id ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground")}>
                {count}
              </span>
            </button>
          ))}
        </div>

        {/* My Subjects */}
        {tab === "subjects" && (
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
                <div key={cls._id} className="rounded-2xl overflow-hidden border border-border hover:border-primary/50 hover:shadow-md transition-all">
                  <div className={cn("h-20 bg-gradient-to-br flex items-center px-4 gap-3", cls.color)}>
                    <ClassIcon icon={cls.icon} size="sm" />
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-white text-sm line-clamp-1">{cls.name}</p>
                      <p className="text-white/70 text-xs flex items-center gap-1 mt-0.5">
                        {cls.isPublic ? <><Globe className="h-3 w-3" />Public</> : <><Lock className="h-3 w-3" />Private</>}
                        <span className="mx-1">·</span>
                        <BookOpen className="h-3 w-3" />{cls.deckCount} deck{cls.deckCount !== 1 ? "s" : ""}
                      </p>
                    </div>
                  </div>
                  <div className="bg-card p-4 flex flex-col gap-3">
                    <p className="text-xs text-muted-foreground line-clamp-2 min-h-[2rem]">{cls.description || "No description."}</p>
                    <Button size="sm" className="w-full" asChild>
                      <Link to={`/classes/${cls._id}`}>Open Subject <ArrowRight className="h-3.5 w-3.5 ml-1" /></Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )
        )}

        {/* Study History */}
        {tab === "history" && (
          mySessions.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground border border-dashed border-border rounded-xl">
              <Clock className="h-10 w-10 mx-auto mb-3 opacity-30" />
              <p className="text-sm">No study sessions yet.</p>
            </div>
          ) : (
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
                    const isQuiz = session.mode === "quiz"
                    const scoreColor = session.score >= 80 ? "text-green-400 bg-green-500/10"
                      : session.score >= 60 ? "text-yellow-400 bg-yellow-500/10"
                      : "text-red-400 bg-red-500/10"
                    const mins = Math.floor(session.timeTaken / 60)
                    const secs = session.timeTaken % 60
                    return (
                      <tr key={session._id ?? session.id} className="hover:bg-muted/20 transition-colors">
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className={cn("p-2 rounded-lg shrink-0", isQuiz ? "bg-purple-500/10" : "bg-primary/10")}>
                              {isQuiz ? <CheckCircle2 className="h-4 w-4 text-purple-400" /> : <BookOpen className="h-4 w-4 text-primary" />}
                            </div>
                            <p className="font-medium text-foreground line-clamp-1 max-w-[200px]">{session.deck?.title}</p>
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <Badge variant="outline" className="capitalize text-xs">{session.mode}</Badge>
                        </td>
                        <td className="px-5 py-4">
                          {isQuiz
                            ? <span className={cn("text-xs font-bold px-2.5 py-1 rounded-full", scoreColor)}>{session.score}%</span>
                            : <span className="text-xs font-bold px-2.5 py-1 rounded-full text-green-400 bg-green-500/10">{session.knownCount} known</span>
                          }
                        </td>
                        <td className="px-5 py-4">
                          <span className="flex items-center gap-1.5 text-muted-foreground">
                            <Timer className="h-3.5 w-3.5" />{mins}m {secs}s
                          </span>
                        </td>
                        <td className="px-5 py-4 text-muted-foreground">
                          {new Date(session.completedAt).toLocaleDateString("en-PH", { month: "short", day: "numeric", year: "numeric" })}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )
        )}
      </div>

      {/* ── Edit Profile / Change Password Dialog ── */}
      <Dialog open={showEditDialog} onOpenChange={(open) => { setShowEditDialog(open); if (!open) setPendingAvatar(null) }}>
        <DialogContent className="w-[620px] p-0 overflow-hidden">
          <div className="flex h-full">

            {/* ── Left sidebar ── */}
            <div className="w-48 shrink-0 bg-muted/30 border-r border-border flex flex-col">
              {/* Avatar */}
              <div className="p-6 flex flex-col items-center gap-3 border-b border-border">
                <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                  <Avatar className="h-20 w-20 border-4 border-background shadow-xl">
                    <AvatarImage src={pendingAvatar ?? currentAvatar} />
                    <AvatarFallback className="text-2xl font-bold bg-primary/20 text-primary">
                      {editName?.[0]?.toUpperCase() ?? "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Camera className="h-5 w-5 text-white" />
                  </div>
                </div>
                <Button variant="outline" size="sm" className="w-full text-xs" onClick={() => fileInputRef.current?.click()}>
                  <Camera className="h-3 w-3 mr-1.5" />Change Photo
                </Button>
                <p className="text-[10px] text-muted-foreground text-center">JPG, PNG · Max 5MB</p>
                <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleDialogAvatarChange} />
              </div>

              {/* Nav tabs */}
              <nav className="p-3 flex flex-col gap-1">
                <button onClick={() => setEditTab("profile")}
                  className={cn("flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-left",
                    editTab === "profile" ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-muted")}>
                  <User className="h-4 w-4 shrink-0" />Profile Info
                </button>
                <button onClick={() => setEditTab("password")}
                  className={cn("flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-left",
                    editTab === "password" ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-muted")}>
                  <Shield className="h-4 w-4 shrink-0" />Change Password
                </button>
              </nav>
            </div>

            {/* ── Right panel ── */}
            <div className="flex-1 flex flex-col min-w-0">

              {/* Header */}
              <div className="px-6 pt-6 pb-4 border-b border-border shrink-0">
                <DialogTitle className="text-lg font-bold">
                  {editTab === "profile" ? "Edit Profile" : "Change Password"}
                </DialogTitle>
                <p className="text-xs text-muted-foreground mt-1">
                  {editTab === "profile"
                    ? "Update your name, username and photo."
                    : "Keep your account secure with a strong password."}
                </p>
              </div>

              {/* ── Profile tab ── */}
              {editTab === "profile" && (
                <>
                  <div className="px-6 py-5 flex flex-col gap-4 flex-1 overflow-y-auto">
                    {saveError && (
                      <div className="bg-destructive/10 text-destructive text-sm px-4 py-3 rounded-lg border border-destructive/20">
                        {saveError}
                      </div>
                    )}
                    {saveSuccess && (
                      <div className="bg-green-500/10 text-green-500 text-sm px-4 py-3 rounded-lg border border-green-500/20 flex items-center gap-2">
                        <Check className="h-4 w-4" />{saveSuccess}
                      </div>
                    )}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-sm font-semibold text-foreground">Full Name</label>
                      <Input value={editName} onChange={(e) => setEditName(e.target.value)} placeholder="Your full name" />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-sm font-semibold text-foreground">Username</label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">@</span>
                        <Input value={editUsername} onChange={(e) => setEditUsername(e.target.value)} placeholder="username" className="pl-7" />
                      </div>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-sm font-semibold text-foreground">Email</label>
                      <Input value={user?.email ?? ""} disabled className="opacity-50 cursor-not-allowed" />
                      <p className="text-xs text-muted-foreground">Email cannot be changed.</p>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-sm font-semibold text-foreground">Role</label>
                      <div className={cn("inline-flex w-fit items-center text-xs font-semibold px-2.5 py-1 rounded-full border capitalize",
                        ROLE_COLORS[user?.role] ?? "bg-muted text-muted-foreground")}>
                        {user?.role}
                      </div>
                    </div>
                  </div>
                  <div className="px-6 py-4 border-t border-border flex justify-end gap-2 bg-muted/20 shrink-0">
                    <Button variant="outline" onClick={() => { setShowEditDialog(false); setPendingAvatar(null) }}>Cancel</Button>
                    <Button onClick={handleSaveProfile} disabled={isSaving}>
                      <Check className="h-4 w-4 mr-1.5" />{isSaving ? "Saving..." : "Save Changes"}
                    </Button>
                  </div>
                </>
              )}

              {/* ── Password tab ── */}
              {editTab === "password" && (
                <>
                  <div className="px-6 py-5 flex flex-col gap-4 flex-1 overflow-y-auto">
                    {passwordError && (
                      <div className="bg-destructive/10 text-destructive text-sm px-4 py-3 rounded-lg border border-destructive/20">
                        {passwordError}
                      </div>
                    )}
                    {passwordSuccess && (
                      <div className="bg-green-500/10 text-green-500 text-sm px-4 py-3 rounded-lg border border-green-500/20 flex items-center gap-2">
                        <Check className="h-4 w-4" />{passwordSuccess}
                      </div>
                    )}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-sm font-semibold text-foreground">Current Password</label>
                      <PasswordInput value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} placeholder="Enter current password" />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-sm font-semibold text-foreground">New Password</label>
                      <PasswordInput value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Min. 8 characters" />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-sm font-semibold text-foreground">Confirm New Password</label>
                      <PasswordInput value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Re-enter new password" />
                      {newPassword && confirmPassword && newPassword !== confirmPassword && (
                        <p className="text-xs text-destructive">Passwords do not match</p>
                      )}
                      {newPassword && confirmPassword && newPassword === confirmPassword && (
                        <p className="text-xs text-green-500 flex items-center gap-1"><Check className="h-3 w-3" />Passwords match</p>
                      )}
                    </div>

                    {/* Password strength hint */}
                    <div className="p-3 bg-muted/40 rounded-lg border border-border text-xs text-muted-foreground space-y-1">
                      <p className="font-semibold text-foreground mb-1.5">Password requirements:</p>
                      <p className={cn("flex items-center gap-1.5", newPassword.length >= 8 ? "text-green-500" : "")}>
                        <Check className={cn("h-3 w-3", newPassword.length >= 8 ? "text-green-500" : "text-muted-foreground")} />
                        At least 8 characters
                      </p>
                    </div>
                  </div>
                  <div className="px-6 py-4 border-t border-border flex justify-end gap-2 bg-muted/20 shrink-0">
                    <Button variant="outline" onClick={() => { setShowEditDialog(false) }}>Cancel</Button>
                    <Button onClick={handleSavePassword} disabled={isSavingPassword}>
                      <KeyRound className="h-4 w-4 mr-1.5" />{isSavingPassword ? "Changing..." : "Change Password"}
                    </Button>
                  </div>
                </>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </PageWrapper>
  )
}