import { ImageResponse } from "next/og"
import { connectDB } from "@/lib/db"
import Blog from "@/models/Blog"

export const runtime = "edge"
export const alt = "Studiva Blog"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  try {
    await connectDB()
    const blog = await Blog.findOne({ slug, isPublished: true }).select("title excerpt category author").lean()

    if (!blog) {
      return new ImageResponse(
        (
          <div style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#000',
            color: '#fff',
            fontFamily: 'sans-serif',
          }}>
            <h1 style={{ fontSize: 64, fontWeight: 'bold' }}>Studiva Blog</h1>
          </div>
        ),
        { ...size }
      )
    }

    return new ImageResponse(
      (
        <div style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#0a0a0a',
          backgroundImage: 'radial-gradient(circle at 25px 25px, #ffffff10 2%, transparent 0%), radial-gradient(circle at 75px 75px, #ffffff10 2%, transparent 0%)',
          backgroundSize: '100px 100px',
          padding: '80px',
          fontFamily: 'sans-serif',
          position: 'relative',
        }}>
          {/* Branded elements */}
          <div style={{
            position: 'absolute',
            top: '40px',
            left: '80px',
            display: 'flex',
            alignItems: 'center',
          }}>
            <div style={{
              width: '40px',
              height: '40px',
              backgroundColor: '#3b82f6',
              borderRadius: '8px',
              marginRight: '12px',
            }} />
            <span style={{ fontSize: 24, fontWeight: 'bold', color: '#fff', letterSpacing: '-0.02em' }}>Studiva Blog</span>
          </div>

          <div style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            height: '100%',
            marginTop: '20px',
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '24px',
            }}>
              <span style={{
                backgroundColor: '#3b82f620',
                color: '#3b82f6',
                padding: '6px 16px',
                borderRadius: '99px',
                fontSize: 20,
                fontWeight: 'bold',
                textTransform: 'uppercase',
                border: '1px solid #3b82f630',
              }}>
                {blog.category}
              </span>
            </div>
            
            <h1 style={{
              fontSize: 72,
              fontWeight: 'bold',
              color: '#fff',
              lineHeight: 1.1,
              marginBottom: '32px',
              letterSpacing: '-0.04em',
            }}>
              {blog.title}
            </h1>

            <p style={{
              fontSize: 28,
              color: '#a1a1aa',
              lineHeight: 1.4,
              marginBottom: '48px',
              maxWidth: '900px',
            }}>
              {blog.excerpt.length > 160 ? blog.excerpt.substring(0, 157) + '...' : blog.excerpt}
            </p>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            marginTop: 'auto',
          }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '24px',
              backgroundColor: '#27272a',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontSize: 20,
              fontWeight: 'bold',
              marginRight: '16px',
            }}>
              {blog.author.charAt(0)}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ color: '#fff', fontSize: 20, fontWeight: 'bold' }}>{blog.author}</span>
              <span style={{ color: '#71717a', fontSize: 16 }}>Studiva Author</span>
            </div>
          </div>
        </div>
      ),
      { ...size }
    )
  } catch (error) {
    return new ImageResponse(
      (
        <div style={{ backgroundColor: '#000', color: '#fff', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <h1>Studiva Blog</h1>
        </div>
      ),
      { ...size }
    )
  }
}
