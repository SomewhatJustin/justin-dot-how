import { db, schema } from "@/lib/db"
import { validateRequest } from "@/lib/auth"
import { NextResponse } from "next/server"
import { nanoid } from "nanoid"
import { extractExcerpt } from "@/lib/markdown"

export async function POST(request: Request) {
  const { user } = await validateRequest()
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { title, slug, content, excerpt, published } = await request.json()

    if (!title || !slug || !content) {
      return NextResponse.json({ error: "Title, slug, and content required" }, { status: 400 })
    }

    const id = nanoid()
    const now = new Date()

    await db.insert(schema.posts).values({
      id,
      title,
      slug,
      content,
      excerpt: excerpt || extractExcerpt(content),
      published,
      publishedAt: published ? now : null,
      createdAt: now,
      updatedAt: now,
    })

    const post = await db.query.posts.findFirst({
      where: (posts, { eq }) => eq(posts.id, id),
    })

    return NextResponse.json(post)
  } catch (error) {
    console.error("Create post error:", error)
    return NextResponse.json({ error: "Failed to create post" }, { status: 500 })
  }
}
