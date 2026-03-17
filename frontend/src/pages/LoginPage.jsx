import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useLogin } from '@/features/auth'
import { useAuthStore } from '@/features/auth/store/authStore'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { BookOpen, LogIn } from 'lucide-react'

const schema = z.object({
  email:    z.string().email('Enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
})

export default function LoginPage() {
  const { login, isLoading, error } = useLogin()
  const authUser                    = useAuthStore((s) => s.user)
  const navigate                    = useNavigate()

  useEffect(() => {
    if (authUser) navigate('/dashboard', { replace: true })
  }, [authUser])

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema) })

  return (
    <div className="min-h-screen grid md:grid-cols-2">
      {/* Left panel */}
      <div className="hidden md:flex flex-col justify-between bg-primary text-primary-foreground p-12">
        <div className="flex items-center gap-2 font-bold text-xl">
          <BookOpen className="h-6 w-6" />
          FlashMind
        </div>
        <div>
          <h2 className="text-4xl font-extrabold leading-tight mb-4">
            Welcome back. <br /> Let's get studying.
          </h2>
          <p className="text-primary-foreground/75 text-lg">
            Pick up right where you left off. Your decks, your progress, your streak — all waiting for you.
          </p>
        </div>
        <p className="text-primary-foreground/50 text-sm">© {new Date().getFullYear()} FlashMind</p>
      </div>

      {/* Right panel */}
      <div className="flex items-center justify-center px-6 py-12 bg-background">
        <div className="w-full max-w-sm">
          <div className="flex items-center gap-2 font-bold text-xl text-primary mb-8 md:hidden">
            <BookOpen className="h-6 w-6" />
            FlashMind
          </div>

          <h1 className="text-2xl font-bold text-foreground mb-1">Sign in</h1>
          <p className="text-muted-foreground text-sm mb-8">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary font-medium hover:underline">
              Sign up free
            </Link>
          </p>

          <form onSubmit={handleSubmit(login)} className="flex flex-col gap-4">
            {error && (
              <div className="bg-destructive/10 text-destructive text-sm px-4 py-3 rounded-md">
                {error}
              </div>
            )}

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-foreground">Email</label>
              <Input
                {...register('email')}
                type="email"
                placeholder="juan@example.com"
                autoComplete="email"
              />
              {errors.email && (
                <p className="text-destructive text-xs">{errors.email.message}</p>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-foreground">Password</label>
                <span className="text-xs text-muted-foreground cursor-pointer hover:text-primary">
                  Forgot password?
                </span>
              </div>
              <Input
                {...register('password')}
                type="password"
                placeholder="••••••••"
                autoComplete="current-password"
              />
              {errors.password && (
                <p className="text-destructive text-xs">{errors.password.message}</p>
              )}
            </div>

            <Button type="submit" disabled={isLoading} className="mt-2">
              <LogIn className="h-4 w-4 mr-2" />
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          {/* Demo accounts */}
          <div className="mt-8 p-4 bg-muted rounded-lg text-xs text-muted-foreground space-y-1">
            <p className="font-semibold text-foreground">Demo accounts</p>
            <p>Student — juan@example.com / password123</p>
            <p>Admin — admin@example.com / password123</p>
          </div>
        </div>
      </div>
    </div>
  )
}