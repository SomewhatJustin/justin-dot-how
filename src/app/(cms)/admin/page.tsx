import { db, schema } from "@/lib/db"
import { eq, count } from "drizzle-orm"
import Link from "next/link"

export default async function AdminDashboard() {
  const [postsCount] = await db
    .select({ count: count() })
    .from(schema.posts)
    .where(eq(schema.posts.published, true))

  const [draftsCount] = await db
    .select({ count: count() })
    .from(schema.posts)
    .where(eq(schema.posts.published, false))

  const [photosCount] = await db.select({ count: count() }).from(schema.photos)

  const [pagesCount] = await db.select({ count: count() }).from(schema.pages)

  const stats = [
    { name: "published", value: postsCount.count, href: "/admin/posts" },
    { name: "drafts", value: draftsCount.count, href: "/admin/posts" },
    { name: "photos", value: photosCount.count, href: "/admin/photos" },
    { name: "pages", value: pagesCount.count, href: "/admin/pages" },
  ]

  return (
    <div>
      <h1>dashboard</h1>
      <p>system status: operational</p>

      <div className="admin-stats">
        {stats.map((stat) => (
          <Link key={stat.name} href={stat.href} className="admin-stat">
            <div className="admin-stat-label">{stat.name}</div>
            <div className="admin-stat-value">{stat.value}</div>
          </Link>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
        <div className="admin-card">
          <h2>quick actions</h2>
          <div className="admin-actions">
            <Link href="/admin/posts/new" className="admin-btn">
              + new post
            </Link>
            <Link href="/admin/photos" className="admin-btn">
              + upload photos
            </Link>
          </div>
        </div>

        <div className="admin-card">
          <h2>links</h2>
          <div className="admin-links">
            <a href="/" target="_blank" rel="noopener noreferrer">
              view site
            </a>
            <a href="/blog" target="_blank" rel="noopener noreferrer">
              view blog
            </a>
            <a href="/photography" target="_blank" rel="noopener noreferrer">
              view photography
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
