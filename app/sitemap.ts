import { connectDB } from "@/lib/db"
import Blog from "@/models/Blog"
import type { MetadataRoute } from "next"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://blog.studiva.co.in"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${SITE_URL}/blog`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
  ]

  try {
    await connectDB()
    const blogs = await Blog.find({ isPublished: true })
      .select("slug updatedAt")
      .lean()

    const blogPages: MetadataRoute.Sitemap = blogs.map((blog) => ({
      url: `${SITE_URL}/blog/${blog.slug}`,
      lastModified: blog.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }))

    return [...staticPages, ...blogPages]
  } catch {
    return staticPages
  }
}
