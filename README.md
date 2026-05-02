# Studiva™ Blog

A blazing-fast, SEO-optimized blogging platform built with Next.js 16, MongoDB, and Tailwind CSS.

## Tech Stack

- **Framework**: Next.js 16 (App Router, TypeScript)
- **Database**: MongoDB (Mongoose ODM)
- **Styling**: Tailwind CSS v4 + ShadCN UI
- **Markdown**: MDX with syntax highlighting, GFM, LaTeX
- **SEO**: Native Next.js metadata API + JSON-LD structured data
- **Auth**: JWT-based admin authentication

## Getting Started

### 1. Install dependencies

```bash
pnpm install
```

### 2. Set up environment variables

Copy `.env.example` to `.env.local` and fill in your values:

```bash
cp .env.example .env.local
```

Required variables:
- `MONGODB_URI` — Your MongoDB connection string
- `ADMIN_USERNAME` — Admin panel username
- `ADMIN_PASSWORD` — Admin panel password
- `JWT_SECRET` — Secret key for JWT tokens
- `NEXT_PUBLIC_SITE_URL` — Your production URL

### 3. Run the development server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

### 4. Access admin panel

Navigate to [http://localhost:3000/admin](http://localhost:3000/admin) and log in with your admin credentials.

## Features

- ✅ Full CRUD blog management
- ✅ MDX content with syntax highlighting, tables, LaTeX
- ✅ Auto-generated sitemap.xml & robots.txt
- ✅ RSS feed at /feed.xml
- ✅ JSON-LD structured data (BlogPosting, BreadcrumbList)
- ✅ OpenGraph & Twitter card meta tags
- ✅ Dark/light mode
- ✅ Reading progress bar
- ✅ Table of contents (auto-generated)
- ✅ Related posts (tag-based)
- ✅ Social share buttons
- ✅ Search & filter by tags/category
- ✅ Admin panel with markdown editor + live preview
- ✅ ISR (Incremental Static Regeneration)
- ✅ Responsive design
- ✅ Vercel-ready deployment

## Project Structure

```
app/
├── page.tsx                # Homepage
├── blog/
│   ├── page.tsx            # Blog listing
│   └── [slug]/page.tsx     # Blog post
├── admin/
│   ├── layout.tsx          # Admin layout + auth
│   ├── page.tsx            # Dashboard
│   ├── login/page.tsx      # Login
│   └── blogs/              # CRUD pages
├── api/                    # REST endpoints
├── sitemap.ts              # Dynamic sitemap
├── robots.ts               # robots.txt
└── feed.xml/route.ts       # RSS feed

components/
├── layout/                 # Header, Footer
├── blog/                   # Blog components
├── admin/                  # Admin components
└── ui/                     # ShadCN + custom UI

lib/
├── db.ts                   # MongoDB connection
├── auth.ts                 # JWT auth helpers
├── seo.ts                  # SEO utilities
└── utils.ts                # General utilities

models/
└── Blog.ts                 # Mongoose Blog model
```

## Deployment

This project is ready for Vercel deployment. Set all environment variables in your Vercel dashboard.

```bash
vercel deploy
```

## License

© Studiva™ by CRINE. All rights reserved.
