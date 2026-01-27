"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"

interface User {
  username: string
}

const navigation = [
  { name: "dashboard", href: "/admin" },
  { name: "posts", href: "/admin/posts" },
  { name: "photos", href: "/admin/photos" },
  { name: "pages", href: "/admin/pages" },
  { name: "media", href: "/admin/media" },
]

export function CMSSidebar({ user }: { user: User }) {
  const pathname = usePathname()
  const router = useRouter()

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" })
    router.push("/login")
    router.refresh()
  }

  return (
    <aside className="admin-sidebar">
      <Link href="/" className="admin-logo">
        justin.how
      </Link>
      <nav className="admin-nav">
        <ul className="admin-nav-list">
          {navigation.map((item) => {
            const isActive =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href)
            return (
              <li key={item.name} className="admin-nav-item">
                <Link
                  href={item.href}
                  className={`admin-nav-link ${isActive ? "active" : ""}`}
                >
                  {item.name}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>
      <div className="admin-user">
        <span className="admin-user-name">{user.username}</span>
        <button onClick={handleLogout} className="admin-logout">
          [logout]
        </button>
      </div>
    </aside>
  )
}
