import Link from "next/link"
import { Rss } from "lucide-react"

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* Brand */}
          <div className="space-y-3">
            <Link href="/" className="inline-block">
              <span className="font-heading text-lg font-bold tracking-tight">
                Studiva™
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Your go-to resource for student tips, academic insights,
              productivity hacks, and everything education.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground">
              Quick Links
            </h3>
            <nav className="flex flex-col gap-2">
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
                className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                <Rss className="h-3.5 w-3.5" />
                RSS Feed
              </Link>
            </nav>
          </div>

          {/* Connect */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground">
              Connect
            </h3>
            <nav className="flex flex-col gap-2">
              <a
                href="https://studiva.co.in"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                studiva.co.in
              </a>
              <a
                href="mailto:support@crine.in"
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                support@crine.in
              </a>
            </nav>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 border-t border-border pt-6">
          <p className="text-center text-xs text-muted-foreground">
            © {currentYear} Studiva™ by CRINE. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
