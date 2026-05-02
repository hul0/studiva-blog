import { NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import Blog, { generateSlug } from "@/models/Blog"
import { isAuthenticated } from "@/lib/auth"

interface RouteParams {
  params: Promise<{ slug: string }>
}

// GET /api/blogs/[slug] — Get single blog
export async function GET(_request: Request, { params }: RouteParams) {
  try {
    await connectDB()
    const { slug } = await params

    const blog = await Blog.findOne({ slug }).lean()

    if (!blog) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 })
    }

    return NextResponse.json({ blog })
  } catch (error) {
    console.error("Error fetching blog:", error)
    return NextResponse.json(
      { error: "Failed to fetch blog" },
      { status: 500 }
    )
  }
}

// PUT /api/blogs/[slug] — Update blog (admin only)
export async function PUT(request: Request, { params }: RouteParams) {
  try {
    const authenticated = await isAuthenticated()
    if (!authenticated) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectDB()
    const { slug } = await params
    const body = await request.json()

    const blog = await Blog.findOne({ slug })
    if (!blog) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 })
    }

    // Update fields
    if (body.title) {
      blog.title = body.title
      // Regenerate slug if title changed
      const newSlug = generateSlug(body.title)
      if (newSlug !== slug) {
        const existing = await Blog.findOne({ slug: newSlug })
        if (existing && existing._id.toString() !== blog._id.toString()) {
          return NextResponse.json(
            { error: "A blog with a similar title already exists" },
            { status: 409 }
          )
        }
        blog.slug = newSlug
      }
    }

    if (body.excerpt !== undefined) blog.excerpt = body.excerpt
    if (body.coverImage !== undefined) blog.coverImage = body.coverImage
    if (body.author !== undefined) blog.author = body.author
    if (body.tags !== undefined) blog.tags = body.tags
    if (body.category !== undefined) blog.category = body.category
    if (body.content !== undefined) blog.content = body.content

    if (body.isPublished !== undefined) {
      // If publishing for the first time, set publishedAt
      if (body.isPublished && !blog.isPublished) {
        blog.publishedAt = new Date()
      }
      blog.isPublished = body.isPublished
    }

    await blog.save()

    return NextResponse.json({ blog })
  } catch (error) {
    console.error("Error updating blog:", error)
    return NextResponse.json(
      { error: "Failed to update blog" },
      { status: 500 }
    )
  }
}

// DELETE /api/blogs/[slug] — Delete blog (admin only)
export async function DELETE(_request: Request, { params }: RouteParams) {
  try {
    const authenticated = await isAuthenticated()
    if (!authenticated) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectDB()
    const { slug } = await params

    const blog = await Blog.findOneAndDelete({ slug })
    if (!blog) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting blog:", error)
    return NextResponse.json(
      { error: "Failed to delete blog" },
      { status: 500 }
    )
  }
}
