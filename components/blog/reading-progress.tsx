"use client"

import { useReadingProgress } from "@/hooks/use-reading-progress"

export function ReadingProgress() {
  const progress = useReadingProgress()

  return (
    <div
      className="fixed top-0 left-0 z-[60] h-0.5 bg-primary transition-all duration-150 ease-out"
      style={{ width: `${progress}%` }}
      role="progressbar"
      aria-valuenow={progress}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Reading progress"
    />
  )
}
