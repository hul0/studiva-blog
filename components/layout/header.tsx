import Link from "next/link"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { Search, Menu, X } from "lucide-react"

function MobileMenu() {
  return (
    <>
      <input type="checkbox" id="mobile-menu-toggle" className="peer hidden" />
      <label
        htmlFor="mobile-menu-toggle"
        className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground md:hidden"
        aria-label="Toggle menu"
      >
        <Menu className="h-4 w-4 peer-checked:hidden" />
        <X className="hidden h-4 w-4 peer-checked:block" />
      </label>
      {/* Mobile dropdown */}
      <div className="fixed inset-x-0 top-16 z-40 hidden border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 peer-checked:block md:hidden">
        <nav className="flex flex-col gap-1 p-4">
          <Link
            href="/"
            className="rounded-md px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Home
          </Link>
          <Link
            href="/blog"
            className="rounded-md px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Blog
          </Link>
        </nav>
      </div>
    </>
  )
}

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-lg supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <span className="font-heading text-xl font-bold tracking-tight text-foreground">
            Studiva
          </span>
          <span className="text-[10px] font-medium text-muted-foreground">
            ™
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-1 md:flex">
          <Link
            href="/"
            className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            Home
          </Link>
          <Link
            href="/blog"
            className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            Blog
          </Link>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Link
            href="/blog?focus=search"
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
            aria-label="Search"
          >
            <Search className="h-4 w-4" />
          </Link>
          <ThemeToggle />
          <MobileMenu />
        </div>
      </div>
    </header>
  )
}
