import Link from "next/link"
import { db, schema } from "@/lib/db"
import { desc, eq } from "drizzle-orm"
import { format } from "date-fns"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Blog",
  description: "Blog posts by Justin Fowler",
}

export default async function BlogPage() {
  const posts = await db
    .select()
    .from(schema.posts)
    .where(eq(schema.posts.published, true))
    .orderBy(desc(schema.posts.publishedAt))

  return (
    <div className="content-wrapper">
      <h1>Blog</h1>
      <ul className="post-list">
        {posts.map((post) => (
          <li key={post.id} className="post-list-item">
            <Link href={`/blog/${post.slug}`}>{post.title}</Link>
            <span className="post-list-date">
              {post.publishedAt ? format(post.publishedAt, "yyyy-MM-dd") : ""}
            </span>
          </li>
        ))}
        {posts.length === 0 && <li>No blog posts yet.</li>}
      </ul>
    </div>
  )
}
