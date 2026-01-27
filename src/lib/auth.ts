import { Lucia } from "lucia"
import { DrizzleSQLiteAdapter } from "@lucia-auth/adapter-drizzle"
import { db, schema } from "./db"
import { cookies } from "next/headers"
import { cache } from "react"

const adapter = new DrizzleSQLiteAdapter(db, schema.sessions, schema.users)

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    expires: false,
    attributes: {
      secure: process.env.NODE_ENV === "production",
    },
  },
  getUserAttributes: (attributes) => {
    return {
      username: attributes.username,
    }
  },
})

declare module "lucia" {
  interface Register {
    Lucia: typeof lucia
    DatabaseUserAttributes: DatabaseUserAttributes
  }
}

interface DatabaseUserAttributes {
  username: string
}

export const validateRequest = cache(async () => {
  const cookieStore = await cookies()
  const sessionId = cookieStore.get(lucia.sessionCookieName)?.value ?? null

  if (!sessionId) {
    return { user: null, session: null }
  }

  const result = await lucia.validateSession(sessionId)

  try {
    if (result.session && result.session.fresh) {
      const sessionCookie = lucia.createSessionCookie(result.session.id)
      cookieStore.set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes)
    }
    if (!result.session) {
      const sessionCookie = lucia.createBlankSessionCookie()
      cookieStore.set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes)
    }
  } catch {
    // Next.js throws error when setting cookies in Server Components
  }

  return result
})
