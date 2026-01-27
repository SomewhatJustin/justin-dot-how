import { db, schema } from "@/lib/db"
import { eq } from "drizzle-orm"
import { notFound } from "next/navigation"
import { markdownToHtml } from "@/lib/markdown"
import { format } from "date-fns"
import type { Metadata } from "next"

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const post = await db.query.posts.findFirst({
    where: eq(schema.posts.slug, slug),
  })

  if (!post) {
    return { title: "Post Not Found" }
  }

  return {
    title: post.title,
    description: post.excerpt || undefined,
    openGraph: {
      title: post.title,
      description: post.excerpt || undefined,
      type: "article",
      publishedTime: post.publishedAt?.toISOString(),
    },
  }
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params
  const post = await db.query.posts.findFirst({
    where: eq(schema.posts.slug, slug),
  })

  if (!post || !post.published) {
    notFound()
  }

  const content = await markdownToHtml(post.content)

  return (
    <div className="content-wrapper">
      <article className="post-content">
        <header className="post-header">
          <h1>{post.title}</h1>
          <div className="title-accent" />
          {post.publishedAt && (
            <p className="post-meta">Published {format(post.publishedAt, "MMMM d, yyyy")}</p>
          )}
        </header>
        <div className="prose prose-lg max-w-none" dangerouslySetInnerHTML={{ __html: content }} />
      </article>
    </div>
  )
}
