"use client"

import { useState } from "react"

export function NewsletterForm() {
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus("loading")
    
    // Simulate API call
    setTimeout(() => {
      setStatus("success")
      setEmail("")
    }, 1000)
  }

  if (status === "success") {
    return (
      <div className="flex flex-col items-center justify-center py-4 animate-in zoom-in duration-300">
        <div className="rounded-full bg-green-500/10 p-2 mb-3">
          <svg className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <p className="text-sm font-bold text-green-600">Welcome to the circle!</p>
      </div>
    )
  }

  return (
    <form className="flex flex-col sm:flex-row gap-3" onSubmit={handleSubmit}>
      <input
        type="email"
        placeholder="your@email.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="flex-1 rounded-xl border border-border bg-muted/30 px-5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
        required
        disabled={status === "loading"}
      />
      <button
        type="submit"
        disabled={status === "loading"}
        className="rounded-xl bg-foreground px-8 py-3 text-xs font-bold uppercase tracking-widest text-background transition-all hover:opacity-90 active:scale-95 disabled:opacity-50"
      >
        {status === "loading" ? "Joining..." : "Subscribe"}
      </button>
    </form>
  )
}
