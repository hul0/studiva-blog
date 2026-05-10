import Link from "next/link"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { connectDB } from "@/lib/db"
import Blog from "@/models/Blog"
import { BlogCard } from "@/components/blog/blog-card"
import { generateWebsiteJsonLd } from "@/lib/seo"
import { ArrowRight, Sparkles, TrendingUp, BookOpen, Zap } from "lucide-react"
import type { Metadata } from "next"
import Image from "next/image"

export const metadata: Metadata = {
  title: "Studiva™ Blog — Your Ultimate Guide to Student Success",
  description:
    "Discover research-backed strategies for productivity, academic excellence, and student success at the Studiva Blog. Built for the modern lifelong learner.",
  alternates: {
    canonical: process.env.NEXT_PUBLIC_SITE_URL || "https://blog.studiva.co.in",
  },
}

export const revalidate = 60

async function getLatestBlogs() {
  try {
    await connectDB()
    const blogs = await Blog.find({ isPublished: true })
      .sort({ publishedAt: -1 })
      .limit(12)
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

  // Use the first 6 for the main grid
  const gridBlogs = blogs.slice(0, 6)
  // Use the next 4 for trending (or reuse if not enough)
  const trendingBlogs =
    blogs.length > 6 ? blogs.slice(6, 10) : blogs.slice(0, 4)

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />
      <main
        id="main-content"
        className="bg-background text-foreground focus:outline-none"
        tabIndex={-1}
      >
        {/* Hero Section */}
        <section className="relative border-b border-border/5 bg-muted/10 pt-16 pb-16 md:pt-24 md:pb-24">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="grid items-center gap-12 lg:grid-cols-2">
              <div className="text-left">
                <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border/50 bg-foreground/5 px-3 py-1 text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                  <Sparkles className="h-3 w-3" />
                  Studiva™ Digital Publication
                </div>
                <h1 className="mb-8 font-heading text-6xl font-bold tracking-tight text-foreground md:text-8xl lg:text-[6rem] leading-[1.05]">
                  The <span className="font-medium text-muted-foreground/80 italic">Future</span> of <br />
                  Academic <span className="text-muted-foreground/60">Success.</span>
                </h1>
                <p className="mb-8 max-w-xl text-lg leading-relaxed text-muted-foreground">
                  Discover research-backed strategies for productivity, academic
                  excellence, and student success. Built for the modern lifelong
                  learner.
                </p>
                <div className="flex flex-wrap items-center gap-4">
                  <Link
                    href="/blog"
                    className="inline-flex items-center gap-2 rounded-lg bg-foreground px-8 py-4 text-sm font-bold text-background transition-all hover:translate-y-[-2px] hover:bg-foreground/90 active:translate-y-0"
                  >
                    Start Reading
                  </Link>
                  <Link
                    href="/blog?category=Academic Success"
                    className="inline-flex items-center gap-2 rounded-lg border border-border px-8 py-4 text-sm font-bold text-foreground transition-all hover:bg-muted"
                  >
                    Explore Guides
                  </Link>
                </div>
              </div>

              {/* Hero Image - More Focused "Slice" of the design */}
              <div className="relative hidden lg:block">
                <div className="relative z-10 overflow-hidden rounded-3xl border border-border/50 bg-muted/20 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.2)] transition-all duration-700 hover:scale-[1.01]">
                  <Image
                    src="/og-default.png"
                    alt="Studiva Publication Hero"
                    width={1000}
                    height={800}
                    className="h-[500px] w-full object-cover object-top"
                    priority
                  />
                  {/* Subtle glass overlay */}
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-background/5 to-background/20" />
                </div>
                {/* Decorative glow */}
                <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary/5 blur-[100px]" />
                <div className="absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-muted/20 blur-[100px]" />
              </div>
            </div>
          </div>
        </section>

        {/* Main Content Layout with Sidebar */}
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-12 lg:gap-12">
            {/* Blog Grid Column */}
            <div className="lg:col-span-9">
              <div className="mb-8 flex items-center justify-between border-b border-border/10 pb-4">
                <h2 className="font-heading text-2xl font-bold tracking-tight">
                  Latest Articles
                </h2>
              </div>

              <div className="grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
                {gridBlogs.map((blog: any) => (
                  <BlogCard key={blog._id} {...blog} />
                ))}
              </div>

              <div className="mt-12 text-center">
                <Link
                  href="/blog"
                  className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-2.5 text-xs font-bold tracking-widest text-foreground uppercase transition-colors hover:bg-muted"
                >
                  View All Articles <ArrowRight className="h-4 w-4" />
                </Link>
              </div>

              {/* Invisible SEO Text for Google */}
              <section className="sr-only">
                <h2>
                  The Studiva Journal: A Digital Publication for High-Achieving
                  Students
                </h2>
                <p>
                  Studiva is dedicated to helping students achieve their full
                  potential through evidence-based strategies. Our blog covers
                  essential topics including academic excellence, productivity
                  systems, student lifestyle, and mental health for learners.
                  Whether you are looking for study hacks, guide on how to be
                  productive, or deep dives into academic performance, the
                  Studiva Journal is your primary resource.
                </p>
                <h3>Core Topics for Student Success</h3>
                <ul>
                  <li>
                    Academic Success: Study techniques, exam preparation, and
                    research skills.
                  </li>
                  <li>
                    Productivity: Time management, focus strategies, and
                    learning systems.
                  </li>
                  <li>
                    Student Life: Mental well-being, university advice, and
                    personal growth.
                  </li>
                </ul>
              </section>
            </div>

            {/* Home Sidebar */}
            <aside className="mt-16 space-y-12 lg:col-span-3 lg:mt-0">
              {/* Categories */}
              <div>
                <p className="mb-6 text-[10px] font-bold tracking-[0.2em] text-muted-foreground uppercase">
                  Categories
                </p>
                <nav className="space-y-3">
                  {[
                    { name: "Academic Success", icon: BookOpen },
                    { name: "Productivity", icon: Zap },
                    { name: "Student Life", icon: TrendingUp },
                  ].map((cat) => (
                    <Link
                      key={cat.name}
                      href={`/blog?category=${cat.name}`}
                      className="group flex items-center gap-3"
                    >
                      <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-muted text-muted-foreground transition-colors group-hover:bg-foreground group-hover:text-background">
                        <cat.icon className="h-3.5 w-3.5" />
                      </div>
                      <span className="text-sm font-bold text-foreground/70 transition-colors group-hover:text-foreground">
                        {cat.name}
                      </span>
                    </Link>
                  ))}
                </nav>
              </div>

              {/* Newsletter */}
              <div className="rounded-xl border border-border/50 bg-muted/50 p-6">
                <div className="mb-4 flex h-8 items-center">
                  <Image
                    src="/logo.png"
                    alt="Studiva Logo"
                    width={140}
                    height={44}
                    className="h-8 w-auto object-contain dark:invert"
                  />
                </div>
                <h3 className="mb-3 font-heading text-lg font-bold">
                  Subscribe
                </h3>
                <p className="mb-5 text-xs leading-relaxed text-muted-foreground">
                  Weekly academic guides in your inbox.
                </p>
                <form className="space-y-2">
                  <input
                    type="email"
                    placeholder="your@email.com"
                    className="w-full rounded-lg border border-border bg-background px-4 py-2 text-xs focus:outline-none"
                  />
                  <button className="w-full rounded-lg bg-foreground px-4 py-2 text-xs font-bold text-background transition-colors">
                    Join
                  </button>
                </form>
              </div>

              {/* Trending Block - FIXED Runtime Error */}
              <div>
                <p className="mb-8 text-[10px] font-bold tracking-[0.2em] text-muted-foreground uppercase">
                  Trending
                </p>
                <div className="space-y-6">
                  {trendingBlogs.map((blog: any, i: number) => (
                    <Link
                      key={blog._id}
                      href={`/blog/${blog.slug}`}
                      className="group flex items-start gap-4"
                    >
                      <div className="mt-0.5 shrink-0 font-heading text-sm font-bold text-muted-foreground/40">
                        0{i + 1}
                      </div>
                      <div className="space-y-1">
                        <h4 className="line-clamp-2 text-sm leading-tight font-bold text-foreground">
                          {blog.title}
                        </h4>
                        <span className="text-[9px] font-bold tracking-widest text-muted-foreground uppercase">
                          {blog.readingTime}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
