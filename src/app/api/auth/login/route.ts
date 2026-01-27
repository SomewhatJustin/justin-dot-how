import { db, schema } from "@/lib/db"
import { lucia } from "@/lib/auth"
import { eq } from "drizzle-orm"
import { verify } from "@node-rs/argon2"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json()

    if (!username || !password) {
      return NextResponse.json({ error: "Username and password required" }, { status: 400 })
    }

    const user = await db.query.users.findFirst({
      where: eq(schema.users.username, username),
    })

    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    const validPassword = await verify(user.passwordHash, password)

    if (!validPassword) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    const session = await lucia.createSession(user.id, {})
    const sessionCookie = lucia.createSessionCookie(session.id)

    const cookieStore = await cookies()
    cookieStore.set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "Login failed" }, { status: 500 })
  }
}
