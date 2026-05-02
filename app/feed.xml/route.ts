import { connectDB } from "@/lib/db"
import Blog from "@/models/Blog"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://blog.studiva.co.in"
const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME || "Studiva Blog"

export async function GET() {
  try {
    await connectDB()

    const blogs = await Blog.find({ isPublished: true })
      .sort({ publishedAt: -1 })
      .limit(50)
      .select("title slug excerpt author publishedAt")
      .lean()

    const items = blogs
      .map(
        (blog) => `
    <item>
      <title><![CDATA[${blog.title}]]></title>
      <link>${SITE_URL}/blog/${blog.slug}</link>
      <guid isPermaLink="true">${SITE_URL}/blog/${blog.slug}</guid>
      <description><![CDATA[${blog.excerpt}]]></description>
      <author>${blog.author}</author>
      <pubDate>${new Date(blog.publishedAt).toUTCString()}</pubDate>
    </item>`
      )
      .join("")

    const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${SITE_NAME}</title>
    <link>${SITE_URL}</link>
    <description>Your go-to resource for student tips, academic insights, and productivity hacks.</description>
    <language>en-in</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml"/>
    ${items}
  </channel>
</rss>`

    return new Response(rss, {
      headers: {
        "Content-Type": "application/xml",
        "Cache-Control": "s-maxage=3600, stale-while-revalidate",
      },
    })
  } catch {
    return new Response("<rss version='2.0'><channel></channel></rss>", {
      headers: { "Content-Type": "application/xml" },
      status: 500,
    })
  }
}
