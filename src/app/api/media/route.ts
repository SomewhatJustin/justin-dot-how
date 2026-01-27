import { db, schema } from "@/lib/db"
import { desc } from "drizzle-orm"
import { NextResponse } from "next/server"

export async function GET() {
  const media = await db.select().from(schema.media).orderBy(desc(schema.media.createdAt))
  return NextResponse.json(media)
}
