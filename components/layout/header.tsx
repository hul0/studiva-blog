import Link from "next/link"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { Search, Menu, X, ArrowRight } from "lucide-react"
import Image from "next/image"

function MobileMenu() {
  return (
    <>
      <input type="checkbox" id="mobile-menu-toggle" className="peer hidden" />
      <label
        htmlFor="mobile-menu-toggle"
        className="inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl border border-border/10 bg-muted/20 text-muted-foreground transition-all hover:bg-accent hover:text-accent-foreground md:hidden active:scale-95"
        aria-label="Toggle menu"
      >
        <Menu className="h-5 w-5 peer-checked:hidden" />
        <X className="hidden h-5 w-5 peer-checked:block" />
      </label>
      {/* Mobile dropdown */}
      <div className="fixed inset-x-0 top-16 z-40 hidden border-b border-border/10 bg-background/95 p-6 backdrop-blur-xl animate-in slide-in-from-top-4 peer-checked:block md:hidden">
        <nav className="flex flex-col gap-4">
          <Link
            href="/"
            className="flex items-center justify-between rounded-xl bg-muted/30 px-4 py-4 text-sm font-bold text-foreground transition-all hover:bg-accent"
          >
            Home
            <ArrowRight className="h-4 w-4 opacity-30" />
          </Link>
          <Link
            href="/blog"
            className="flex items-center justify-between rounded-xl bg-muted/30 px-4 py-4 text-sm font-bold text-foreground transition-all hover:bg-accent"
          >
            Blog
            <ArrowRight className="h-4 w-4 opacity-30" />
          </Link>
        </nav>
      </div>
    </>
  )
}

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/5 bg-background/70 backdrop-blur-2xl transition-all duration-300">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <div className="flex items-center gap-8">
          <Link href="/" className="group flex items-center shrink-0">
            <Image
              src="/studiva-logo-pink.svg"
              alt="Studiva Logo"
              width={200}
              height={50}
              className="h-10 w-auto object-contain transition-all duration-500 group-hover:scale-105 rounded-[10%]"
              priority
            />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden items-center gap-1 md:flex">
            {[
              { name: "Home", href: "/" },
              { name: "Blog", href: "/blog" },
            ].map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="relative px-4 py-2 text-[11px] font-bold uppercase tracking-widest text-muted-foreground/70 transition-all hover:text-foreground"
              >
                <span className="relative z-10">{item.name}</span>
                {/* Subtle underline or highlight could go here */}
              </Link>
            ))}
          </nav>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <div className="hidden items-center gap-2 sm:flex">
             <Link
               href="/blog?focus=search"
               className="group flex h-10 items-center gap-3 rounded-xl border border-border/5 bg-muted/30 pl-4 pr-10 text-[11px] font-bold uppercase tracking-widest text-muted-foreground/50 transition-all hover:border-border/20 hover:bg-muted/50 hover:text-foreground"
             >
               <Search className="h-3.5 w-3.5 transition-transform group-hover:scale-110" />
               <span>Search</span>
             </Link>
          </div>
          
          <div className="flex h-10 w-10 items-center justify-center sm:hidden">
            <Link
              href="/blog?focus=search"
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-border/5 bg-muted/30 text-muted-foreground/50 transition-all hover:bg-accent"
              aria-label="Search articles"
            >
              <Search className="h-4.5 w-4.5" />
            </Link>
          </div>

          <div className="mx-1 h-5 w-px bg-border/10" />
          
          <ThemeToggle />
          <MobileMenu />
        </div>
      </div>
    </header>
  )
}
