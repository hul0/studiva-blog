import Link from "next/link"
import { Rss, Mail, Search, FileText, Map, Globe, Zap, Award } from "lucide-react"
import Image from "next/image"

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-border/10 bg-muted/20">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
        {/* Top Section: Branding */}
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-1 mb-16">
          <div className="space-y-8">
            <Link href="/" className="group inline-flex items-center">
              <Image
                src="/studiva-logo-pink.svg"
                alt="Studiva Logo"
                width={160}
                height={45}
                className="h-11 w-auto object-contain transition-transform group-hover:scale-105 rounded-[10%]"
              />
            </Link>
            <p className="max-w-2xl text-base leading-relaxed text-muted-foreground/80">
              The Studiva Journal is a digital ecosystem dedicated to modern academic excellence.
              We blend cognitive science with practical productivity to help students achieve more with less stress.
            </p>
            <div className="flex items-center gap-5">
              {[
                { icon: Globe, href: "https://studiva.co.in", label: "Website" },
                { icon: Zap, href: "https://twitter.com", label: "Twitter" },
                { icon: Award, href: "https://linkedin.com", label: "LinkedIn" },
                { icon: Mail, href: "mailto:support@crine.in", label: "Email" },
              ].map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-9 w-9 items-center justify-center rounded-lg bg-background border border-border/50 text-muted-foreground transition-all hover:bg-foreground hover:text-background hover:border-foreground"
                  aria-label={social.label}
                >
                  <social.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Middle Section: Links Grid */}
        <div className="grid grid-cols-2 gap-12 sm:grid-cols-2 md:grid-cols-4 border-t border-border/10 pt-16">
          {/* Topics */}
          <div className="space-y-6">
            <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-foreground/40">
              Journal Topics
            </h4>
            <nav className="flex flex-col gap-4">
              {["Academic Success", "Productivity", "Student Life", "Research Tips"].map((item) => (
                <Link
                  key={item}
                  href={`/blog?category=${item}`}
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  {item}
                </Link>
              ))}
            </nav>
          </div>

          {/* Resources */}
          <div className="space-y-6">
            <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-foreground/40">
              Resources
            </h4>
            <nav className="flex flex-col gap-4">
              <Link href="/blog" className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground">
                <Search className="h-3.5 w-3.5" /> All Articles
              </Link>
              <Link href="/feed.xml" className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground">
                <Rss className="h-3.5 w-3.5" /> RSS Feed
              </Link>
              <Link href="/sitemap.xml" className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground">
                <Map className="h-3.5 w-3.5" /> Sitemap
              </Link>
              <Link href="/robots.txt" className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground">
                <FileText className="h-3.5 w-3.5" /> Robots.txt
              </Link>
            </nav>
          </div>

          {/* Platform */}
          <div className="space-y-6">
            <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-foreground/40">
              Platform
            </h4>
            <nav className="flex flex-col gap-4">
              <a href="https://studiva.co.in" target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                Studiva Main
              </a>
              <a href="https://crine.in" target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                CRINE™ Web
              </a>
              <Link href="/admin" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                Admin Portal
              </Link>
            </nav>
          </div>


        </div>

        {/* Bottom Bar */}
        <div className="mt-20 pt-8 border-t border-border/5 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col md:flex-row items-center gap-2 md:gap-6">
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
              © {currentYear} Studiva™
            </p>

          </div>
          <div className="flex items-center gap-4">
            <div className="flex h-6 w-10 items-center justify-center rounded border border-border/20 bg-muted/20 text-[8px] font-bold uppercase tracking-tighter text-muted-foreground">
              v2.0.4
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
