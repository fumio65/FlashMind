import { useState, useEffect, useRef } from 'react'
import { useNavigate }         from 'react-router-dom'
import { useForm }             from 'react-hook-form'
import { zodResolver }         from '@hookform/resolvers/zod'
import { z }                   from 'zod'
import { useCreateClass }      from '@/features/classes'
import { IconPicker }          from '@/features/classes/components/IconPicker'
import { ClassIcon }           from '@/features/classes/components/ClassIcon'
import { PageWrapper }         from '@/components/layout/PageWrapper'
import { Button }              from '@/components/ui/button'
import { Input }               from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { CLASS_COLORS }        from '@/features/classes/api/classes'
import { cn }                  from '@/lib/utils'
import { ArrowLeft, AlertTriangle } from 'lucide-react'

const schema = z.object({
  name:        z.string().min(2, 'Name must be at least 2 characters'),
  description: z.string().optional(),
  isPublic:    z.boolean(),
})

export default function CreateClassPage() {
  const navigate                                = useNavigate()
  const { submit, isLoading, error }            = useCreateClass()
  const [icon, setIcon]                         = useState({ type: 'emoji', value: '📚' })
  const [color, setColor]                       = useState(CLASS_COLORS[0].value)
  const [isPublic, setIsPublic]                 = useState(false)
  const [previewName, setPreviewName]           = useState('')
  const [showLeaveWarning, setShowLeaveWarning] = useState(false)

  // Refs to always have latest values in keyboard handlers
  const iconRef     = useRef(icon)
  const colorRef    = useRef(color)
  const isPublicRef = useRef(isPublic)

  useEffect(() => { iconRef.current     = icon     }, [icon])
  useEffect(() => { colorRef.current    = color    }, [color])
  useEffect(() => { isPublicRef.current = isPublic }, [isPublic])

  const { register, handleSubmit, setValue, getValues, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { isPublic: false },
  })

  const onSubmit = (data) => {
    submit({ ...data, icon: iconRef.current, color: colorRef.current, isPublic: isPublicRef.current })
  }

  // Esc → show leave warning
  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape') {
        if (showLeaveWarning) return
        e.stopPropagation()
        setShowLeaveWarning(true)
      }
    }
    window.addEventListener('keydown', handler, true)
    return () => window.removeEventListener('keydown', handler, true)
  }, [showLeaveWarning])

  // Ctrl+S → submit form using latest refs
  useEffect(() => {
    const handler = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault()
        if (showLeaveWarning) return
        handleSubmit((data) => {
          submit({
            ...data,
            icon:     iconRef.current,
            color:    colorRef.current,
            isPublic: isPublicRef.current,
          })
        })()
      }
    }
    window.addEventListener('keydown', handler, true)
    return () => window.removeEventListener('keydown', handler, true)
  }, [showLeaveWarning])

  // Leave Warning dialog: Esc = stay, Q = leave
  useEffect(() => {
    if (!showLeaveWarning) return
    const handler = (e) => {
      if (e.key === 'Escape') {
        e.stopPropagation()
        setShowLeaveWarning(false)
      }
      if (e.key === 'q' || e.key === 'Q') {
        e.stopPropagation()
        navigate('/dashboard')
      }
    }
    window.addEventListener('keydown', handler, true)
    return () => window.removeEventListener('keydown', handler, true)
  }, [showLeaveWarning])

  return (
    <PageWrapper>
      <div className="max-w-2xl mx-auto">

        {/* Back button */}
        <Button
          variant="ghost" size="sm"
          className="mb-4 -ml-2"
          onClick={() => setShowLeaveWarning(true)}
        >
          <ArrowLeft className="h-4 w-4 mr-1" />Dashboard
          <kbd className="ml-2 text-[10px] bg-muted px-1.5 py-0.5 rounded opacity-60">Esc</kbd>
        </Button>

        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-foreground mb-1">Create New Subject</h1>
          <p className="text-muted-foreground">
            Group your lesson decks under a subject for organized studying.
          </p>
        </div>

        {error && (
          <div className="mb-6 bg-destructive/10 text-destructive text-sm px-4 py-3 rounded-md">
            {error}
          </div>
        )}

        {/* Live Preview */}
        <div className={cn('rounded-2xl h-32 mb-6 flex items-center px-6 gap-4 bg-gradient-to-br', color)}>
          <ClassIcon icon={icon} size="lg" />
          <div>
            <p className="text-white/60 text-xs mb-1">Preview</p>
            <p className="text-white font-bold text-lg">
              {previewName.trim() || 'Your Subject Name'}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">

          {/* Subject Info */}
          <Card>
            <CardHeader><CardTitle>Subject Info</CardTitle></CardHeader>
            <CardContent className="flex flex-col gap-4">

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium">Subject Name</label>
                <Input
                  {...register('name')}
                  placeholder="e.g. Data Structures, Calculus, Philippine History"
                  onChange={(e) => {
                    setPreviewName(e.target.value)
                    register('name').onChange(e)
                  }}
                />
                {errors.name && (
                  <p className="text-destructive text-xs">{errors.name.message}</p>
                )}
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium">
                  Description{' '}
                  <span className="text-muted-foreground font-normal">(optional)</span>
                </label>
                <textarea
                  {...register('description')}
                  placeholder="e.g. Topics and lessons covered in this subject"
                  rows={3}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring placeholder:text-muted-foreground"
                />
              </div>

              {/* Visibility toggle */}
              <div className="flex items-center justify-between pt-2 border-t border-border">
                <div>
                  <p className="text-sm font-medium">Make Public</p>
                  <p className="text-xs text-muted-foreground">
                    Share this subject with the community
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const next = !isPublic
                    setIsPublic(next)
                    setValue('isPublic', next)
                  }}
                  className={cn(
                    'relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none',
                    isPublic ? 'bg-primary' : 'bg-muted-foreground/30'
                  )}
                >
                  <span className={cn(
                    'inline-block h-4 w-4 transform rounded-full bg-white shadow-md transition-transform',
                    isPublic ? 'translate-x-6' : 'translate-x-1'
                  )} />
                </button>
              </div>
            </CardContent>
          </Card>

          {/* Accent Color */}
          <Card>
            <CardHeader><CardTitle>Accent Color</CardTitle></CardHeader>
            <CardContent>
              <div className="flex gap-3 flex-wrap">
                {CLASS_COLORS.map((c) => (
                  <button
                    key={c.value}
                    type="button"
                    onClick={() => setColor(c.value)}
                    className={cn(
                      'h-10 w-10 rounded-xl bg-gradient-to-br transition-all',
                      c.value,
                      color === c.value
                        ? 'ring-2 ring-offset-2 ring-primary scale-110'
                        : 'hover:scale-105'
                    )}
                    title={c.label}
                  />
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Icon Picker */}
          <Card>
            <CardHeader><CardTitle>Subject Icon</CardTitle></CardHeader>
            <CardContent>
              <IconPicker value={icon} onChange={setIcon} />
            </CardContent>
          </Card>

          {/* Keyboard hints */}
          <div className="flex items-center gap-4 text-xs text-muted-foreground px-1">
            <span className="flex items-center gap-1.5">
              <kbd className="px-1.5 py-0.5 bg-muted rounded">Ctrl+S</kbd>
              <span>Create subject</span>
            </span>
            <span className="flex items-center gap-1.5">
              <kbd className="px-1.5 py-0.5 bg-muted rounded">Esc</kbd>
              <span>Back to dashboard</span>
            </span>
          </div>

          <Button type="submit" size="lg" disabled={isLoading}>
            {isLoading ? 'Creating...' : 'Create Subject'}
            <kbd className="ml-2 text-[10px] bg-white/20 px-1.5 py-0.5 rounded opacity-70">Ctrl+S</kbd>
          </Button>
        </form>
      </div>

      {/* ── Leave Warning Dialog ── */}
      <Dialog open={showLeaveWarning} onOpenChange={setShowLeaveWarning}>
        <DialogContent className="max-w-sm p-0 overflow-hidden">
          <div className="bg-destructive/10 border-b border-destructive/20 px-6 py-5">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-destructive/15 rounded-xl">
                <AlertTriangle className="h-5 w-5 text-destructive" />
              </div>
              <div>
                <DialogTitle className="text-base font-bold text-destructive">
                  Leave Page?
                </DialogTitle>
                <p className="text-xs text-destructive/70 mt-0.5">
                  Your unsaved subject will be lost
                </p>
              </div>
            </div>
          </div>
          <div className="px-6 py-5">
            <p className="text-sm text-muted-foreground">
              Are you sure you want to leave? Any unsaved changes will be lost.
            </p>
          </div>
          <div className="px-6 py-4 border-t border-border flex justify-end gap-2 bg-muted/20">
            <Button variant="outline" onClick={() => setShowLeaveWarning(false)}>
              Stay &amp; Keep Editing
              <kbd className="ml-2 text-[10px] bg-muted px-1.5 py-0.5 rounded opacity-70">Esc</kbd>
            </Button>
            <Button variant="destructive" onClick={() => navigate('/dashboard')}>
              Leave Without Saving
              <kbd className="ml-2 text-[10px] bg-white/20 px-1.5 py-0.5 rounded opacity-70">Q</kbd>
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </PageWrapper>
  )
}