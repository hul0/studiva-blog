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
    <nav aria-label="Table of contents" className="space-y-4 py-4">
      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-foreground/40">
        Table of Contents
      </p>
      <ul className="space-y-0.5">
        {headings.map((heading) => (
          <li key={heading.id} className="relative">
            <a
              href={`#${heading.id}`}
              className={cn(
                "block py-2 text-sm transition-all duration-300",
                heading.level === 2 && "pl-0",
                heading.level === 3 && "pl-4 text-xs",
                heading.level === 4 && "pl-8 text-[11px]",
                heading.level === 5 && "pl-10 text-[10px]",
                heading.level === 6 && "pl-12 text-[10px]",
                activeId === heading.id
                  ? "font-bold text-primary translate-x-1"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {heading.text}
            </a>
            {activeId === heading.id && (
               <div className="absolute left-[-1rem] top-1/2 -translate-y-1/2 w-1 h-1 rounded-full bg-primary" />
            )}
          </li>
        ))}
      </ul>
    </nav>
  )
}
