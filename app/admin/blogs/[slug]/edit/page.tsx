import { notFound } from "next/navigation"
import { connectDB } from "@/lib/db"
import Blog from "@/models/Blog"
import { BlogForm } from "@/components/admin/blog-form"

export const dynamic = "force-dynamic"

interface EditBlogPageProps {
  params: Promise<{ slug: string }>
}

async function getBlog(slug: string) {
  try {
    await connectDB()
    const blog = await Blog.findOne({ slug }).lean()
    return blog ? JSON.parse(JSON.stringify(blog)) : null
  } catch {
    return null
  }
}

export default async function EditBlogPage({ params }: EditBlogPageProps) {
  const { slug } = await params
  const blog = await getBlog(slug)

  if (!blog) notFound()

  return (
    <BlogForm
      isEdit
      slug={blog.slug}
      initialData={{
        title: blog.title,
        excerpt: blog.excerpt,
        coverImage: blog.coverImage || "",
        author: blog.author,
        tags: blog.tags.join(", "),
        category: blog.category,
        content: blog.content,
        isPublished: blog.isPublished,
      }}
    />
  )
}
