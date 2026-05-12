"use client"

import { Search } from "lucide-react"

export function SearchTriggerButton({ className }: { className?: string }) {
  return (
    <button
      onClick={() =>
        document.dispatchEvent(
          new KeyboardEvent("keydown", { key: "k", metaKey: true })
        )
      }
      className={className}
    >
      <Search className="h-4 w-4" />
      Quick Search
    </button>
  )
}
