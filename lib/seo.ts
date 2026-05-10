import type { Metadata } from "next"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://blog.studiva.co.in"
const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME || "Studiva Blog"

export const defaultMetadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — Student Productivity & Academic Success`,
    template: `%s | ${SITE_NAME}`,
  },
  description:
    "Studiva Blog: The definitive guide for student productivity, academic excellence, and modern education strategy. Research-backed study tips and learning systems.",
  keywords: [
    "studiva",
    "student blog",
    "productivity for students",
    "academic excellence",
    "study techniques",
    "learning systems",
    "university tips",
    "high-achieving students",
    "academic strategy",
  ],
  authors: [{ name: "Studiva Team" }],
  creator: "Studiva",
  publisher: "Studiva",
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: `${SITE_NAME} — Insights for Modern Students`,
    description:
      "Research-backed strategies for student productivity, academic excellence, and success. Built for the modern lifelong learner.",
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
      "Research-backed strategies for student productivity, academic excellence, and success.",
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
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: SITE_NAME,
  },
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
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
        isPartOf: {
          "@id": `${url}#webpage`,
        },
        author: {
          "@id": `${SITE_URL}/#organization`,
        },
        headline: blog.title,
        datePublished: blog.publishedAt,
        dateModified: blog.updatedAt,
        mainEntityOfPage: {
          "@id": `${url}#webpage`,
        },
        publisher: {
          "@id": `${SITE_URL}/#organization`,
        },
        image: {
          "@id": `${url}#primaryimage`,
        },
        description: blog.excerpt,
        articleSection: [blog.category],
        keywords: blog.tags.join(", "),
        inLanguage: "en-IN",
      },
      {
        "@type": "WebPage",
        "@id": `${url}#webpage`,
        url,
        name: blog.title,
        isPartOf: {
          "@id": `${SITE_URL}/#website`,
        },
        primaryImageOfPage: {
          "@id": `${url}#primaryimage`,
        },
        datePublished: blog.publishedAt,
        dateModified: blog.updatedAt,
        description: blog.excerpt,
        breadcrumb: {
          "@id": `${url}#breadcrumb`,
        },
        inLanguage: "en-IN",
      },
      {
        "@type": "ImageObject",
        "@id": `${url}#primaryimage`,
        inLanguage: "en-IN",
        url: blog.coverImage || `${SITE_URL}/og-default.png`,
        contentUrl: blog.coverImage || `${SITE_URL}/og-default.png`,
        width: 1200,
        height: 630,
        caption: blog.title,
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${url}#breadcrumb`,
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
          },
        ],
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: SITE_URL,
        name: SITE_NAME,
        publisher: {
          "@id": `${SITE_URL}/#organization`,
        },
      },
      {
        "@type": "Organization",
        "@id": `${SITE_URL}/#organization`,
        name: "Studiva",
        url: SITE_URL,
        logo: {
          "@type": "ImageObject",
          url: `${SITE_URL}/logo.png`,
          width: 512,
          height: 512,
        },
      },
    ],
  }
}

export function generateWebsiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: SITE_URL,
        name: SITE_NAME,
        description:
          "The definitive guide for student productivity, academic excellence, and modern education strategy.",
        publisher: {
          "@id": `${SITE_URL}/#organization`,
        },
        potentialAction: [
          {
            "@type": "SearchAction",
            target: {
              "@type": "EntryPoint",
              urlTemplate: `${SITE_URL}/blog?search={search_term_string}`,
            },
            "query-input": "required name=search_term_string",
          },
        ],
        inLanguage: "en-IN",
      },
      {
        "@type": "Organization",
        "@id": `${SITE_URL}/#organization`,
        name: "Studiva",
        url: SITE_URL,
        logo: {
          "@type": "ImageObject",
          "@id": `${SITE_URL}/#logo`,
          url: `${SITE_URL}/logo.png`,
          contentUrl: `${SITE_URL}/logo.png`,
          width: 512,
          height: 512,
          caption: "Studiva",
        },
        image: {
          "@id": `${SITE_URL}/#logo`,
        },
        sameAs: [
          "https://twitter.com/studiva",
          "https://instagram.com/studiva",
          "https://linkedin.com/company/studiva",
        ],
      },
      {
        "@type": "WebPage",
        "@id": `${SITE_URL}/#webpage`,
        url: SITE_URL,
        name: SITE_NAME,
        isPartOf: { "@id": `${SITE_URL}/#website` },
        about: { "@id": `${SITE_URL}/#organization` },
        description:
          "Studiva Blog — Your go-to resource for student tips, academic insights, productivity hacks, and everything education.",
        breadcrumb: { "@id": `${SITE_URL}/#breadcrumb` },
        inLanguage: "en-IN",
        potentialAction: [
          {
            "@type": "ReadAction",
            target: [SITE_URL],
          },
        ],
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${SITE_URL}/#breadcrumb`,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
          },
        ],
      },
    ],
  }
}
