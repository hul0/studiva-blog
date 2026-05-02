import Link from "next/link"
import { connectDB } from "@/lib/db"
import Blog from "@/models/Blog"
import { FilePlus, ExternalLink, Pencil } from "lucide-react"
import { DeleteBlogButton } from "./delete-button"

export const dynamic = "force-dynamic"

async function getAllBlogs() {
  try {
    await connectDB()
    const blogs = await Blog.find()
      .sort({ updatedAt: -1 })
      .select("-content")
      .lean()
    return JSON.parse(JSON.stringify(blogs))
  } catch {
    return []
  }
}

export default async function AdminBlogsPage() {
  const blogs = await getAllBlogs()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-2xl font-bold">Blog Posts</h1>
        <Link
          href="/admin/blogs/new"
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          <FilePlus className="h-4 w-4" />
          New Blog
        </Link>
      </div>

      {blogs.length > 0 ? (
        <div className="overflow-hidden rounded-xl border border-border">
          {/* Table header */}
          <div className="hidden grid-cols-[1fr_120px_100px_100px_80px] gap-4 border-b border-border bg-muted/50 px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground md:grid">
            <span>Title</span>
            <span>Category</span>
            <span>Status</span>
            <span>Date</span>
            <span className="text-right">Actions</span>
          </div>

          {blogs.map(
            (
              blog: {
                _id: string
                title: string
                slug: string
                category: string
                isPublished: boolean
                publishedAt: string
                updatedAt: string
              },
              i: number
            ) => (
              <div
                key={blog._id}
                className={`flex flex-col gap-2 px-4 py-3 transition-colors hover:bg-muted/30 md:grid md:grid-cols-[1fr_120px_100px_100px_80px] md:items-center md:gap-4 ${
                  i > 0 ? "border-t border-border" : ""
                }`}
              >
                {/* Title */}
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{blog.title}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    /{blog.slug}
                  </p>
                </div>

                {/* Category */}
                <span className="text-xs text-muted-foreground">
                  {blog.category}
                </span>

                {/* Status */}
                <span
                  className={`w-fit rounded-full px-2 py-0.5 text-xs font-medium ${
                    blog.isPublished
                      ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                      : "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300"
                  }`}
                >
                  {blog.isPublished ? "Published" : "Draft"}
                </span>

                {/* Date */}
                <span className="text-xs text-muted-foreground">
                  {new Date(blog.updatedAt).toLocaleDateString("en-IN", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>

                {/* Actions */}
                <div className="flex items-center justify-end gap-1">
                  <Link
                    href={`/admin/blogs/${blog.slug}/edit`}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground"
                    aria-label="Edit"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </Link>
                  {blog.isPublished && (
                    <Link
                      href={`/blog/${blog.slug}`}
                      target="_blank"
                      className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground"
                      aria-label="View"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                    </Link>
                  )}
                  <DeleteBlogButton slug={blog.slug} title={blog.title} />
                </div>
              </div>
            )
          )}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-border p-12 text-center">
          <p className="text-muted-foreground">No blog posts yet.</p>
          <Link
            href="/admin/blogs/new"
            className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
          >
            <FilePlus className="h-4 w-4" />
            Create your first blog
          </Link>
        </div>
      )}
    </div>
  )
}
