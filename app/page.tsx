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
import { SearchTriggerButton } from "@/components/ui/search-trigger"

export const metadata: Metadata = {
  title: "Studiva™ Blog — Your Ultimate Guide to Student Success",
  description:
    "Discover research-backed strategies for productivity, academic excellence, and student success at the Studiva Blog. Built for the modern lifelong learner.",
  alternates: {
    canonical: process.env.NEXT_PUBLIC_SITE_URL || "https://blog.studiva.co.in",
  },
}

export const revalidate = 60

import { unstable_cache } from "next/cache"
import { IBlog } from "@/types/blog"

const getLatestBlogs = async (): Promise<IBlog[]> => {
  try {
    console.log("Fetching latest blogs from MongoDB...")
    await connectDB()
    const blogs = await Blog.find({ isPublished: true })
      .sort({ publishedAt: -1 })
      .limit(12)
      .select("-content")
      .lean()
    
    console.log(`Found ${blogs.length} published blogs.`)
    if (blogs.length === 0) {
      const totalCount = await Blog.countDocuments()
      console.log(`Total blogs in DB (including drafts): ${totalCount}`)
    }

    return JSON.parse(JSON.stringify(blogs))
  } catch (error) {
    console.error("Error fetching latest blogs:", error)
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
        <section className="relative overflow-hidden py-24 lg:py-32">
          {/* Animated Background Mesh */}
          <div className="absolute inset-0 -z-10 overflow-hidden">
            <div className="absolute -top-[40%] -left-[10%] h-[1000px] w-[1000px] rounded-full bg-primary/5 blur-[120px] animate-pulse" />
            <div className="absolute -bottom-[40%] -right-[10%] h-[1000px] w-[1000px] rounded-full bg-primary/10 blur-[120px]" />
          </div>

          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
              <div className="max-w-2xl animate-in fade-in slide-in-from-left-8 duration-1000 ease-out">
                <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-bold text-primary">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
                  </span>
                  Latest Insights
                </div>
                <h1 className="font-heading text-5xl font-bold tracking-tight text-foreground sm:text-7xl lg:text-8xl leading-[1.1]">
                  Master Your <span className="text-primary">Academic</span> Journey
                </h1>
                <p className="mt-8 text-xl leading-relaxed text-muted-foreground">
                  Your ultimate resource for study hacks, productivity tips, and expert academic insights.
                </p>
                <div className="mt-10 flex flex-wrap gap-4">
                  <Link
                    href="/blog"
                    className="inline-flex h-12 items-center justify-center rounded-xl bg-primary px-8 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:bg-primary/90 hover:shadow-primary/30 active:scale-95"
                  >
                    Explore Articles
                  </Link>
                  <SearchTriggerButton
                    className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-border bg-background px-8 text-sm font-bold text-foreground transition-all hover:bg-accent active:scale-95"
                  />
                </div>
              </div>

              <div className="relative hidden lg:block animate-in fade-in zoom-in-95 duration-1000 delay-200">
                <div className="relative aspect-square overflow-hidden rounded-3xl border border-border/10 bg-muted shadow-2xl">
                  <Image
                    src={blogs[0]?.coverImage || "/og-default.png"}
                    alt="Featured Article"
                    fill
                    className="object-cover transition-transform duration-700 hover:scale-105"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  <div className="absolute bottom-0 p-8">
                    <p className="mb-2 text-xs font-bold uppercase tracking-widest text-primary">Featured Today</p>
                    <h3 className="text-2xl font-bold text-white line-clamp-2">{blogs[0]?.title}</h3>
                  </div>
                </div>
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
