"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

const navItems = [
  { href: "/about", label: "About" },
  { href: "/blog", label: "Blog" },
  { href: "/projects", label: "Projects" },
  { href: "/photography", label: "Photography" },
]

export function Header() {
  const pathname = usePathname()

  return (
    <header className="site-header">
      <div className="nav-container">
        <div className="nav-brand">
          <Link href="/">Justin Fowler</Link>
        </div>
        <nav className="nav-links" aria-label="Main navigation">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={pathname.startsWith(item.href) ? "active" : ""}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  )
}
