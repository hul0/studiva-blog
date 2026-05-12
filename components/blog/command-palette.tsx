"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Search, FileText, Tag, Hash, Loader2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"

interface SearchResult {
  _id: string
  title: string
  slug: string
  category: string
}

export function CommandPalette() {
  const [open, setOpen] = React.useState(false)
  const [query, setQuery] = React.useState("")
  const [results, setResults] = React.useState<SearchResult[]>([])
  const [loading, setLoading] = React.useState(false)
  const router = useRouter()

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }

    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  React.useEffect(() => {
    if (!query) {
      setResults([])
      return
    }

    const search = async () => {
      setLoading(true)
      try {
        const res = await fetch(`/api/blogs?search=${encodeURIComponent(query)}&limit=5`)
        const data = await res.json()
        setResults(data.blogs || [])
      } catch (error) {
        console.error("Search failed:", error)
      } finally {
        setLoading(false)
      }
    }

    const debounce = setTimeout(search, 300)
    return () => clearTimeout(debounce)
  }, [query])

  const onSelect = (slug: string) => {
    setOpen(false)
    router.push(`/blog/${slug}`)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-2xl p-0 overflow-hidden border-none bg-transparent shadow-2xl">
        <div className="relative flex flex-col overflow-hidden rounded-xl border border-border/50 bg-background/95 backdrop-blur-xl">
          <div className="flex items-center border-b border-border/50 px-4 py-4">
            <Search className="mr-3 h-5 w-5 text-muted-foreground" />
            <input
              autoFocus
              placeholder="Search articles, tags, categories..."
              className="flex-1 bg-transparent text-lg outline-none placeholder:text-muted-foreground"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            {loading ? (
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            ) : (
              <div className="hidden items-center gap-1 rounded border border-border/50 bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground sm:flex">
                <span className="text-xs">ESC</span>
              </div>
            )}
          </div>

          <div className="max-h-[400px] overflow-y-auto p-2">
            {results.length > 0 ? (
              <div className="space-y-1">
                <p className="px-2 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Articles
                </p>
                {results.map((result) => (
                  <button
                    key={result._id}
                    onClick={() => onSelect(result.slug)}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left transition-colors hover:bg-accent"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10 text-primary">
                      <FileText className="h-4 w-4" />
                    </div>
                    <div className="flex flex-1 flex-col overflow-hidden">
                      <span className="truncate font-medium text-foreground">
                        {result.title}
                      </span>
                      <span className="truncate text-xs text-muted-foreground">
                        {result.category}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            ) : query ? (
              <div className="py-12 text-center">
                <p className="text-sm text-muted-foreground">No results found for "{query}"</p>
              </div>
            ) : (
              <div className="py-12 text-center space-y-4">
                <div className="flex justify-center gap-8">
                  <div className="flex flex-col items-center gap-2">
                     <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                        <Tag className="h-5 w-5 text-muted-foreground" />
                     </div>
                     <span className="text-[10px] font-medium text-muted-foreground uppercase">Tags</span>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                     <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                        <Hash className="h-5 w-5 text-muted-foreground" />
                     </div>
                     <span className="text-[10px] font-medium text-muted-foreground uppercase">Topics</span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">Type something to search the blog...</p>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between border-t border-border/50 bg-muted/30 px-4 py-2.5">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <kbd className="rounded border border-border/50 bg-background px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                  ↵
                </kbd>
                <span className="text-[10px] text-muted-foreground">Select</span>
              </div>
              <div className="flex items-center gap-1.5">
                <kbd className="rounded border border-border/50 bg-background px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                  ↑↓
                </kbd>
                <span className="text-[10px] text-muted-foreground">Navigate</span>
              </div>
            </div>
            <span className="text-[10px] text-muted-foreground font-medium">Studiva Search</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
