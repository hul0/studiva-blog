"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { MarkdownEditor } from "@/components/admin/markdown-editor"
import { SEOAnalyzer } from "@/components/admin/seo-analyzer"
import { Save, Eye, Loader2, ArrowLeft, Trash2, Info } from "lucide-react"
import Link from "next/link"
import React from "react"

interface BlogFormData {
  title: string
  excerpt: string
  coverImage: string
  author: string
  tags: string
  category: string
  content: string
  isPublished: boolean
}

interface BlogFormProps {
  initialData?: BlogFormData
  slug?: string
  isEdit?: boolean
}

export function BlogForm({ initialData, slug, isEdit }: BlogFormProps) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const [form, setForm] = useState<BlogFormData>({
    title: initialData?.title || "",
    excerpt: initialData?.excerpt || "",
    coverImage: initialData?.coverImage || "",
    author: initialData?.author || "Studiva Team",
    tags: initialData?.tags || "",
    category: initialData?.category || "General",
    content: initialData?.content || "",
    isPublished: initialData?.isPublished || false,
  })

  const [hasDraft, setHasDraft] = useState(false)

  // Autosave to localStorage
  React.useEffect(() => {
    if (isEdit) return // Don't autosave when editing existing posts to avoid overwriting

    const savedDraft = localStorage.getItem("studiva-blog-draft")
    if (savedDraft && !initialData) {
      setHasDraft(true)
      try {
        const draft = JSON.parse(savedDraft)
        setForm(draft)
        setSuccess("Draft loaded from local storage")
      } catch (e) {
        console.error("Failed to parse draft", e)
      }
    }
  }, [isEdit, initialData])

  React.useEffect(() => {
    if (isEdit) return
    const timeout = setTimeout(() => {
      localStorage.setItem("studiva-blog-draft", JSON.stringify(form))
    }, 1000)
    return () => clearTimeout(timeout)
  }, [form, isEdit])

  function updateField(field: keyof BlogFormData, value: string | boolean) {
    setForm((prev) => ({ ...prev, [field]: value }))
    setError("")
    setSuccess("")
  }

  function clearDraft() {
    localStorage.removeItem("studiva-blog-draft")
    setHasDraft(false)
    setForm({
      title: "",
      excerpt: "",
      coverImage: "",
      author: "Studiva Team",
      tags: "",
      category: "General",
      content: "",
      isPublished: false,
    })
    setSuccess("Draft cleared")
  }

  async function handleSubmit(publish: boolean) {
    if (!form.title.trim() || !form.excerpt.trim() || !form.content.trim()) {
      setError("Title, excerpt, and content are required")
      return
    }

    setSaving(true)
    setError("")
    setSuccess("")

    try {
      const payload = {
        title: form.title.trim(),
        excerpt: form.excerpt.trim(),
        coverImage: form.coverImage.trim(),
        author: form.author.trim() || "Studiva Team",
        tags: form.tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
        category: form.category.trim() || "General",
        content: form.content,
        isPublished: publish,
      }

      const url = isEdit ? `/api/blogs/${slug}` : "/api/blogs"
      const method = isEdit ? "PUT" : "POST"

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong")
      }

      setSuccess(
        publish
          ? "Blog published successfully!"
          : "Blog saved as draft!"
      )

      if (!isEdit) {
        localStorage.removeItem("studiva-blog-draft")
      }

      setTimeout(() => {
        router.push("/admin/blogs")
        router.refresh()
      }, 1000)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/blogs"
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted-foreground hover:bg-accent hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <h1 className="font-heading text-2xl font-bold">
            {isEdit ? "Edit Blog" : "New Blog"}
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleSubmit(false)}
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent disabled:opacity-50"
          >
            {saving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            Save Draft
          </button>
          <button
            onClick={() => handleSubmit(true)}
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
          >
            {saving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
            Publish
          </button>
        </div>
      </div>

      {!isEdit && hasDraft && (
        <div className="flex items-center justify-between rounded-lg border border-yellow-200 bg-yellow-50 px-4 py-2 text-sm text-yellow-800 dark:border-yellow-900/50 dark:bg-yellow-950/30 dark:text-yellow-200">
          <div className="flex items-center gap-2">
            <Info className="h-4 w-4" />
            <span>You have an unsaved draft from a previous session.</span>
          </div>
          <button
            onClick={clearDraft}
            className="flex items-center gap-1 font-bold text-yellow-900 hover:underline dark:text-yellow-100"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Clear Draft
          </button>
        </div>
      )}

      {/* Status messages */}
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300">
          {error}
        </div>
      )}
      {success && (
        <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700 dark:border-green-900 dark:bg-green-950 dark:text-green-300">
          {success}
        </div>
      )}

      {/* Form fields */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-5 lg:col-span-2">
          {/* Title */}
          <div>
            <label
              htmlFor="title"
              className="mb-1.5 block text-sm font-medium text-foreground"
            >
              Title
            </label>
            <input
              id="title"
              type="text"
              value={form.title}
              onChange={(e) => updateField("title", e.target.value)}
              className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
              placeholder="Your blog title"
            />
          </div>

          {/* Excerpt */}
          <div>
            <label
              htmlFor="excerpt"
              className="mb-1.5 block text-sm font-medium text-foreground"
            >
              Excerpt
            </label>
            <textarea
              id="excerpt"
              value={form.excerpt}
              onChange={(e) => updateField("excerpt", e.target.value)}
              className="h-20 w-full resize-none rounded-lg border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
              placeholder="Brief description for SEO and previews"
            />
          </div>

          {/* Content */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">
              Content
            </label>
            <MarkdownEditor
              value={form.content}
              onChange={(v) => updateField("content", v)}
            />
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          {/* Cover image */}
          <div>
            <label
              htmlFor="coverImage"
              className="mb-1.5 block text-sm font-medium text-foreground"
            >
              Cover Image URL
            </label>
            <input
              id="coverImage"
              type="url"
              value={form.coverImage}
              onChange={(e) => updateField("coverImage", e.target.value)}
              className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
              placeholder="https://..."
            />
          </div>

          {/* Author */}
          <div>
            <label
              htmlFor="author"
              className="mb-1.5 block text-sm font-medium text-foreground"
            >
              Author
            </label>
            <input
              id="author"
              type="text"
              value={form.author}
              onChange={(e) => updateField("author", e.target.value)}
              className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
              placeholder="Studiva Team"
            />
          </div>

          {/* Category */}
          <div>
            <label
              htmlFor="category"
              className="mb-1.5 block text-sm font-medium text-foreground"
            >
              Category
            </label>
            <input
              id="category"
              type="text"
              value={form.category}
              onChange={(e) => updateField("category", e.target.value)}
              className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
              placeholder="General"
            />
          </div>

          {/* Tags */}
          <div>
            <label
              htmlFor="tags"
              className="mb-1.5 block text-sm font-medium text-foreground"
            >
              Tags (comma-separated)
            </label>
            <input
              id="tags"
              type="text"
              value={form.tags}
              onChange={(e) => updateField("tags", e.target.value)}
              className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
              placeholder="study-tips, productivity, education"
            />
          </div>

          <SEOAnalyzer
            title={form.title}
            excerpt={form.excerpt}
            content={form.content}
          />

          {/* Publish toggle */}
          <div className="flex items-center gap-3 rounded-lg border border-border p-3">
            <input
              id="isPublished"
              type="checkbox"
              checked={form.isPublished}
              onChange={(e) => updateField("isPublished", e.target.checked)}
              className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
            />
            <label htmlFor="isPublished" className="text-sm text-foreground">
              Publish immediately
            </label>
          </div>
        </div>
      </div>
    </div>
  )
}
