"use client"

import { useState, useEffect } from "react"
import { Type, Check } from "lucide-react"
import { cn } from "@/lib/utils"

export function ReadingMoodToggle() {
  const [font, setFont] = useState<"sans" | "serif">("sans")
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const savedFont = localStorage.getItem("reading-font") as "sans" | "serif"
    if (savedFont) {
      setFont(savedFont)
      document.documentElement.dataset.readingFont = savedFont
    }
  }, [])

  const toggleFont = (newFont: "sans" | "serif") => {
    setFont(newFont)
    document.documentElement.dataset.readingFont = newFont
    localStorage.setItem("reading-font", newFont)
    setIsOpen(false)
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
        aria-label="Typography settings"
        title="Typography settings"
      >
        <Type className="h-4 w-4" />
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)} 
          />
          <div className="absolute bottom-full right-0 z-50 mb-2 w-48 rounded-xl border border-border bg-background p-2 shadow-xl animate-in fade-in slide-in-from-bottom-2">
            <p className="mb-2 px-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              Reading Font
            </p>
            <div className="space-y-1">
              <button
                onClick={() => toggleFont("sans")}
                className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors hover:bg-accent"
              >
                <span className="font-sans">Modern Sans</span>
                {font === "sans" && <Check className="h-3.5 w-3.5" />}
              </button>
              <button
                onClick={() => toggleFont("serif")}
                className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors hover:bg-accent"
              >
                <span className="font-serif">Classic Serif</span>
                {font === "serif" && <Check className="h-3.5 w-3.5" />}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
