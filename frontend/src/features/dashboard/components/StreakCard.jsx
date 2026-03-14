export function StreakCard({ streak }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-2xl">🔥</span>
      <div>
        <p className="text-2xl font-extrabold text-foreground leading-none">{streak}</p>
        <p className="text-xs text-muted-foreground">day streak</p>
      </div>
    </div>
  )
}