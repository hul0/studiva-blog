import Link from "next/link"
import Image from "next/image"

interface BlogCardProps {
  title: string
  slug: string
  excerpt: string
  coverImage?: string
  author: string
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
    <article className="group flex flex-col h-full rounded-2xl border border-border/40 p-3 bg-card transition-all duration-150 hover:border-border/80 hover:shadow-lg hover:shadow-foreground/5">
      {/* Small Cover Image */}
      {coverImage && (
        <Link href={`/blog/${slug}`} className="relative aspect-[16/9] w-full overflow-hidden rounded-xl bg-muted mb-4">
          <Image
            src={coverImage}
            alt={title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute top-2 left-2">
             <span className="px-2 py-0.5 rounded-md bg-background/90 backdrop-blur-md text-[8px] font-bold uppercase tracking-widest text-foreground border border-border/10">
                {category}
             </span>
          </div>
        </Link>
      )}

      <div className="flex flex-1 flex-col">
        {/* Meta */}
        <div className="mb-2 flex items-center gap-2 text-[9px] font-bold uppercase tracking-widest text-muted-foreground/60">
          <span>{formattedDate}</span>
          <span className="h-1 w-1 rounded-full bg-border" />
          <span>{readingTime}</span>
        </div>

        {/* Title */}
        <h3 className="mb-2 line-clamp-2 font-heading text-lg font-bold leading-tight tracking-tight text-foreground">
          <Link href={`/blog/${slug}`}>{title}</Link>
        </h3>

        {/* Excerpt */}
        <p className="mb-4 line-clamp-2 text-xs leading-relaxed text-muted-foreground/80">
          {excerpt}
        </p>

        {/* Footer */}
        <div className="mt-auto pt-3 border-t border-border/5 flex items-center justify-between text-[9px] font-bold uppercase tracking-widest text-muted-foreground">
           <span>By {author}</span>
           <Link href={`/blog/${slug}`} className="text-foreground hover:underline">
              Read →
           </Link>
        </div>
      </div>
    </article>
  )
}
