import { db, schema } from "@/lib/db"
import { eq } from "drizzle-orm"

export async function GET() {
  const baseUrl = "https://justin.how"

  // Get all published posts
  const posts = await db
    .select({ slug: schema.posts.slug, updatedAt: schema.posts.updatedAt })
    .from(schema.posts)
    .where(eq(schema.posts.published, true))

  // Static pages
  const staticPages = [
    { url: "/", priority: "1.0" },
    { url: "/about", priority: "0.8" },
    { url: "/blog", priority: "0.9" },
    { url: "/projects", priority: "0.8" },
    { url: "/photography", priority: "0.8" },
  ]

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticPages
  .map(
    (page) => `  <url>
    <loc>${baseUrl}${page.url}</loc>
    <priority>${page.priority}</priority>
  </url>`
  )
  .join("\n")}
${posts
  .map(
    (post) => `  <url>
    <loc>${baseUrl}/blog/${post.slug}</loc>
    <lastmod>${post.updatedAt.toISOString().split("T")[0]}</lastmod>
    <priority>0.7</priority>
  </url>`
  )
  .join("\n")}
</urlset>`

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml",
    },
  })
}
