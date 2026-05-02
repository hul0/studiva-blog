import Link from "next/link"
import Image from "next/image"
import { Calendar, Clock } from "lucide-react"

interface RelatedPost {
  title: string
  slug: string
  excerpt: string
  coverImage?: string
  publishedAt: string
  readingTime: string
}

interface RelatedPostsProps {
  posts: RelatedPost[]
}

export function RelatedPosts({ posts }: RelatedPostsProps) {
  if (posts.length === 0) return null

  return (
    <section className="mt-16 border-t border-border pt-12">
      <h2 className="mb-6 font-heading text-2xl font-semibold tracking-tight">
        Related Articles
      </h2>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="group flex flex-col overflow-hidden rounded-lg border border-border bg-card transition-all hover:shadow-md"
          >
            {post.coverImage && (
              <div className="relative aspect-[16/9] overflow-hidden">
                <Image
                  src={post.coverImage}
                  alt={post.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
            )}
            <div className="flex flex-1 flex-col p-4">
              <h3 className="mb-2 line-clamp-2 text-sm font-semibold leading-snug text-foreground group-hover:text-primary">
                {post.title}
              </h3>
              <p className="mb-3 line-clamp-2 flex-1 text-xs leading-relaxed text-muted-foreground">
                {post.excerpt}
              </p>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {new Date(post.publishedAt).toLocaleDateString("en-IN", {
                    month: "short",
                    day: "numeric",
                  })}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {post.readingTime}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
