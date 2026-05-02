import Link from "next/link"
import Image from "next/image"
import { Calendar, Clock, ArrowRight } from "lucide-react"

interface BlogCardProps {
  title: string
  slug: string
  excerpt: string
  coverImage?: string
  author: string
  tags: string[]
  category: string
  publishedAt: string
  readingTime: string
}

export function BlogCard({
  title,
  slug,
  excerpt,
  coverImage,
  author,
  tags,
  category,
  publishedAt,
  readingTime,
}: BlogCardProps) {
  const formattedDate = new Date(publishedAt).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-xl border border-border bg-card transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 dark:hover:shadow-primary/10">
      {/* Cover Image */}
      {coverImage && (
        <Link href={`/blog/${slug}`} className="relative aspect-[16/9] overflow-hidden">
          <Image
            src={coverImage}
            alt={title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        </Link>
      )}

      <div className="flex flex-1 flex-col p-5">
        {/* Category & Tags */}
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
            {category}
          </span>
          {tags.slice(0, 2).map((tag) => (
            <Link
              key={tag}
              href={`/blog?tag=${tag}`}
              className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              #{tag}
            </Link>
          ))}
        </div>

        {/* Title */}
        <h2 className="mb-2 line-clamp-2 font-heading text-lg font-semibold leading-snug tracking-tight text-foreground transition-colors group-hover:text-primary">
          <Link href={`/blog/${slug}`}>{title}</Link>
        </h2>

        {/* Excerpt */}
        <p className="mb-4 line-clamp-2 flex-1 text-sm leading-relaxed text-muted-foreground">
          {excerpt}
        </p>

        {/* Meta */}
        <div className="flex items-center justify-between border-t border-border pt-4">
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              {formattedDate}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              {readingTime}
            </span>
          </div>
          <span className="text-xs text-muted-foreground">{author}</span>
        </div>
      </div>

      {/* Hover indicator */}
      <Link
        href={`/blog/${slug}`}
        className="absolute bottom-5 right-5 inline-flex h-8 w-8 translate-x-2 items-center justify-center rounded-full bg-primary text-primary-foreground opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100"
        aria-label={`Read ${title}`}
      >
        <ArrowRight className="h-4 w-4" />
      </Link>
    </article>
  )
}
