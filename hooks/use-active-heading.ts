"use client"

import { useState, useEffect } from "react"

export function useActiveHeading(headingIds: string[]) {
  const [activeId, setActiveId] = useState<string>("")

  useEffect(() => {
    if (headingIds.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        })
      },
      {
        rootMargin: "-80px 0px -75% 0px",
        threshold: 0,
      }
    )

    headingIds.forEach((id) => {
      const element = document.getElementById(id)
      if (element) observer.observe(element)
    })

    return () => observer.disconnect()
  }, [headingIds])

  return activeId
}
