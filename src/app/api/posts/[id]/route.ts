import { db, schema } from "@/lib/db"
import { validateRequest } from "@/lib/auth"
import { eq } from "drizzle-orm"
import { NextResponse } from "next/server"
import { extractExcerpt } from "@/lib/markdown"

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const post = await db.query.posts.findFirst({
    where: eq(schema.posts.id, id),
  })

  if (!post) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 })
  }

  return NextResponse.json(post)
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { user } = await validateRequest()
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params

  try {
    const { title, slug, content, excerpt, published } = await request.json()

    const existing = await db.query.posts.findFirst({
      where: eq(schema.posts.id, id),
    })

    if (!existing) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 })
    }

    const now = new Date()
    const wasPublished = existing.published
    const publishedAt = published && !wasPublished ? now : existing.publishedAt

    await db
      .update(schema.posts)
      .set({
        title,
        slug,
        content,
        excerpt: excerpt || extractExcerpt(content),
        published,
        publishedAt,
        updatedAt: now,
      })
      .where(eq(schema.posts.id, id))

    const post = await db.query.posts.findFirst({
      where: eq(schema.posts.id, id),
    })

    return NextResponse.json(post)
  } catch (error) {
    console.error("Update post error:", error)
    return NextResponse.json({ error: "Failed to update post" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { user } = await validateRequest()
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params

  try {
    await db.delete(schema.posts).where(eq(schema.posts.id, id))
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Delete post error:", error)
    return NextResponse.json({ error: "Failed to delete post" }, { status: 500 })
  }
}
