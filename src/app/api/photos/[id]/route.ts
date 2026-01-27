import { db, schema } from "@/lib/db"
import { validateRequest } from "@/lib/auth"
import { eq } from "drizzle-orm"
import { NextResponse } from "next/server"
import fs from "fs/promises"
import path from "path"

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { user } = await validateRequest()
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params

  try {
    const { altText, sortOrder } = await request.json()

    const updates: Partial<typeof schema.photos.$inferInsert> = {}
    if (altText !== undefined) updates.altText = altText
    if (sortOrder !== undefined) updates.sortOrder = sortOrder

    await db.update(schema.photos).set(updates).where(eq(schema.photos.id, id))

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Update photo error:", error)
    return NextResponse.json({ error: "Failed to update photo" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { user } = await validateRequest()
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params

  try {
    const photo = await db.query.photos.findFirst({
      where: eq(schema.photos.id, id),
    })

    if (photo) {
      // Delete file
      const filePath = path.join(process.cwd(), "public", "uploads", photo.filename)
      try {
        await fs.unlink(filePath)
      } catch {
        // File might not exist, continue anyway
      }

      await db.delete(schema.photos).where(eq(schema.photos.id, id))
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Delete photo error:", error)
    return NextResponse.json({ error: "Failed to delete photo" }, { status: 500 })
  }
}
