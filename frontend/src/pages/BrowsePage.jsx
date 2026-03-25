import { useState } from "react";
import { useClasses } from "@/features/classes";
import { ClassCard } from "@/features/classes/components/ClassCard";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { Input } from "@/components/ui/input";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { useDebounce } from "@/hooks/useDebounce";
import { copyClass } from "@/features/classes/api/classes";
import { useAuthStore } from "@/features/auth/store/authStore";
import { Search, BookOpen, Check } from "lucide-react";

export default function BrowsePage() {
  const [query, setQuery] = useState("");
  const [copiedId, setCopiedId] = useState(null);
  const debouncedQuery = useDebounce(query, 300);
  const user = useAuthStore((s) => s.user);

  // Fetch all public + owned classes
  const { classes, isLoading } = useClasses({ q: debouncedQuery });

  // Only show public classes not owned by current user
  const publicClasses = classes.filter(
    (c) => c.isPublic && c.owner?._id !== user?._id && c.owner !== user?._id,
  );

  const handleCopy = async (id) => {
    try {
      await copyClass(id);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error("Failed to copy class:", err);
    }
  };

  return (
    <PageWrapper>
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-foreground mb-1">
          Browse Classes
        </h1>
        <p className="text-muted-foreground">
          Discover study classes made by the community.
        </p>
      </div>

      {/* Search */}
      <div className="relative max-w-md mb-8">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search public classes..."
          className="pl-9"
        />
      </div>

      {isLoading ? (
        <LoadingSpinner />
      ) : publicClasses.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground border border-dashed border-border rounded-2xl">
          <BookOpen className="h-10 w-10 mx-auto mb-3 opacity-30" />
          <p className="text-sm mb-1">
            No public classes from other users yet.
          </p>
          <p className="text-xs opacity-60">
            {query
              ? "Try a different search term."
              : "When other users share public classes they will appear here."}
          </p>
        </div>
      ) : (
        <>
          <p className="text-sm text-muted-foreground mb-4">
            {publicClasses.length} public class
            {publicClasses.length !== 1 ? "es" : ""} found
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {publicClasses.map((cls) => (
              <ClassCard
                key={cls._id}
                cls={cls}
                onCopy={handleCopy}
                copyLabel={copiedId === cls._id ? "Copied!" : "Copy"}
                copyIcon={copiedId === cls._id ? Check : null}
              />
            ))}
          </div>
        </>
      )}
    </PageWrapper>
  );
}
