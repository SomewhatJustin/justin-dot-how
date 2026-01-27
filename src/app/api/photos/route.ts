import { db, schema } from "@/lib/db"
import { asc } from "drizzle-orm"
import { NextResponse } from "next/server"

export async function GET() {
  const photos = await db.select().from(schema.photos).orderBy(asc(schema.photos.sortOrder))
  return NextResponse.json(photos)
}
