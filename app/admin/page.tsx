import Link from "next/link"
import { connectDB } from "@/lib/db"
import Blog from "@/models/Blog"
import { FileText, FilePlus, Eye, EyeOff } from "lucide-react"

export const dynamic = "force-dynamic"

async function getDashboardData() {
  try {
    await connectDB()
    const [total, published, drafts, recentPosts] = await Promise.all([
      Blog.countDocuments(),
      Blog.countDocuments({ isPublished: true }),
      Blog.countDocuments({ isPublished: false }),
      Blog.find()
        .sort({ updatedAt: -1 })
        .limit(5)
        .select("title slug isPublished updatedAt")
        .lean(),
    ])
    return {
      total,
      published,
      drafts,
      recentPosts: JSON.parse(JSON.stringify(recentPosts)),
    }
  } catch {
    return { total: 0, published: 0, drafts: 0, recentPosts: [] }
  }
}

export default async function AdminDashboard() {
  const { total, published, drafts, recentPosts } = await getDashboardData()

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-2xl font-bold">Dashboard</h1>
        <Link
          href="/admin/blogs/new"
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          <FilePlus className="h-4 w-4" />
          New Blog
        </Link>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          {
            label: "Total Posts",
            value: total,
            icon: FileText,
            color: "text-blue-500",
          },
          {
            label: "Published",
            value: published,
            icon: Eye,
            color: "text-green-500",
          },
          {
            label: "Drafts",
            value: drafts,
            icon: EyeOff,
            color: "text-amber-500",
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-border bg-card p-5"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </div>
            <p className="mt-2 text-3xl font-bold">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Recent posts */}
      <div>
        <h2 className="mb-4 text-lg font-semibold">Recent Posts</h2>
        {recentPosts.length > 0 ? (
          <div className="overflow-hidden rounded-xl border border-border">
            {recentPosts.map(
              (
                post: {
                  _id: string
                  title: string
                  slug: string
                  isPublished: boolean
                  updatedAt: string
                },
                i: number
              ) => (
                <Link
                  key={post._id}
                  href={`/admin/blogs/${post.slug}/edit`}
                  className={`flex items-center justify-between p-4 transition-colors hover:bg-muted/50 ${
                    i > 0 ? "border-t border-border" : ""
                  }`}
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">
                      {post.title}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Updated{" "}
                      {new Date(post.updatedAt).toLocaleDateString("en-IN")}
                    </p>
                  </div>
                  <span
                    className={`ml-3 rounded-full px-2 py-0.5 text-xs font-medium ${
                      post.isPublished
                        ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                        : "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300"
                    }`}
                  >
                    {post.isPublished ? "Published" : "Draft"}
                  </span>
                </Link>
              )
            )}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            No posts yet.{" "}
            <Link
              href="/admin/blogs/new"
              className="text-primary hover:underline"
            >
              Create your first blog!
            </Link>
          </p>
        )}
      </div>
    </div>
  )
}
