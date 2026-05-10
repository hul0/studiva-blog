"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { Search, X } from "lucide-react"
import { useState, useEffect, useCallback } from "react"

interface SearchFilterProps {
  tags: string[]
  categories: string[]
}

export function SearchFilter({ tags, categories }: SearchFilterProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [search, setSearch] = useState(searchParams.get("search") || "")
  const activeTag = searchParams.get("tag") || ""
  const activeCategory = searchParams.get("category") || ""

  const updateParams = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      if (value) {
        params.set(key, value)
      } else {
        params.delete(key)
      }
      params.delete("page") // Reset pagination
      router.push(`/blog?${params.toString()}`, { scroll: false })
    },
    [router, searchParams]
  )

  // Debounced search update
  useEffect(() => {
    // Only update if search value is different from current URL param
    const currentSearch = searchParams.get("search") || ""
    if (search === currentSearch) return

    const timer = setTimeout(() => {
      // Re-verify before pushing to avoid race conditions
      const latestSearch = new URLSearchParams(window.location.search).get("search") || ""
      if (search !== latestSearch) {
        updateParams("search", search)
      }
    }, 400)
    return () => clearTimeout(timer)
  }, [search, updateParams, searchParams])

  // Focus search on ?focus=search
  useEffect(() => {
    if (searchParams.get("focus") === "search") {
      document.getElementById("blog-search")?.focus()
    }
  }, [searchParams])

  function clearFilters() {
    setSearch("")
    router.push("/blog", { scroll: false })
  }

  const hasFilters = search || activeTag || activeCategory

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          id="blog-search"
          type="text"
          placeholder="Search articles..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-10 w-full rounded-lg border border-border bg-background pl-10 pr-10 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
        />
        {search && (
          <button
            onClick={() => setSearch("")}
            className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            aria-label="Clear search"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        {/* Categories */}
        {categories.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="mr-1 text-xs font-medium text-muted-foreground">
              Category:
            </span>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() =>
                  updateParams("category", activeCategory === cat ? "" : cat)
                }
                className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                  activeCategory === cat
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* Tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 min-w-0">
            <span className="mr-1 text-xs font-medium text-muted-foreground whitespace-nowrap">
              Tags:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {tags.slice(0, 10).map((tag) => (
                <button
                  key={tag}
                  onClick={() =>
                    updateParams("tag", activeTag === tag ? "" : tag)
                  }
                  className={`rounded-full px-3 py-1 text-[10px] font-medium transition-colors ${
                    activeTag === tag
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  }`}
                >
                  #{tag}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Clear */}
      {hasFilters && (
        <button
          onClick={clearFilters}
          className="text-xs text-muted-foreground underline underline-offset-2 hover:text-foreground"
        >
          Clear all filters
        </button>
      )}
    </div>
  )
}
