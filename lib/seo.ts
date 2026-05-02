import type { Metadata } from "next"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://blog.studiva.co.in"
const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME || "Studiva Blog"

export const defaultMetadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — Insights for Students`,
    template: `%s | ${SITE_NAME}`,
  },
  description:
    "Studiva Blog — Your go-to resource for student tips, academic insights, productivity hacks, and everything education.",
  keywords: [
    "studiva",
    "student blog",
    "education",
    "productivity",
    "academic tips",
    "study guides",
  ],
  authors: [{ name: "Studiva Team" }],
  creator: "Studiva",
  publisher: "Studiva",
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: SITE_NAME,
    description:
      "Your go-to resource for student tips, academic insights, and productivity hacks.",
    images: [
      {
        url: `${SITE_URL}/og-default.png`,
        width: 1200,
        height: 630,
        alt: SITE_NAME,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description:
      "Your go-to resource for student tips, academic insights, and productivity hacks.",
    images: [`${SITE_URL}/og-default.png`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: SITE_URL,
    types: {
      "application/rss+xml": `${SITE_URL}/feed.xml`,
    },
  },
}

export interface BlogPostSEO {
  title: string
  slug: string
  excerpt: string
  coverImage?: string
  author: string
  tags: string[]
  category: string
  publishedAt: string
  updatedAt: string
}

export function generateBlogMetadata(blog: BlogPostSEO): Metadata {
  const url = `${SITE_URL}/blog/${blog.slug}`

  return {
    title: blog.title,
    description: blog.excerpt,
    keywords: blog.tags,
    authors: [{ name: blog.author }],
    openGraph: {
      type: "article",
      url,
      title: blog.title,
      description: blog.excerpt,
      siteName: SITE_NAME,
      publishedTime: blog.publishedAt,
      modifiedTime: blog.updatedAt,
      authors: [blog.author],
      tags: blog.tags,
      images: blog.coverImage
        ? [
            {
              url: blog.coverImage,
              width: 1200,
              height: 630,
              alt: blog.title,
            },
          ]
        : [],
    },
    twitter: {
      card: "summary_large_image",
      title: blog.title,
      description: blog.excerpt,
      images: blog.coverImage ? [blog.coverImage] : [],
    },
    alternates: {
      canonical: url,
    },
  }
}

export function generateBlogJsonLd(blog: BlogPostSEO) {
  const url = `${SITE_URL}/blog/${blog.slug}`

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BlogPosting",
        "@id": `${url}#article`,
        headline: blog.title,
        description: blog.excerpt,
        image: blog.coverImage || `${SITE_URL}/og-default.png`,
        datePublished: blog.publishedAt,
        dateModified: blog.updatedAt,
        author: {
          "@type": "Person",
          name: blog.author,
        },
        publisher: {
          "@type": "Organization",
          name: SITE_NAME,
          logo: {
            "@type": "ImageObject",
            url: `${SITE_URL}/logo.png`,
          },
        },
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": url,
        },
        keywords: blog.tags.join(", "),
        articleSection: blog.category,
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: SITE_URL,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Blog",
            item: `${SITE_URL}/blog`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: blog.title,
            item: url,
          },
        ],
      },
    ],
  }
}

export function generateWebsiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    description:
      "Your go-to resource for student tips, academic insights, and productivity hacks.",
    publisher: {
      "@type": "Organization",
      name: "Studiva",
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/logo.png`,
      },
    },
  }
}
