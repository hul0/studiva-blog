import { notFound } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { connectDB } from "@/lib/db"
import Blog from "@/models/Blog"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { BlogContent, extractHeadings } from "@/components/blog/blog-content"
import { TableOfContents } from "@/components/blog/table-of-contents"
import { ReadingProgress } from "@/components/blog/reading-progress"
import { ShareButtons } from "@/components/blog/share-buttons"
import { RelatedPosts } from "@/components/blog/related-posts"
import { generateBlogMetadata, generateBlogJsonLd } from "@/lib/seo"
import { Calendar, Clock, User, ChevronRight } from "lucide-react"
import type { Metadata } from "next"

export const revalidate = 60
export const dynamicParams = true

interface BlogPostPageProps {
  params: Promise<{ slug: string }>
}

async function getBlog(slug: string) {
  try {
    await connectDB()
    const blog = await Blog.findOne({ slug, isPublished: true }).lean()
    return blog ? JSON.parse(JSON.stringify(blog)) : null
  } catch {
    return null
  }
}

async function getRelatedPosts(tags: string[], currentSlug: string) {
  try {
    await connectDB()
    const posts = await Blog.find({
      isPublished: true,
      slug: { $ne: currentSlug },
      tags: { $in: tags },
    })
      .sort({ publishedAt: -1 })
      .limit(3)
      .select("-content")
      .lean()
    return JSON.parse(JSON.stringify(posts))
  } catch {
    return []
  }
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params
  const blog = await getBlog(slug)

  if (!blog) return { title: "Not Found" }

  return generateBlogMetadata({
    title: blog.title,
    slug: blog.slug,
    excerpt: blog.excerpt,
    coverImage: blog.coverImage,
    author: blog.author,
    tags: blog.tags,
    category: blog.category,
    publishedAt: blog.publishedAt,
    updatedAt: blog.updatedAt,
  })
}

export async function generateStaticParams() {
  try {
    await connectDB()
    const blogs = await Blog.find({ isPublished: true }).select("slug").lean()
    return blogs.map((blog) => ({ slug: blog.slug }))
  } catch {
    return []
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params
  const blog = await getBlog(slug)

  if (!blog) notFound()

  const headings = extractHeadings(blog.content)
  const relatedPosts = await getRelatedPosts(blog.tags, blog.slug)
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://blog.studiva.co.in"
  const blogUrl = `${siteUrl}/blog/${blog.slug}`

  const jsonLd = generateBlogJsonLd({
    title: blog.title,
    slug: blog.slug,
    excerpt: blog.excerpt,
    coverImage: blog.coverImage,
    author: blog.author,
    tags: blog.tags,
    category: blog.category,
    publishedAt: blog.publishedAt,
    updatedAt: blog.updatedAt,
  })

  const formattedDate = new Date(blog.publishedAt).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ReadingProgress />
      <Header />

      <main className="min-h-screen bg-background">
        {/* Breadcrumbs */}
        <div className="border-b border-border bg-muted/30">
          <div className="mx-auto max-w-6xl px-4 py-3 sm:px-6 lg:px-8">
            <nav
              aria-label="Breadcrumb"
              className="flex items-center gap-1.5 text-xs text-muted-foreground"
            >
              <Link href="/" className="hover:text-foreground">
                Home
              </Link>
              <ChevronRight className="h-3 w-3" />
              <Link href="/blog" className="hover:text-foreground">
                Blog
              </Link>
              <ChevronRight className="h-3 w-3" />
              <span className="truncate text-foreground">{blog.title}</span>
            </nav>
          </div>
        </div>

        <article className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
          {/* Article header */}
          <header className="mx-auto mb-10 max-w-3xl text-center">
            {/* Category */}
            <Link
              href={`/blog?category=${blog.category}`}
              className="mb-4 inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary"
            >
              {blog.category}
            </Link>

            <h1 className="mb-4 font-heading text-3xl font-bold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
              {blog.title}
            </h1>

            <p className="mb-6 text-lg leading-relaxed text-muted-foreground">
              {blog.excerpt}
            </p>

            {/* Meta */}
            <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <User className="h-4 w-4" />
                {blog.author}
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4" />
                {formattedDate}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="h-4 w-4" />
                {blog.readingTime}
              </span>
            </div>

            {/* Tags */}
            {blog.tags.length > 0 && (
              <div className="mt-4 flex flex-wrap justify-center gap-2">
                {blog.tags.map((tag: string) => (
                  <Link
                    key={tag}
                    href={`/blog?tag=${tag}`}
                    className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                  >
                    #{tag}
                  </Link>
                ))}
              </div>
            )}
          </header>

          {/* Cover image */}
          {blog.coverImage && (
            <div className="mx-auto mb-10 max-w-4xl overflow-hidden rounded-xl">
              <Image
                src={blog.coverImage}
                alt={blog.title}
                width={1200}
                height={630}
                className="h-auto w-full object-cover"
                priority
                sizes="(max-width: 768px) 100vw, 900px"
              />
            </div>
          )}

          {/* Content + TOC layout */}
          <div className="mx-auto max-w-6xl lg:flex lg:gap-10">
            {/* Main content */}
            <div className="min-w-0 max-w-3xl flex-1">
              <BlogContent content={blog.content} />

              {/* Share buttons */}
              <div className="mt-10 flex items-center justify-between border-t border-border pt-6">
                <span className="text-sm font-medium text-muted-foreground">
                  Share this article
                </span>
                <ShareButtons url={blogUrl} title={blog.title} />
              </div>
            </div>

            {/* Sidebar / TOC */}
            {headings.length > 0 && (
              <aside className="hidden w-64 shrink-0 lg:block">
                <div className="sticky top-20">
                  <TableOfContents headings={headings} />
                </div>
              </aside>
            )}
          </div>

          {/* Related posts */}
          <div className="mx-auto max-w-3xl">
            <RelatedPosts posts={relatedPosts} />
          </div>
        </article>
      </main>

      <Footer />
    </>
  )
}
