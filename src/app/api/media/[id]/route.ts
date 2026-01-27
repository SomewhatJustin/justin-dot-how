import { db, schema } from "@/lib/db"
import { validateRequest } from "@/lib/auth"
import { eq } from "drizzle-orm"
import { NextResponse } from "next/server"
import fs from "fs/promises"
import path from "path"

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { user } = await validateRequest()
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params

  try {
    const media = await db.query.media.findFirst({
      where: eq(schema.media.id, id),
    })

    if (media) {
      // Delete file
      const filePath = path.join(process.cwd(), "public", "uploads", media.filename)
      try {
        await fs.unlink(filePath)
      } catch {
        // File might not exist, continue anyway
      }

      await db.delete(schema.media).where(eq(schema.media.id, id))
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Delete media error:", error)
    return NextResponse.json({ error: "Failed to delete media" }, { status: 500 })
  }
}
