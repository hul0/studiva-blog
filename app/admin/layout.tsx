import Link from "next/link"
import { LayoutDashboard, FileText, LogOut } from "lucide-react"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Admin Panel",
  robots: { index: false, follow: false },
}

async function handleLogout() {
  "use server"
  const { removeAuthCookie } = await import("@/lib/auth")
  await removeAuthCookie()
  const { redirect } = await import("next/navigation")
  redirect("/admin/login")
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="hidden w-60 shrink-0 border-r border-border bg-card md:block">
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center border-b border-border px-5">
            <Link
              href="/admin"
              className="font-heading text-lg font-bold tracking-tight"
            >
              Studiva™{" "}
              <span className="text-xs font-normal text-muted-foreground">
                Admin
              </span>
            </Link>
          </div>

          {/* Nav */}
          <nav className="flex-1 space-y-1 p-3">
            <Link
              href="/admin"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              <LayoutDashboard className="h-4 w-4" />
              Dashboard
            </Link>
            <Link
              href="/admin/blogs"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              <FileText className="h-4 w-4" />
              Blog Posts
            </Link>
          </nav>

          {/* Footer */}
          <div className="border-t border-border p-3">
            <div className="flex items-center justify-between">
              <form action={handleLogout}>
                <button
                  type="submit"
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </form>
              <ThemeToggle />
            </div>
            <Link
              href="/"
              className="mt-2 block rounded-lg px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground"
            >
              ← Back to site
            </Link>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 overflow-auto">
        {/* Mobile header */}
        <div className="flex h-14 items-center justify-between border-b border-border bg-card px-4 md:hidden">
          <Link
            href="/admin"
            className="font-heading text-base font-bold tracking-tight"
          >
            Studiva Admin
          </Link>
          <div className="flex items-center gap-2">
            <Link
              href="/admin/blogs"
              className="rounded-lg px-2 py-1 text-xs text-muted-foreground hover:text-foreground"
            >
              Posts
            </Link>
            <ThemeToggle />
          </div>
        </div>

        <main className="p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  )
}
