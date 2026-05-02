"use client"

import { useState, useEffect } from "react"

export function useReadingProgress() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    function updateProgress() {
      const scrollHeight =
        document.documentElement.scrollHeight - window.innerHeight
      if (scrollHeight > 0) {
        setProgress(
          Math.min(100, Math.round((window.scrollY / scrollHeight) * 100))
        )
      }
    }

    window.addEventListener("scroll", updateProgress, { passive: true })
    updateProgress()

    return () => window.removeEventListener("scroll", updateProgress)
  }, [])

  return progress
}
