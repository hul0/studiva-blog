import Link from "next/link"
import { Rss } from "lucide-react"
import Image from "next/image"

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-border/10 bg-background/50">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-4">
          {/* Brand */}
          <div className="md:col-span-2 space-y-4">
            <Link href="/" className="group flex items-center">
              <Image
                src="/studiva-logo-pink.svg"
                alt="Studiva Logo"
                width={150}
                height={40}
                className="h-10 w-auto object-contain transition-transform group-hover:scale-105 rounded-[10%]"
              />
            </Link>
            <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
              Empowering students with modern insights, productivity guides, and academic excellence.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-widest text-foreground/70">
              Explore
            </h3>
            <nav className="flex flex-col gap-3">
              <Link
                href="/"
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                Home
              </Link>
              <Link
                href="/blog"
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                Blog
              </Link>
              <Link
                href="/feed.xml"
                className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                <Rss className="h-3.5 w-3.5" />
                RSS Feed
              </Link>
            </nav>
          </div>

          {/* Connect */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-widest text-foreground/70">
              Legal & Support
            </h3>
            <nav className="flex flex-col gap-3">
              <a
                href="https://studiva.co.in"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                Visit Site
              </a>
              <a
                href="mailto:support@crine.in"
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                Contact Us
              </a>
            </nav>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-16 pt-8 border-t border-border/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
            © {currentYear} Studiva™ by CRINE. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
             <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground/50">
               India
             </span>
          </div>
        </div>
      </div>
    </footer>
  )
}
