import Link from "next/link"
import { db, schema } from "@/lib/db"
import { desc, eq } from "drizzle-orm"
import { format } from "date-fns"

export default async function HomePage() {
  const posts = await db
    .select()
    .from(schema.posts)
    .where(eq(schema.posts.published, true))
    .orderBy(desc(schema.posts.publishedAt))
    .limit(5)

  return (
    <div className="content-wrapper">
      <section className="home-intro" aria-labelledby="intro-heading">
        <h1 id="intro-heading">Hi, I&apos;m Justin.</h1>
        <p>
          I&apos;m a software engineer based in Austin. I like to{" "}
          <Link href="/photography">take pictures</Link>, <Link href="/blog">write</Link>, and work
          on <Link href="/projects">projects</Link>.
        </p>
        <p>
          <Link href="/blog" className="button primary">
            Read the blog
          </Link>{" "}
          <Link href="/photography" className="button">
            View photography
          </Link>
        </p>
        <hr className="section-divider" />
      </section>

      <section aria-labelledby="latest-heading">
        <h2 id="latest-heading">Latest writing</h2>
        <ul className="post-list compact">
          {posts.map((post) => (
            <li key={post.id} className="post-list-item">
              <Link href={`/blog/${post.slug}`}>{post.title}</Link>
              <span className="post-list-date">
                {post.publishedAt ? format(post.publishedAt, "MMM d, yyyy") : ""}
              </span>
            </li>
          ))}
          {posts.length === 0 && (
            <li className="post-list-item">
              <span className="text-gray-500">No posts yet.</span>
            </li>
          )}
        </ul>
        <p className="more-link">
          <Link href="/blog">All posts &rarr;</Link>
        </p>
      </section>
    </div>
  )
}
