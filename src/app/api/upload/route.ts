import { db, schema } from "@/lib/db"
import { validateRequest } from "@/lib/auth"
import { NextResponse } from "next/server"
import { nanoid } from "nanoid"
import path from "path"
import fs from "fs/promises"
import sharp from "sharp"

export async function POST(request: Request) {
  const { user } = await validateRequest()
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const formData = await request.formData()
    const file = formData.get("file") as File
    const type = formData.get("type") as string // "photo" or "media"

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Generate unique filename
    const ext = path.extname(file.name).toLowerCase()
    const id = nanoid()
    const filename = `${id}${ext}`

    // Ensure uploads directory exists
    const uploadsDir = path.join(process.cwd(), "public", "uploads")
    await fs.mkdir(uploadsDir, { recursive: true })

    const filePath = path.join(uploadsDir, filename)

    // Get image dimensions if it's an image
    let width: number | undefined
    let height: number | undefined

    if ([".jpg", ".jpeg", ".png", ".webp", ".gif"].includes(ext)) {
      const metadata = await sharp(buffer).metadata()
      width = metadata.width
      height = metadata.height
    }

    // Write file
    await fs.writeFile(filePath, buffer)

    const now = new Date()

    if (type === "photo") {
      // Get max sort order
      const photos = await db.select().from(schema.photos)
      const maxOrder = photos.reduce((max, p) => Math.max(max, p.sortOrder), 0)

      await db.insert(schema.photos).values({
        id,
        filename,
        originalFilename: file.name,
        width,
        height,
        sortOrder: maxOrder + 1,
        createdAt: now,
      })

      const photo = await db.query.photos.findFirst({
        where: (photos, { eq }) => eq(photos.id, id),
      })

      return NextResponse.json(photo)
    } else {
      await db.insert(schema.media).values({
        id,
        filename,
        originalFilename: file.name,
        mimeType: file.type,
        size: file.size,
        width,
        height,
        createdAt: now,
      })

      const media = await db.query.media.findFirst({
        where: (media, { eq }) => eq(media.id, id),
      })

      return NextResponse.json(media)
    }
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json({ error: "Upload failed" }, { status: 500 })
  }
}
