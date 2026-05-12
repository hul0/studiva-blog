"use client"

import { useEffect } from "react"
import { AlertTriangle, RefreshCcw, Home } from "lucide-react"
import Link from "next/link"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center px-4 text-center">
      <div className="mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-red-500/10 text-red-500">
        <AlertTriangle className="h-12 w-12" />
      </div>
      
      <div className="max-w-md space-y-6">
        <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Something went wrong!
        </h2>
        <p className="text-lg text-muted-foreground">
          We encountered an unexpected error. Our team has been notified and we're working to fix it.
        </p>
        
        {error.digest && (
          <div className="rounded-lg bg-muted p-2 font-mono text-[10px] text-muted-foreground uppercase">
            Error ID: {error.digest}
          </div>
        )}
        
        <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
          <button
            onClick={() => reset()}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-bold text-primary-foreground transition-all hover:bg-primary/90 active:scale-95"
          >
            <RefreshCcw className="h-4 w-4" />
            Try again
          </button>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-background px-6 py-3 text-sm font-bold text-foreground transition-all hover:bg-accent active:scale-95"
          >
            <Home className="h-4 w-4" />
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}
