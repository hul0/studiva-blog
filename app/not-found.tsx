"use client"

import Link from "next/link"
import { Search, Home, ArrowLeft } from "lucide-react"

export default function NotFound() {
  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center px-4 text-center">
      <div className="relative mb-8">
        <h1 className="font-heading text-[12rem] font-black leading-none text-muted/20 sm:text-[16rem]">
          404
        </h1>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-32 w-32 rounded-full bg-primary/10 blur-3xl" />
        </div>
      </div>
      
      <div className="max-w-md space-y-6">
        <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Page not found
        </h2>
        <p className="text-lg text-muted-foreground">
          Sorry, we couldn't find the page you're looking for. It might have been moved or deleted.
        </p>
        
        <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-bold text-primary-foreground transition-all hover:bg-primary/90 active:scale-95"
          >
            <Home className="h-4 w-4" />
            Back to Home
          </Link>
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-background px-6 py-3 text-sm font-bold text-foreground transition-all hover:bg-accent active:scale-95"
          >
            <ArrowLeft className="h-4 w-4" />
            Go Back
          </button>
        </div>
      </div>

      <div className="mt-16 w-full max-w-sm rounded-2xl border border-border/50 bg-muted/30 p-6">
        <h3 className="mb-4 text-sm font-bold uppercase tracking-widest text-muted-foreground">
          Quick Search
        </h3>
        <button 
           onClick={() => document.dispatchEvent(new KeyboardEvent("keydown", { key: "k", metaKey: true }))}
           className="flex w-full items-center justify-between rounded-xl border border-border/50 bg-background px-4 py-3 text-left text-sm text-muted-foreground transition-all hover:border-border hover:text-foreground"
        >
          <div className="flex items-center gap-3">
            <Search className="h-4 w-4" />
            <span>Search articles...</span>
          </div>
          <kbd className="rounded border border-border/50 bg-muted px-1.5 py-0.5 text-[10px]">⌘K</kbd>
        </button>
      </div>
    </div>
  )
}
