import mongoose, { Schema, type Document, type Model } from "mongoose"
import readingTime from "reading-time"

export interface IBlog extends Document {
  title: string
  slug: string
  excerpt: string
  coverImage: string
  author: string
  tags: string[]
  category: string
  content: string
  publishedAt: Date
  updatedAt: Date
  readingTime: string
  views: number
  isPublished: boolean
}

const BlogSchema = new Schema<IBlog>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, index: true },
    excerpt: { type: String, required: true, trim: true },
    coverImage: { type: String, default: "" },
    author: { type: String, default: "Studiva Team" },
    tags: [{ type: String, lowercase: true, trim: true }],
    category: { type: String, default: "General", trim: true },
    content: { type: String, required: true },
    readingTime: { type: String, default: "1 min read" },
    views: { type: Number, default: 0 },
    isPublished: { type: Boolean, default: false, index: true },
    publishedAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
)

// Text index for full-text search
BlogSchema.index({ title: "text", excerpt: "text", tags: "text" })

// Pre-save: auto-calculate reading time
BlogSchema.pre("save", function () {
  if (this.isModified("content")) {
    const stats = readingTime(this.content)
    this.readingTime = stats.text
  }
})

export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "")
}

const Blog: Model<IBlog> =
  mongoose.models.Blog || mongoose.model<IBlog>("Blog", BlogSchema)

export default Blog
