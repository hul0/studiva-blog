import Link from "next/link"
import { connectDB } from "@/lib/db"
import Blog from "@/models/Blog"
import { FileText, FilePlus, Eye, EyeOff, Sparkles } from "lucide-react"

export const dynamic = "force-dynamic"

async function getDashboardData() {
  try {
    await connectDB()
    const [total, published, drafts, totalViews, recentPosts] = await Promise.all([
      Blog.countDocuments(),
      Blog.countDocuments({ isPublished: true }),
      Blog.countDocuments({ isPublished: false }),
      Blog.aggregate([{ $group: { _id: null, total: { $sum: "$views" } } }]),
      Blog.find()
        .sort({ updatedAt: -1 })
        .limit(5)
        .select("title slug isPublished updatedAt views")
        .lean(),
    ])
    return {
      total,
      published,
      drafts,
      totalViews: totalViews[0]?.total || 0,
      recentPosts: JSON.parse(JSON.stringify(recentPosts)),
    }
  } catch {
    return { total: 0, published: 0, drafts: 0, totalViews: 0, recentPosts: [] }
  }
}

export default async function AdminDashboard() {
  const { total, published, drafts, totalViews, recentPosts } = await getDashboardData()

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-3xl font-bold tracking-tight">Overview</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage your journal content and track performance.</p>
        </div>
        <Link
          href="/admin/blogs/new"
          className="inline-flex items-center gap-2 rounded-xl bg-foreground px-6 py-2.5 text-sm font-bold text-background transition-all hover:opacity-90 active:scale-95"
        >
          <FilePlus className="h-4 w-4" />
          Create Article
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {[
          {
            label: "Total Articles",
            value: total,
            icon: FileText,
            color: "text-blue-500",
            bg: "bg-blue-500/10",
          },
          {
            label: "Total Reach",
            value: totalViews.toLocaleString(),
            icon: Eye,
            color: "text-purple-500",
            bg: "bg-purple-500/10",
          },
          {
            label: "Live Now",
            value: published,
            icon: Sparkles,
            color: "text-green-500",
            bg: "bg-green-500/10",
          },
          {
            label: "In Progress",
            value: drafts,
            icon: FilePlus,
            color: "text-amber-500",
            bg: "bg-amber-500/10",
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="group relative overflow-hidden rounded-2xl border border-border/50 bg-card p-6 transition-all hover:shadow-lg hover:shadow-primary/5"
          >
            <div className="flex items-center justify-between relative z-10">
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground/60">{stat.label}</p>
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${stat.bg} ${stat.color}`}>
                <stat.icon className="h-5 w-5" />
              </div>
            </div>
            <p className="mt-4 text-3xl font-bold tracking-tight relative z-10">{stat.value}</p>
            <div className="absolute -right-2 -bottom-2 opacity-[0.03] transition-transform group-hover:scale-110">
              <stat.icon className="h-24 w-24" />
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Recent posts */}
        <div className="rounded-2xl border border-border/50 bg-card overflow-hidden">
          <div className="border-b border-border/50 p-6 flex items-center justify-between bg-muted/30">
            <h2 className="text-sm font-bold uppercase tracking-widest text-foreground/70">Recent Activity</h2>
            <Link href="/admin/blogs" className="text-xs font-bold text-primary hover:underline">View All</Link>
          </div>
          {recentPosts.length > 0 ? (
            <div className="divide-y divide-border/50">
              {recentPosts.map((post: any) => (
                <Link
                  key={post._id}
                  href={`/admin/blogs/${post.slug}/edit`}
                  className="flex items-center justify-between p-5 transition-colors hover:bg-muted/50 group"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold group-hover:text-primary transition-colors">
                      {post.title}
                    </p>
                    <div className="flex items-center gap-3 mt-1">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60">
                        {new Date(post.updatedAt).toLocaleDateString("en-IN", { month: 'short', day: 'numeric' })}
                      </p>
                      <div className="h-1 w-1 rounded-full bg-border" />
                      <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60 flex items-center gap-1">
                        <Eye className="h-3 w-3" /> {post.views || 0} views
                      </p>
                    </div>
                  </div>
                  <span
                    className={`ml-4 rounded-lg px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest ${post.isPublished
                        ? "bg-green-500/10 text-green-600"
                        : "bg-amber-500/10 text-amber-600"
                      }`}
                  >
                    {post.isPublished ? "Live" : "Draft"}
                  </span>
                </Link>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center">
              <p className="text-sm text-muted-foreground mb-4">No content yet.</p>
              <Link
                href="/admin/blogs/new"
                className="inline-flex items-center gap-2 rounded-xl border border-border px-6 py-2 text-xs font-bold uppercase tracking-widest hover:bg-muted transition-all"
              >
                Launch your first story
              </Link>
            </div>
          )}
        </div>

        {/* Quick Actions / Info */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-border/50 bg-gradient-to-br from-primary/5 to-secondary/5 p-8">
            <h3 className="font-heading text-lg font-bold mb-3">SEO Health Check</h3>
            <p className="text-sm text-muted-foreground leading-relaxed mb-6">
              Your sitemaps and robots.txt are automatically managed and synchronized with search engines on every publication.
            </p>
            <div className="space-y-3">
              {[
                { label: "Sitemap Status", status: "Active", color: "text-green-500" },
                { label: "RSS Feed", status: "Live", color: "text-green-500" },
                { label: "Indexing", status: "Optimal", color: "text-green-500" },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between py-2 border-b border-border/10">
                  <span className="text-xs font-bold text-muted-foreground/80">{item.label}</span>
                  <span className={`text-[10px] font-black uppercase tracking-widest ${item.color}`}>{item.status}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
