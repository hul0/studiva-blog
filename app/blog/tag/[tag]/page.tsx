import { Metadata } from "next"
import { notFound } from "next/navigation"
import { connectDB } from "@/lib/db"
import Blog from "@/models/Blog"
import { BlogCard } from "@/components/blog/blog-card"
import { unstable_cache } from "next/cache"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { IBlog } from "@/types/blog"

interface TagPageProps {
  params: Promise<{ tag: string }>
}

const getTagData = async (tag: string): Promise<IBlog[] | null> => {
  return unstable_cache(
    async (): Promise<IBlog[] | null> => {
      try {
        await connectDB()
        const blogs = await Blog.find({ 
          tags: { $in: [tag.toLowerCase()] }, 
          isPublished: true 
        })
          .sort({ publishedAt: -1 })
          .select("-content")
          .lean()
        
        if (blogs.length === 0) return null

        return JSON.parse(JSON.stringify(blogs))
      } catch {
        return null
      }
    },
    [`tag-${tag}`],
    { revalidate: 60, tags: ["blogs"] }
  )()
}

export async function generateMetadata({ params }: TagPageProps): Promise<Metadata> {
  const { tag } = await params
  const decodedTag = decodeURIComponent(tag)
  const title = `#${decodedTag} - Studiva Blog`
  const description = `Articles tagged with #${decodedTag} on Studiva Blog.`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
    },
  }
}

export default async function TagPage({ params }: TagPageProps) {
  const { tag } = await params
  const decodedTag = decodeURIComponent(tag)
  const blogs = await getTagData(decodedTag)

  if (!blogs) {
    notFound()
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background">
        <div className="border-b border-border/50 bg-muted/20 py-20">
          <div className="mx-auto max-w-6xl px-4 text-center">
            <span className="inline-block rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
              Tag
            </span>
            <h1 className="mt-4 font-heading text-4xl font-bold tracking-tight text-foreground sm:text-6xl">
              #{decodedTag}
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
              Explore articles tagged with #{decodedTag}.
            </p>
          </div>
        </div>

        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {blogs.map((blog: IBlog) => (
              <BlogCard
                key={blog._id.toString()}
                title={blog.title}
                slug={blog.slug}
                excerpt={blog.excerpt}
                coverImage={blog.coverImage}
                author={blog.author}
                category={blog.category}
                publishedAt={blog.publishedAt.toString()}
                readingTime={blog.readingTime}
              />
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
