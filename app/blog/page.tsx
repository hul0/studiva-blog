import { Suspense } from "react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { BlogCard } from "@/components/blog/blog-card"
import { SearchFilter } from "@/components/blog/search-filter"
import { connectDB } from "@/lib/db"
import Blog from "@/models/Blog"
import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Read the latest articles on student tips, academic insights, productivity hacks, and study guides from Studiva.",
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
      <main className="min-h-screen bg-background">
        {/* Page header */}
        <div className="border-b border-border bg-muted/30 py-12">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <h1 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
              Blog
            </h1>
            <p className="mt-2 text-muted-foreground">
              {total} article{total !== 1 ? "s" : ""} to help you succeed.
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
                    tags={blog.tags}
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
      </main>
      <Footer />
    </>
  )
}
