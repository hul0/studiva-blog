import { NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import Blog from "@/models/Blog"
import View from "@/models/View"
import crypto from "crypto"

export async function POST(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    await connectDB()

    const blog = await Blog.findOne({ slug, isPublished: true }).select("_id")
    if (!blog) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 })
    }

    // Simple IP-based deduplication
    const ip = request.headers.get("x-forwarded-for") || "unknown"
    const ipHash = crypto.createHash("sha256").update(ip).digest("hex")

    // Check if viewed in the last 24 hours
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000)
    const existingView = await View.findOne({
      blogId: blog._id,
      ipHash,
      timestamp: { $gt: yesterday },
    })

    if (!existingView) {
      await Promise.all([
        View.create({ blogId: blog._id, ipHash }),
        Blog.updateOne({ _id: blog._id }, { $inc: { views: 1 } }),
      ])
      return NextResponse.json({ success: true, newView: true })
    }

    return NextResponse.json({ success: true, newView: false })
  } catch (error) {
    console.error("View tracking error:", error)
    return NextResponse.json({ error: "Failed to track view" }, { status: 500 })
  }
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    await connectDB()
    const blog = await Blog.findOne({ slug }).select("views")
    return NextResponse.json({ views: blog?.views || 0 })
  } catch {
    return NextResponse.json({ views: 0 })
  }
}
