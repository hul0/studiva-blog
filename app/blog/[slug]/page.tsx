import { notFound } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { connectDB } from "@/lib/db"
import Blog from "@/models/Blog"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { BlogContent, extractHeadings } from "@/components/blog/blog-content"
import { RelatedPosts } from "@/components/blog/related-posts"
import { ViewTracker } from "@/components/blog/view-tracker"
import { generateBlogMetadata, generateBlogJsonLd } from "@/lib/seo"
import {
  Hash,
  Calendar,
  Clock,
  ChevronRight,
  BookOpen,
  Zap,
  TrendingUp,
  Settings,
  Eye,
} from "lucide-react"
import type { Metadata } from "next"
import dynamic from "next/dynamic"

// Defer non-critical interactive components
const TableOfContents = dynamic(() =>
  import("@/components/blog/table-of-contents").then(
    (mod) => mod.TableOfContents
  )
)
const ShareButtons = dynamic(() =>
  import("@/components/blog/share-buttons").then((mod) => mod.ShareButtons)
)
const ReadingMoodToggle = dynamic(() =>
  import("@/components/blog/reading-mood-toggle").then(
    (mod) => mod.ReadingMoodToggle
  )
)
const BackToTop = dynamic(() =>
  import("@/components/blog/back-to-top").then((mod) => mod.BackToTop)
)
const ReadingProgress = dynamic(() =>
  import("@/components/blog/reading-progress").then(
    (mod) => mod.ReadingProgress
  )
)

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

    // First, try to find posts with matching tags
    let posts = await Blog.find({
      isPublished: true,
      slug: { $ne: currentSlug },
      tags: { $in: tags },
    })
      .sort({ publishedAt: -1 })
      .limit(3)
      .select("-content")
      .lean()

    // Fallback: If no related posts by tags, just get the latest posts
    if (posts.length === 0) {
      posts = await Blog.find({
        isPublished: true,
        slug: { $ne: currentSlug },
      })
        .sort({ publishedAt: -1 })
        .limit(3)
        .select("-content")
        .lean()
    }

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
      <ViewTracker slug={blog.slug} />

      <main
        id="main-content"
        className="min-h-screen bg-background focus:outline-none"
        tabIndex={-1}
      >
        {/* Breadcrumbs */}
        <div className="border-b border-border/5">
          <div className="mx-auto max-w-6xl px-4 py-4 sm:px-6 lg:px-8">
            <nav className="flex items-center gap-2 text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
              <Link href="/" className="hover:text-foreground">
                Home
              </Link>
              <ChevronRight className="h-3 w-3 opacity-30" />
              <Link href="/blog" className="hover:text-foreground">
                Blog
              </Link>
              <ChevronRight className="h-3 w-3 opacity-30" />
              <span className="truncate opacity-50">{blog.title}</span>
            </nav>
          </div>
        </div>

        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-12 lg:gap-16">
            {/* Main Content Column */}
            <article className="lg:col-span-8">
              <header className="mb-12">
                <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border/50 bg-foreground/5 px-3 py-1 text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                  <Hash className="h-3 w-3" />
                  {blog.category}
                </div>

                <h1 className="mb-8 font-heading text-3xl leading-tight font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                  {blog.title}
                </h1>

                <div className="flex flex-wrap items-center gap-6 border-y border-border/10 py-6 text-[11px] font-bold tracking-widest text-muted-foreground/60 uppercase">
                  <span className="flex items-center gap-2">
                    <div className="flex h-5 w-5 items-center justify-center rounded-full border border-border/50 bg-muted text-[10px] text-foreground">
                      {blog.author.charAt(0)}
                    </div>
                    {blog.author}
                  </span>
                  <span className="flex items-center gap-2">
                    <Calendar className="h-3.5 w-3.5" />
                    {formattedDate}
                  </span>
                  <span className="flex items-center gap-2">
                    <Clock className="h-3.5 w-3.5" />
                    {blog.readingTime}
                  </span>
                  <span className="flex items-center gap-2">
                    <Eye className="h-3.5 w-3.5" />
                    {blog.views || 0} views
                  </span>
                </div>
              </header>

              {blog.coverImage && (
                <div className="mb-16 overflow-hidden rounded-2xl">
                  <Image
                    src={blog.coverImage}
                    alt={blog.title}
                    width={1000}
                    height={560}
                    className="h-auto w-full object-cover"
                    priority
                    sizes="(max-width: 1000px) 100vw, 1000px"
                  />
                </div>
              )}

              <div className="blog-content">
                <BlogContent content={blog.content} />
              </div>

              {/* Topic Tags */}
              <div className="mt-12 flex flex-wrap gap-2">
                {blog.tags.slice(0, 10).map((tag: string) => (
                  <Link
                    key={tag}
                    href={`/blog?tag=${tag}`}
                    className="rounded-full border border-border/50 bg-muted/50 px-4 py-1.5 text-[10px] font-bold tracking-widest text-muted-foreground uppercase transition-colors hover:bg-foreground hover:text-background"
                  >
                    #{tag}
                  </Link>
                ))}
              </div>

              {relatedPosts.length > 0 && (
                <div className="mt-20 border-t border-border/10 pt-16">
                  <h2 className="mb-12 font-heading text-3xl font-bold tracking-tight">
                    Continue Reading
                  </h2>
                  <RelatedPosts posts={relatedPosts} />
                </div>
              )}
            </article>

            {/* Right Sidebar - Consistent with Homepage */}
            <aside className="mt-16 lg:col-span-4 lg:mt-0">
              <div className="sticky top-24 space-y-12">
                {headings.length > 0 && (
                  <div>
                    <p className="mb-8 text-[10px] font-bold tracking-[0.2em] text-muted-foreground uppercase">
                      On this page
                    </p>
                    <TableOfContents headings={headings} />
                  </div>
                )}

                <div className="border-t border-border/10 pt-8">
                  <p className="mb-8 text-[10px] font-bold tracking-[0.2em] text-muted-foreground uppercase">
                    Share Article
                  </p>
                  <div className="flex items-center justify-between">
                    <ShareButtons url={blogUrl} title={blog.title} />
                    <ReadingMoodToggle />
                  </div>
                </div>

                {/* About Studiva Sidebar Block */}
                <div className="rounded-2xl border border-border/50 bg-muted/50 p-8">
                  <div className="mb-4 flex h-10 items-center">
                    <Image
                      src="/studiva-logo-pink.svg"
                      alt="Studiva Logo"
                      width={160}
                      height={52}
                      className="h-10 w-auto object-contain rounded-[10%]"
                    />
                  </div>
                  <h3 className="mb-4 font-heading text-xl font-bold">
                    About Studiva
                  </h3>
                  <p className="mb-6 text-sm leading-relaxed text-muted-foreground">
                    Insights for the modern student. From academic excellence to
                    productivity hacks, we build the tools you need to succeed.
                  </p>
                  <Link
                    href="/blog"
                    className="text-xs font-bold tracking-widest text-foreground uppercase hover:underline"
                  >
                    Explore our guides →
                  </Link>
                </div>

                {/* Quick Links / Categories */}
                <div className="border-t border-border/10 pt-8">
                  <p className="mb-8 text-[10px] font-bold tracking-[0.2em] text-muted-foreground uppercase">
                    Explore Topics
                  </p>
                  <nav className="space-y-4">
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
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted text-muted-foreground transition-colors group-hover:bg-foreground group-hover:text-background">
                          <cat.icon className="h-4 w-4" />
                        </div>
                        <span className="text-sm font-bold text-foreground/70 transition-colors group-hover:text-foreground">
                          {cat.name}
                        </span>
                      </Link>
                    ))}
                  </nav>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>

      <Footer />
      <BackToTop />
    </>
  )
}
