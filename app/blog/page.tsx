import { Suspense } from "react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { BlogCard } from "@/components/blog/blog-card"
import { ChevronLeft, ChevronRight, BookOpen, Sparkles } from "lucide-react"
import type { Metadata } from "next"
import dynamic from "next/dynamic"

const SearchFilter = dynamic(() => import("@/components/blog/search-filter").then(mod => mod.SearchFilter), { ssr: true })
import { connectDB } from "@/lib/db"
import Blog from "@/models/Blog"
import Link from "next/link"

export const metadata: Metadata = {
  title: "The Studiva Journal — Academic Insights & Productivity Guides",
  description:
    "Explore the Studiva Journal for research-backed strategies on productivity, academic excellence, and student lifestyle. The ultimate archive for modern learners.",
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL || "https://blog.studiva.co.in"}/blog`,
  },
}

export const revalidate = 60

interface BlogListPageProps {
  searchParams: Promise<{
    page?: string
    search?: string
    tag?: string
    category?: string
  }>
}

async function getBlogData(searchParams: {
  page?: string
  search?: string
  tag?: string
  category?: string
}) {
  try {
    await connectDB()

    const page = parseInt(searchParams.page || "1")
    const limit = 12
    const skip = (page - 1) * limit

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const query: any = { isPublished: true }

    if (searchParams.search) {
      query.$text = { $search: searchParams.search }
    }
    if (searchParams.tag) {
      query.tags = { $in: [searchParams.tag.toLowerCase()] }
    }
    if (searchParams.category) {
      query.category = searchParams.category
    }

    const [blogs, total, allTags, allCategories] = await Promise.all([
      Blog.find(query)
        .sort({ publishedAt: -1 })
        .skip(skip)
        .limit(limit)
        .select("-content")
        .lean(),
      Blog.countDocuments(query),
      Blog.distinct("tags", { isPublished: true }),
      Blog.distinct("category", { isPublished: true }),
    ])

    return {
      blogs: JSON.parse(JSON.stringify(blogs)),
      total,
      totalPages: Math.ceil(total / limit),
      page,
      tags: allTags.sort(),
      categories: allCategories.sort(),
    }
  } catch {
    return { blogs: [], total: 0, totalPages: 0, page: 1, tags: [], categories: [] }
  }
}

export default async function BlogListPage({ searchParams }: BlogListPageProps) {
  const resolvedParams = await searchParams
  const { blogs, total, totalPages, page, tags, categories } =
    await getBlogData(resolvedParams)

  return (
    <>
      <Header />
      <main id="main-content" className="min-h-screen bg-background focus:outline-none" tabIndex={-1}>
        {/* Page header */}
        <div className="border-b border-border/50 bg-muted/20 py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border/50 bg-foreground/5 px-3 py-1 text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
              <Sparkles className="h-3 w-3" />
              Studiva™ Editorial Archive
            </div>
            <h1 className="font-heading text-4xl font-bold tracking-tight sm:text-7xl mb-6">
              The <span className="text-muted-foreground/80 font-medium italic">Journal.</span>
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground leading-relaxed">
              A curated collection of {total} articles covering academic strategy, 
              productivity systems, and student lifestyle. Expertly crafted for the 
              next generation of high-achievers.
            </p>
          </div>
        </div>


        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
          {/* Search & Filters */}
          <div className="mb-8">
            <Suspense fallback={null}>
              <SearchFilter tags={tags} categories={categories} />
            </Suspense>
          </div>

          {/* Invisible SEO Text for Google */}
          <section className="sr-only">
            <h2>Student Success Resources & Academic Guides</h2>
            <p>
              Explore our extensive collection of articles designed for students,
              covering everything from cognitive-science backed study techniques
              to modern productivity systems. Our goal is to provide high-quality,
              research-based insights to help you excel in your academic journey.
            </p>
            <ul>
              {categories.map((cat: string) => (
                <li key={cat}>{cat} tips for students</li>
              ))}
            </ul>
          </section>

          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "CollectionPage",
                name: "Studiva Editorial Blog - Academic Success & Productivity Guides",
                description: "The definitive archive of student productivity guides, academic tips, and lifestyle insights by Studiva.",
                url: `${process.env.NEXT_PUBLIC_SITE_URL || "https://blog.studiva.co.in"}/blog`,
                mainEntity: {
                  "@type": "ItemList",
                  itemListElement: blogs.map((blog: any, i: number) => ({
                    "@type": "ListItem",
                    position: i + 1,
                    url: `${process.env.NEXT_PUBLIC_SITE_URL || "https://blog.studiva.co.in"}/blog/${blog.slug}`,
                  })),
                },
              }),
            }}
          />

          {/* Blog grid */}
          {blogs.length > 0 ? (
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
                    category={blog.category}
                    publishedAt={blog.publishedAt}
                    readingTime={blog.readingTime}
                  />
                )
              )}
            </div>
          ) : (
            <div className="py-20 text-center">
              <p className="text-lg text-muted-foreground">
                No articles found.
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                Try adjusting your search or filters.
              </p>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <nav
              className="mt-12 flex items-center justify-center gap-2"
              aria-label="Pagination"
            >
              {page > 1 && (
                <Link
                  href={`/blog?page=${page - 1}${resolvedParams.search ? `&search=${resolvedParams.search}` : ""}${resolvedParams.tag ? `&tag=${resolvedParams.tag}` : ""}${resolvedParams.category ? `&category=${resolvedParams.category}` : ""}`}
                  className="inline-flex h-9 items-center gap-1 rounded-lg border border-border px-3 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Link>
              )}

              <span className="px-3 text-sm text-muted-foreground">
                Page {page} of {totalPages}
              </span>

              {page < totalPages && (
                <Link
                  href={`/blog?page=${page + 1}${resolvedParams.search ? `&search=${resolvedParams.search}` : ""}${resolvedParams.tag ? `&tag=${resolvedParams.tag}` : ""}${resolvedParams.category ? `&category=${resolvedParams.category}` : ""}`}
                  className="inline-flex h-9 items-center gap-1 rounded-lg border border-border px-3 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Link>
              )}
            </nav>
          )}
        </div>

        {/* Editorial Mission / Intro */}
        <div className="border-t border-border/5 bg-muted/5 py-24">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-12 md:grid-cols-2 items-center">
              <div>
                <h2 className="font-heading text-3xl font-bold mb-6 flex items-center gap-3">
                  <BookOpen className="h-6 w-6 text-muted-foreground" />
                  Our Editorial Mission
                </h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Studiva is more than just a blog; it&apos;s a digital compass for students navigating the complexities of modern education. From deep dives into cognitive science-backed study techniques to practical advice on managing student life, our editorial team works to bring you the most reliable insights.
                </p>
                <div className="mt-10 grid grid-cols-2 gap-8 sm:flex sm:gap-10">
                  <div>
                    <p className="text-2xl font-bold sm:text-3xl">100%</p>
                    <p className="text-[10px] font-bold tracking-[0.2em] text-muted-foreground uppercase">Research Based</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold sm:text-3xl">Weekly</p>
                    <p className="text-[10px] font-bold tracking-[0.2em] text-muted-foreground uppercase">Fresh Content</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold sm:text-3xl">{total}+</p>
                    <p className="text-[10px] font-bold tracking-[0.2em] text-muted-foreground uppercase">Guides Published</p>
                  </div>
                </div>
              </div>
              <div className="rounded-3xl border border-border/50 bg-background p-10 shadow-sm">
                <h3 className="font-heading text-xl font-bold mb-4">The Studiva Standard</h3>
                <p className="text-sm text-muted-foreground mb-8 leading-relaxed">
                  Every article published in the Studiva Journal undergoes a rigorous review process. We ensure that every piece of advice is actionable, every study tip is evidence-based, and every guide is tailored for the modern student experience.
                </p>
                <Link
                  href="/blog"
                  className="inline-flex items-center gap-2 text-xs font-bold tracking-widest text-foreground uppercase hover:gap-3 transition-all"
                >
                  Explore the archives <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
