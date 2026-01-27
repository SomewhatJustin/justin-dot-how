import { db, schema } from "@/lib/db"
import { validateRequest } from "@/lib/auth"
import { eq } from "drizzle-orm"
import { NextResponse } from "next/server"

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const page = await db.query.pages.findFirst({
    where: eq(schema.pages.id, id),
  })

  if (!page) {
    return NextResponse.json({ error: "Page not found" }, { status: 404 })
  }

  return NextResponse.json(page)
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { user } = await validateRequest()
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params

  try {
    const { content } = await request.json()

    await db
      .update(schema.pages)
      .set({
        content,
        updatedAt: new Date(),
      })
      .where(eq(schema.pages.id, id))

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Update page error:", error)
    return NextResponse.json({ error: "Failed to update page" }, { status: 500 })
  }
}
