import { MDXRemote } from "next-mdx-remote/rsc"
import remarkGfm from "remark-gfm"
import remarkMath from "remark-math"
import rehypeHighlight from "rehype-highlight"
import rehypeKatex from "rehype-katex"
import Image from "next/image"
import type { MDXComponents } from "mdx/types"

import { cn } from "@/lib/utils"
import { CopyButton } from "./copy-button"

const getTextContent = (children: any): string => {
  if (typeof children === "string") return children
  if (Array.isArray(children)) return children.map(getTextContent).join("")
  if (children?.props?.children) return getTextContent(children.props.children)
  return ""
}

const slugify = (text: string) => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "")
}

const mdxComponents: MDXComponents = {
  img: (props) => (
    <figure className="my-10 block overflow-hidden rounded-lg border border-border/10">
      <Image
        src={props.src || ""}
        alt={props.alt || ""}
        width={1200}
        height={675}
        className="h-auto w-full object-cover"
        sizes="(max-width: 768px) 100vw, 800px"
      />
      {props.alt && (
        <figcaption className="mt-3 text-center text-sm text-muted-foreground italic">
          {props.alt}
        </figcaption>
      )}
    </figure>
  ),
  pre: (props: any) => (
    <div className="group relative my-8">
      <pre className="overflow-x-auto rounded-md border border-border/10 bg-muted/30 p-4 font-mono text-sm leading-relaxed">
        {props.children}
      </pre>
      <CopyButton content={props.children?.props?.children || ""} />
    </div>
  ),
  code: (props) => {
    const isInline = typeof props.children === "string"
    if (isInline && !props.className) {
      return (
        <code className="rounded bg-muted/50 px-1.5 py-0.5 text-sm font-medium text-foreground">
          {props.children}
        </code>
      )
    }
    return <code {...props} />
  },
  blockquote: (props) => (
    <blockquote className="my-10 border-l-4 border-foreground/10 py-1 pl-6 text-xl text-foreground/70 italic">
      {props.children}
    </blockquote>
  ),
  table: (props) => (
    <div className="my-10 overflow-x-auto rounded-md border border-border/10">
      <table className="min-w-full divide-y divide-border/10 text-sm">
        {props.children}
      </table>
    </div>
  ),
  th: (props) => (
    <th className="bg-muted/30 px-4 py-3 text-left text-xs font-bold tracking-widest text-foreground/50 uppercase">
      {props.children}
    </th>
  ),
  td: (props) => (
    <td className="border-t border-border/10 px-4 py-3 text-muted-foreground">
      {props.children}
    </td>
  ),
  a: (props) => (
    <a
      {...props}
      className="text-foreground underline decoration-foreground/20 underline-offset-4 transition-colors hover:text-muted-foreground"
      target={props.href?.startsWith("http") ? "_blank" : undefined}
      rel={props.href?.startsWith("http") ? "noopener noreferrer" : undefined}
    >
      {props.children}
    </a>
  ),
  h1: (props: any) => (
    <h1
      id={slugify(getTextContent(props.children))}
      className="mt-12 mb-6 font-heading text-3xl font-bold tracking-tight text-foreground"
      {...props}
    />
  ),
  h2: (props: any) => (
    <h2
      id={slugify(getTextContent(props.children))}
      className="mt-10 mb-5 font-heading text-2xl font-bold tracking-tight text-foreground"
      {...props}
    />
  ),
  h3: (props: any) => (
    <h3
      id={slugify(getTextContent(props.children))}
      className="mt-8 mb-4 font-heading text-xl font-bold tracking-tight text-foreground"
      {...props}
    />
  ),
  h4: (props: any) => (
    <h4
      id={slugify(getTextContent(props.children))}
      className="mt-6 mb-4 font-heading text-lg font-bold tracking-tight text-foreground"
      {...props}
    />
  ),
  h5: (props: any) => (
    <h5
      id={slugify(getTextContent(props.children))}
      className="mt-4 mb-2 font-heading text-base font-bold tracking-tight text-foreground"
      {...props}
    />
  ),
  h6: (props: any) => (
    <h6
      id={slugify(getTextContent(props.children))}
      className="mt-4 mb-2 font-heading text-sm font-bold tracking-tight text-foreground"
      {...props}
    />
  ),
  p: (props: any) => (
    <p className="my-6 text-lg leading-relaxed text-foreground/80">
      {props.children}
    </p>
  ),
  ul: (props) => (
    <ul className="my-6 list-disc space-y-2 pl-6 text-lg text-foreground/80">
      {props.children}
    </ul>
  ),
  ol: (props) => (
    <ol className="my-6 list-decimal space-y-2 pl-6 text-lg text-foreground/80">
      {props.children}
    </ol>
  ),
  li: (props) => <li className="pl-2">{props.children}</li>,
  hr: () => <hr className="my-12 border-border/10" />,
  div: (props: any) => <div {...props} />,
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
            rehypePlugins: [rehypeHighlight, rehypeKatex],
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
  const headingRegex = /^(#{2,6})\s+(.+)$/gm
  const headings: { id: string; text: string; level: number }[] = []
  let match

  while ((match = headingRegex.exec(content)) !== null) {
    const level = match[1].length
    const text = match[2]
      .replace(/\*\*(.+?)\*\*/g, "$1")
      .replace(/\*(.+?)\*/g, "$1")
      .replace(/__(.+?)__/g, "$1")
      .replace(/_(.+?)_/g, "$1")
      .replace(/\[(.+?)\]\(.+?\)/g, "$1")
      .trim()
    const id = slugify(text)

    // Skip SEO optimization titles in TOC
    if (text.toLowerCase().includes("target keywords")) continue

    headings.push({ id, text, level })
  }

  return headings
}
