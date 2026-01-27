import { lucia, validateRequest } from "@/lib/auth"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function POST() {
  const { session } = await validateRequest()

  if (!session) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }

  await lucia.invalidateSession(session.id)

  const sessionCookie = lucia.createBlankSessionCookie()
  const cookieStore = await cookies()
  cookieStore.set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes)

  return NextResponse.json({ success: true })
}
