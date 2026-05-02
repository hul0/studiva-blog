"use client"

import { useActiveHeading } from "@/hooks/use-active-heading"
import { cn } from "@/lib/utils"

interface Heading {
  id: string
  text: string
  level: number
}

interface TableOfContentsProps {
  headings: Heading[]
}

export function TableOfContents({ headings }: TableOfContentsProps) {
  const activeId = useActiveHeading(headings.map((h) => h.id))

  if (headings.length === 0) return null

  return (
    <nav aria-label="Table of contents" className="space-y-1">
      <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-foreground">
        On this page
      </p>
      <ul className="space-y-1">
        {headings.map((heading) => (
          <li key={heading.id}>
            <a
              href={`#${heading.id}`}
              className={cn(
                "block border-l-2 py-1 text-sm transition-all duration-200",
                heading.level === 2 && "pl-3",
                heading.level === 3 && "pl-5",
                heading.level === 4 && "pl-7",
                activeId === heading.id
                  ? "border-primary font-medium text-primary"
                  : "border-transparent text-muted-foreground hover:border-border hover:text-foreground"
              )}
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
