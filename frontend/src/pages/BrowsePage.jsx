import { useState }       from 'react'
import { useClasses }     from '@/features/classes'
import { ClassCard }      from '@/features/classes/components/ClassCard'
import { PageWrapper }    from '@/components/layout/PageWrapper'
import { Input }          from '@/components/ui/input'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { useDebounce }    from '@/hooks/useDebounce'
import { copyClass }      from '@/features/classes/api/classes'
import { Search, BookOpen } from 'lucide-react'

export default function BrowsePage() {
  const [query, setQuery] = useState('')
  const debouncedQuery    = useDebounce(query, 300)
  const { classes, isLoading } = useClasses({ q: debouncedQuery })

  const handleCopy = async (id) => {
    await copyClass(id)
    alert('Class copied to your library!')
  }

  return (
    <PageWrapper>
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-foreground mb-1">Browse Classes</h1>
        <p className="text-muted-foreground">Discover study classes made by the community.</p>
      </div>

      {/* Search */}
      <div className="relative max-w-md mb-8">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search classes..."
          className="pl-9"
        />
      </div>

      {isLoading ? (
        <LoadingSpinner />
      ) : classes.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">
          <BookOpen className="h-10 w-10 mx-auto mb-3 opacity-30" />
          <p className="text-sm">No classes found.</p>
        </div>
      ) : (
        <>
          <p className="text-sm text-muted-foreground mb-4">
            {classes.length} class{classes.length !== 1 ? 'es' : ''} found
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {classes.map((cls) => (
              <ClassCard key={cls._id} cls={cls} onCopy={handleCopy} />
            ))}
          </div>
        </>
      )}
    </PageWrapper>
  )
}