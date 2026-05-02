"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Trash2, Loader2 } from "lucide-react"

interface DeleteBlogButtonProps {
  slug: string
  title: string
}

export function DeleteBlogButton({ slug, title }: DeleteBlogButtonProps) {
  const router = useRouter()
  const [deleting, setDeleting] = useState(false)

  async function handleDelete() {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return

    setDeleting(true)
    try {
      const res = await fetch(`/api/blogs/${slug}`, { method: "DELETE" })
      if (res.ok) {
        router.refresh()
      } else {
        const data = await res.json()
        alert(data.error || "Failed to delete")
      }
    } catch {
      alert("Failed to delete")
    } finally {
      setDeleting(false)
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={deleting}
      className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-red-50 hover:text-red-600 disabled:opacity-50 dark:hover:bg-red-950"
      aria-label="Delete"
    >
      {deleting ? (
        <Loader2 className="h-3.5 w-3.5 animate-spin" />
      ) : (
        <Trash2 className="h-3.5 w-3.5" />
      )}
    </button>
  )
}
