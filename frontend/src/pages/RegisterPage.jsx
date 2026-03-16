import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useRegister } from '@/features/auth'
import { useAuthStore } from '@/features/auth/store/authStore'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { BookOpen, UserPlus } from 'lucide-react'

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(20, 'Username must be 20 characters or less')
    .regex(/^[a-zA-Z0-9_]+$/, 'Only letters, numbers, and underscores'),
  email:           z.string().email('Enter a valid email address'),
  password:        z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path:    ['confirmPassword'],
})

export default function RegisterPage() {
  const { register: registerUser, isLoading, error } = useRegister()
  const authUser                                      = useAuthStore((s) => s.user)
  const navigate                                      = useNavigate()

  useEffect(() => {
    if (authUser) navigate('/dashboard', { replace: true })
  }, [authUser])

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema) })

  const onSubmit = ({ confirmPassword: _, ...data }) => registerUser(data)

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
            Start studying <br /> smarter today.
          </h2>
          <p className="text-primary-foreground/75 text-lg">
            Create your free account and get access to thousands of decks made by Filipino students, just like you.
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

          <h1 className="text-2xl font-bold text-foreground mb-1">Create account</h1>
          <p className="text-muted-foreground text-sm mb-8">
            Already have an account?{' '}
            <Link to="/login" className="text-primary font-medium hover:underline">
              Sign in
            </Link>
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            {error && (
              <div className="bg-destructive/10 text-destructive text-sm px-4 py-3 rounded-md">
                {error}
              </div>
            )}

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-foreground">Full Name</label>
              <Input
                {...register('name')}
                placeholder="Juan dela Cruz"
                autoComplete="name"
              />
              {errors.name && (
                <p className="text-destructive text-xs">{errors.name.message}</p>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-foreground">Username</label>
              <Input
                {...register('username')}
                placeholder="juandc"
                autoComplete="username"
              />
              {errors.username && (
                <p className="text-destructive text-xs">{errors.username.message}</p>
              )}
            </div>

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
              <label className="text-sm font-medium text-foreground">Password</label>
              <Input
                {...register('password')}
                type="password"
                placeholder="Min. 8 characters"
                autoComplete="new-password"
              />
              {errors.password && (
                <p className="text-destructive text-xs">{errors.password.message}</p>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-foreground">Confirm Password</label>
              <Input
                {...register('confirmPassword')}
                type="password"
                placeholder="••••••••"
                autoComplete="new-password"
              />
              {errors.confirmPassword && (
                <p className="text-destructive text-xs">{errors.confirmPassword.message}</p>
              )}
            </div>

            <Button type="submit" disabled={isLoading} className="mt-2">
              <UserPlus className="h-4 w-4 mr-2" />
              {isLoading ? 'Creating account...' : 'Create Account'}
            </Button>

            <p className="text-xs text-muted-foreground text-center">
              By signing up, you agree to our{' '}
              <span className="text-primary cursor-pointer hover:underline">Terms of Service</span>
              {' '}and{' '}
              <span className="text-primary cursor-pointer hover:underline">Privacy Policy</span>.
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}