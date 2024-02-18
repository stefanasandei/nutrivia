import { siteConfig } from "@/config/site"
import { MainNav } from "@/components/main-nav"
import Link from "next/link"
import { buttonVariants } from "@/components/ui/button"
// import { ThemeToggle } from "@/components/theme-toggle"

export function SiteHeader() {
  return (
    <header className="bg-background sticky top-0 z-40 w-full border-b">
      <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
        <MainNav items={siteConfig.mainNav} />
        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="flex items-center space-x-1">
            <Link
              href={siteConfig.links.login}
              className={buttonVariants()}
            >
              Create Account
            </Link>
            {/* <ThemeToggle /> */}
          </nav>
        </div>
      </div>
    </header>
  )
}
