import { NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import Blog, { generateSlug } from "@/models/Blog"
import { isAuthenticated } from "@/lib/auth"

// GET /api/blogs — List blogs with pagination, search, filters
export async function GET(request: Request) {
  try {
    await connectDB()

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "12")
    const search = searchParams.get("search") || ""
    const tag = searchParams.get("tag") || ""
    const category = searchParams.get("category") || ""
    const published = searchParams.get("published") // "all" for admin

    const skip = (page - 1) * limit

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const query: any = {}

    // Only show published by default (admin can see all)
    if (published !== "all") {
      query.isPublished = true
    }

    if (search) {
      query.$text = { $search: search }
    }

    if (tag) {
      query.tags = { $in: [tag.toLowerCase()] }
    }

    if (category) {
      query.category = category
    }

    const [blogs, total] = await Promise.all([
      Blog.find(query)
        .sort({ publishedAt: -1 })
        .skip(skip)
        .limit(limit)
        .select("-content")
        .lean(),
      Blog.countDocuments(query),
    ])

    return NextResponse.json({
      blogs,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasMore: skip + limit < total,
      },
    })
  } catch (error) {
    console.error("Error fetching blogs:", error)
    return NextResponse.json(
      { error: "Failed to fetch blogs" },
      { status: 500 }
    )
  }
}

// POST /api/blogs — Create a blog (admin only)
export async function POST(request: Request) {
  try {
    const authenticated = await isAuthenticated()
    if (!authenticated) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectDB()

    const body = await request.json()
    const { title, excerpt, coverImage, author, tags, category, content, isPublished } = body

    if (!title || !excerpt || !content) {
      return NextResponse.json(
        { error: "Title, excerpt, and content are required" },
        { status: 400 }
      )
    }

    const slug = generateSlug(title)

    // Check slug uniqueness
    const existing = await Blog.findOne({ slug })
    if (existing) {
      return NextResponse.json(
        { error: "A blog with a similar title already exists" },
        { status: 409 }
      )
    }

    const blog = await Blog.create({
      title,
      slug,
      excerpt,
      coverImage: coverImage || "",
      author: author || "Studiva Team",
      tags: tags || [],
      category: category || "General",
      content,
      isPublished: isPublished || false,
      publishedAt: isPublished ? new Date() : undefined,
    })

    return NextResponse.json({ blog }, { status: 201 })
  } catch (error) {
    console.error("Error creating blog:", error)
    const message = error instanceof Error ? error.message : "Failed to create blog"
    return NextResponse.json(
      { error: message },
      { status: 500 }
    )
  }
}
