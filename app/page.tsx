import Link from "next/link"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { connectDB } from "@/lib/db"
import Blog from "@/models/Blog"
import { BlogCard } from "@/components/blog/blog-card"
import { generateWebsiteJsonLd } from "@/lib/seo"
import { ArrowRight, BookOpen, Zap, TrendingUp } from "lucide-react"

export const revalidate = 60

async function getLatestBlogs() {
  try {
    await connectDB()
    const blogs = await Blog.find({ isPublished: true })
      .sort({ publishedAt: -1 })
      .limit(6)
      .select("-content")
      .lean()
    return JSON.parse(JSON.stringify(blogs))
  } catch {
    return []
  }
}

export default async function HomePage() {
  const blogs = await getLatestBlogs()
  const jsonLd = generateWebsiteJsonLd()

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />
      <main>
        {/* Hero */}
        <section className="relative overflow-hidden border-b border-border bg-gradient-to-b from-muted/50 to-background">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(120,119,198,0.05),transparent_50%)]" />
          <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8 lg:py-36">
            <div className="mx-auto max-w-3xl text-center">
              <p className="mb-4 text-sm font-medium uppercase tracking-widest text-primary/80">
                The Studiva™ Blog
              </p>
              <h1 className="mb-6 font-heading text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                Insights for the{" "}
                <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                  Modern Student
                </span>
              </h1>
              <p className="mx-auto mb-8 max-w-2xl text-lg leading-relaxed text-muted-foreground">
                Study smarter, not harder. Discover tips, guides, and strategies
                to excel in academics, boost productivity, and navigate student
                life.
              </p>
              <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Link
                  href="/blog"
                  className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                >
                  Explore Articles
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/feed.xml"
                  className="inline-flex items-center gap-2 rounded-lg border border-border px-6 py-3 text-sm font-medium text-foreground transition-colors hover:bg-accent"
                >
                  Subscribe via RSS
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="border-b border-border bg-background py-16">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-8 sm:grid-cols-3">
              {[
                {
                  icon: BookOpen,
                  title: "In-Depth Guides",
                  desc: "Comprehensive articles covering academics, career prep, and study techniques.",
                },
                {
                  icon: Zap,
                  title: "Productivity Hacks",
                  desc: "Time management, focus strategies, and tools to get more done in less time.",
                },
                {
                  icon: TrendingUp,
                  title: "Student Success",
                  desc: "Real-world advice on internships, projects, and building your career early.",
                },
              ].map((feature) => (
                <div
                  key={feature.title}
                  className="flex flex-col items-center rounded-xl border border-border bg-card p-6 text-center transition-shadow hover:shadow-md"
                >
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <h3 className="mb-2 font-heading text-base font-semibold">
                    {feature.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {feature.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Latest articles */}
        {blogs.length > 0 && (
          <section className="bg-background py-16">
            <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
              <div className="mb-10 flex items-end justify-between">
                <div>
                  <h2 className="font-heading text-2xl font-bold tracking-tight sm:text-3xl">
                    Latest Articles
                  </h2>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Fresh insights and guides from the Studiva team.
                  </p>
                </div>
                <Link
                  href="/blog"
                  className="hidden items-center gap-1 text-sm font-medium text-primary transition-colors hover:underline sm:inline-flex"
                >
                  View all
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>

              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {blogs.map(
                  (blog: {
                    _id: string
                    title: string
                    slug: string
                    excerpt: string
                    coverImage: string
                    author: string
                    tags: string[]
                    category: string
                    publishedAt: string
                    readingTime: string
                  }) => (
                    <BlogCard
                      key={blog._id}
                      title={blog.title}
                      slug={blog.slug}
                      excerpt={blog.excerpt}
                      coverImage={blog.coverImage}
                      author={blog.author}
                      tags={blog.tags}
                      category={blog.category}
                      publishedAt={blog.publishedAt}
                      readingTime={blog.readingTime}
                    />
                  )
                )}
              </div>

              <div className="mt-8 text-center sm:hidden">
                <Link
                  href="/blog"
                  className="inline-flex items-center gap-1 text-sm font-medium text-primary"
                >
                  View all articles
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  )
}
