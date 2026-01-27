import { db, schema } from "@/lib/db"
import { desc } from "drizzle-orm"
import Link from "next/link"
import { format } from "date-fns"

export default async function PostsPage() {
  const posts = await db.select().from(schema.posts).orderBy(desc(schema.posts.createdAt))

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
        <div>
          <h1>posts</h1>
          <p>{posts.length} total entries</p>
        </div>
        <Link href="/admin/posts/new" className="admin-btn">
          + new post
        </Link>
      </div>

      <table className="admin-table">
        <thead>
          <tr>
            <th>title</th>
            <th>status</th>
            <th>date</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {posts.map((post) => (
            <tr key={post.id}>
              <td>
                <Link href={`/admin/posts/${post.id}`}>{post.title}</Link>
              </td>
              <td>
                <span className={`admin-badge ${post.published ? "admin-badge-success" : "admin-badge-warning"}`}>
                  {post.published ? "live" : "draft"}
                </span>
              </td>
              <td>{format(post.createdAt, "yyyy-MM-dd")}</td>
              <td>
                <Link href={`/admin/posts/${post.id}`}>[edit]</Link>
              </td>
            </tr>
          ))}
          {posts.length === 0 && (
            <tr>
              <td colSpan={4} style={{ textAlign: "center", padding: "2rem" }}>
                no posts yet. <Link href="/admin/posts/new">create one</Link>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
