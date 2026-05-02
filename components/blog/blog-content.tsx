import { MDXRemote } from "next-mdx-remote/rsc"
import remarkGfm from "remark-gfm"
import remarkMath from "remark-math"
import rehypeSlug from "rehype-slug"
import rehypeAutolinkHeadings from "rehype-autolink-headings"
import rehypeHighlight from "rehype-highlight"
import rehypeKatex from "rehype-katex"
import Image from "next/image"
import type { MDXComponents } from "mdx/types"

const mdxComponents: MDXComponents = {
  img: (props) => (
    <span className="my-6 block overflow-hidden rounded-lg">
      <Image
        src={props.src || ""}
        alt={props.alt || ""}
        width={800}
        height={450}
        className="w-full rounded-lg"
        sizes="(max-width: 768px) 100vw, 700px"
      />
    </span>
  ),
  pre: (props) => (
    <pre className="relative overflow-x-auto rounded-lg border border-border bg-muted/50 p-4 text-sm">
      {props.children}
    </pre>
  ),
  code: (props) => {
    // Inline code
    const isInline = typeof props.children === "string"
    if (isInline && !props.className) {
      return (
        <code className="rounded bg-muted px-1.5 py-0.5 text-sm font-medium text-foreground">
          {props.children}
        </code>
      )
    }
    return <code {...props} />
  },
  blockquote: (props) => (
    <blockquote className="border-l-4 border-primary/50 bg-primary/5 py-1 pl-4 pr-4 italic text-muted-foreground [&>p]:my-2">
      {props.children}
    </blockquote>
  ),
  table: (props) => (
    <div className="my-6 overflow-x-auto rounded-lg border border-border">
      <table className="min-w-full divide-y divide-border text-sm">
        {props.children}
      </table>
    </div>
  ),
  th: (props) => (
    <th className="bg-muted/50 px-4 py-3 text-left font-semibold text-foreground">
      {props.children}
    </th>
  ),
  td: (props) => (
    <td className="px-4 py-3 text-muted-foreground">{props.children}</td>
  ),
  a: (props) => (
    <a
      {...props}
      className="font-medium text-primary underline decoration-primary/30 underline-offset-2 transition-colors hover:decoration-primary"
      target={props.href?.startsWith("http") ? "_blank" : undefined}
      rel={props.href?.startsWith("http") ? "noopener noreferrer" : undefined}
    >
      {props.children}
    </a>
  ),
  h1: (props) => (
    <h1
      className="mt-10 mb-4 scroll-mt-20 font-heading text-3xl font-bold tracking-tight"
      {...props}
    />
  ),
  h2: (props) => (
    <h2
      className="mt-8 mb-3 scroll-mt-20 font-heading text-2xl font-semibold tracking-tight"
      {...props}
    />
  ),
  h3: (props) => (
    <h3
      className="mt-6 mb-3 scroll-mt-20 font-heading text-xl font-semibold"
      {...props}
    />
  ),
  h4: (props) => (
    <h4
      className="mt-5 mb-2 scroll-mt-20 font-heading text-lg font-semibold"
      {...props}
    />
  ),
  p: (props) => (
    <p className="my-4 leading-7 text-foreground/90">{props.children}</p>
  ),
  ul: (props) => (
    <ul className="my-4 list-disc space-y-2 pl-6 text-foreground/90 marker:text-muted-foreground">
      {props.children}
    </ul>
  ),
  ol: (props) => (
    <ol className="my-4 list-decimal space-y-2 pl-6 text-foreground/90 marker:text-muted-foreground">
      {props.children}
    </ol>
  ),
  li: (props) => <li className="leading-7">{props.children}</li>,
  hr: () => <hr className="my-8 border-border" />,
}

interface BlogContentProps {
  content: string
}

export function BlogContent({ content }: BlogContentProps) {
  return (
    <div className="blog-content">
      <MDXRemote
        source={content}
        options={{
          mdxOptions: {
            remarkPlugins: [remarkGfm, remarkMath],
            rehypePlugins: [
              rehypeSlug,
              [rehypeAutolinkHeadings, { behavior: "wrap" }],
              rehypeHighlight,
              rehypeKatex,
            ],
          },
        }}
        components={mdxComponents}
      />
    </div>
  )
}

// Utility: extract headings from markdown for TOC
export function extractHeadings(
  content: string
): { id: string; text: string; level: number }[] {
  const headingRegex = /^(#{2,4})\s+(.+)$/gm
  const headings: { id: string; text: string; level: number }[] = []
  let match

  while ((match = headingRegex.exec(content)) !== null) {
    const level = match[1].length
    const text = match[2].replace(/\*\*(.+?)\*\*/g, "$1").trim()
    const id = text
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")

    headings.push({ id, text, level })
  }

  return headings
}
