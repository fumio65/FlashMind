import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/features/auth/store/authStore'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Navbar } from '@/components/layout/Navbar'
import {
  BookOpen, Brain, Trophy, Users,
  Zap, RotateCcw, ClipboardList, TrendingUp,
} from 'lucide-react'

const features = [
  {
    icon: RotateCcw,
    title: 'Flashcard Mode',
    description: 'Flip through cards, mark what you know, and focus on what needs more review.',
    color: 'text-blue-500',
    bg: 'bg-blue-50',
  },
  {
    icon: ClipboardList,
    title: 'Quiz Mode',
    description: 'Test yourself with auto-generated multiple choice questions and a 30-second timer.',
    color: 'text-purple-500',
    bg: 'bg-purple-50',
  },
  {
    icon: TrendingUp,
    title: 'Track Progress',
    description: 'Monitor your study streak, cards mastered, and weekly activity at a glance.',
    color: 'text-green-500',
    bg: 'bg-green-50',
  },
]

const stats = [
  { value: '10,000+', label: 'Flashcard Decks'  },
  { value: '50,000+', label: 'Active Students'  },
  { value: '98%',     label: 'Pass Rate'         },
  { value: '4.9★',    label: 'Average Rating'   },
]

export default function LandingPage() {
  const user     = useAuthStore((s) => s.user)
  const navigate = useNavigate()

  useEffect(() => {
    if (user) navigate('/dashboard', { replace: true })
  }, [user])

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-4 py-24 text-center">
        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary rounded-full px-4 py-1.5 text-sm font-medium mb-6">
          <Zap className="h-4 w-4" />
          Built for Filipino university students
        </div>

        <h1 className="text-5xl font-extrabold tracking-tight text-foreground mb-6 leading-tight">
          Study smarter with <br />
          <span className="text-primary">FlashMind</span>
        </h1>

        <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
          Create, share, and study flashcard decks with interactive modes
          designed to help you retain more and stress less before exams.
        </p>

        <div className="flex items-center justify-center gap-4 flex-wrap">
          <Button size="lg" asChild>
            <Link to="/register">Get Started Free</Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link to="/browse">Browse Decks</Link>
          </Button>
        </div>
      </section>

      {/* Stats bar */}
      <section className="border-y bg-muted/40">
        <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map(({ value, label }) => (
            <div key={label}>
              <p className="text-3xl font-extrabold text-foreground">{value}</p>
              <p className="text-sm text-muted-foreground mt-1">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 py-24">
        <div className="text-center mb-14">
          <h2 className="text-3xl font-bold text-foreground mb-3">
            Everything you need to ace your exams
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Two powerful study modes, progress tracking, and a community deck library.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map(({ icon: Icon, title, description, color, bg }) => (
            <Card key={title} className="border shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-8">
                <div className={`inline-flex p-3 rounded-xl ${bg} mb-5`}>
                  <Icon className={`h-7 w-7 ${color}`} />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">{title}</h3>
                <p className="text-muted-foreground leading-relaxed">{description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary text-primary-foreground">
        <div className="max-w-7xl mx-auto px-4 py-20 text-center">
          <Brain className="h-12 w-12 mx-auto mb-5 opacity-90" />
          <h2 className="text-3xl font-bold mb-4">Ready to start studying smarter?</h2>
          <p className="text-primary-foreground/80 text-lg mb-8 max-w-lg mx-auto">
            Join thousands of Filipino students already using FlashMind to prepare for their exams.
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Button size="lg" variant="secondary" asChild>
              <Link to="/register">Create Free Account</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-primary-foreground/40 text-primary-foreground hover:bg-primary-foreground/10"
              asChild
            >
              <Link to="/login">Log In</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 py-8 flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            <span className="font-semibold">FlashMind</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            <span>Made for Filipino students</span>
          </div>
          <p>© {new Date().getFullYear()} FlashMind. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}