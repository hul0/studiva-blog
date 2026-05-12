"use client"

import { useEffect } from "react"

export function ViewTracker({ slug }: { slug: string }) {
  useEffect(() => {
    // track view after 2 seconds to avoid tracking accidental clicks
    const timer = setTimeout(() => {
      fetch(`/api/views/${slug}`, { method: "POST" }).catch(console.error)
    }, 2000)

    return () => clearTimeout(timer)
  }, [slug])

  return null
}
