"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { Search, X, Filter, Hash, Tag } from "lucide-react"
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
    const currentSearch = searchParams.get("search") || ""
    if (search === currentSearch) return

    const timer = setTimeout(() => {
      const latestSearch = new URLSearchParams(window.location.search).get("search") || ""
      if (search !== latestSearch) {
        updateParams("search", search)
      }
    }, 400)
    return () => clearTimeout(timer)
  }, [search, updateParams, searchParams])

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
    <div className="space-y-8 animate-in fade-in slide-in-from-top-4 duration-700">
      {/* Premium Search Bar */}
      <div className="relative group max-w-2xl mx-auto">
        <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-focus-within:opacity-50" />
        <div className="relative flex items-center bg-background border border-border/50 rounded-2xl shadow-sm transition-all group-focus-within:border-primary/50 group-focus-within:ring-4 group-focus-within:ring-primary/5">
          <Search className="ml-5 h-5 w-5 text-muted-foreground transition-colors group-focus-within:text-primary" />
          <input
            id="blog-search"
            type="text"
            placeholder="Search the journal archive..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-14 w-full bg-transparent px-4 text-base text-foreground placeholder:text-muted-foreground/60 focus:outline-none"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="mr-4 p-1 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-all"
              aria-label="Clear search"
            >
              <X className="h-5 w-5" />
            </button>
          )}
          <div className="mr-5 hidden sm:flex items-center gap-1 px-2 py-1 rounded-md bg-muted/50 border border-border/50 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
            <span className="opacity-60">⌘</span>K
          </div>
        </div>
      </div>

      {/* Filter Chips */}
      <div className="flex flex-col gap-6">
        {/* Categories */}
        {categories.length > 0 && (
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60 px-1">
              <Filter className="h-3 w-3" />
              Browse by Category
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => updateParams("category", "")}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all active:scale-95 border ${
                  !activeCategory
                    ? "bg-foreground text-background border-foreground shadow-lg shadow-foreground/10"
                    : "bg-background text-muted-foreground border-border/50 hover:border-border hover:text-foreground"
                }`}
              >
                All Articles
              </button>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => updateParams("category", activeCategory === cat ? "" : cat)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all active:scale-95 border ${
                    activeCategory === cat
                      ? "bg-foreground text-background border-foreground shadow-lg shadow-foreground/10"
                      : "bg-background text-muted-foreground border-border/50 hover:border-border hover:text-foreground"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Tags */}
        {tags.length > 0 && (
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60 px-1">
              <Hash className="h-3 w-3" />
              Popular Tags
            </div>
            <div className="flex flex-wrap gap-2">
              {tags.slice(0, 15).map((tag) => (
                <button
                  key={tag}
                  onClick={() => updateParams("tag", activeTag === tag ? "" : tag)}
                  className={`group flex items-center gap-2 px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all active:scale-95 border ${
                    activeTag === tag
                      ? "bg-primary/10 text-primary border-primary/20"
                      : "bg-background text-muted-foreground border-border/50 hover:border-border hover:text-foreground"
                  }`}
                >
                  <Tag className={`h-3 w-3 transition-transform ${activeTag === tag ? "scale-110" : "opacity-40 group-hover:opacity-100"}`} />
                  {tag}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Clear State */}
      {hasFilters && (
        <div className="flex items-center justify-center pt-4">
          <button
            onClick={clearFilters}
            className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-muted/50 text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:bg-muted hover:text-foreground transition-all border border-border/20"
          >
            <X className="h-3 w-3" />
            Reset all filters
          </button>
        </div>
      )}
    </div>
  )
}
