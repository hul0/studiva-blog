"use client"

import { useState } from "react"
import { Copy, Check } from "lucide-react"

export function CopyButton({ content }: { content: string }) {
  const [isCopied, setIsCopied] = useState(false)

  const copy = async () => {
    await navigator.clipboard.writeText(content)
    setIsCopied(true)
    setTimeout(() => setIsCopied(false), 2000)
  }

  return (
    <button
      onClick={copy}
      className="absolute top-3 right-3 h-8 w-8 flex items-center justify-center rounded-md border border-border bg-background/50 text-muted-foreground backdrop-blur-sm transition-all hover:bg-background hover:text-foreground active:scale-95"
      aria-label="Copy code"
    >
      {isCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
    </button>
  )
}
