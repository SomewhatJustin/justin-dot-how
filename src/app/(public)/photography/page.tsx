import { db, schema } from "@/lib/db"
import { asc } from "drizzle-orm"
import Image from "next/image"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Photography",
  description: "Photography by Justin Fowler",
}

export default async function PhotographyPage() {
  const photos = await db.select().from(schema.photos).orderBy(asc(schema.photos.sortOrder))

  return (
    <main style={{ width: "98%", maxWidth: "10000px", margin: "0 auto" }}>
      <div className="content-wrapper">
        <h1>Photography</h1>
      </div>
      <div style={{ textAlign: "center" }}>
        {photos.map((photo) => (
          <Image
            key={photo.id}
            src={`/uploads/${photo.filename}`}
            alt={photo.altText || photo.originalFilename || "Photo"}
            width={photo.width || 1200}
            height={photo.height || 800}
            className="photo-item"
            loading="lazy"
          />
        ))}
        {photos.length === 0 && (
          <p className="content-wrapper text-gray-500">No photos yet.</p>
        )}
      </div>
    </main>
  )
}
