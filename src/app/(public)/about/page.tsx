import { db, schema } from "@/lib/db"
import { eq } from "drizzle-orm"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "About",
  description: "About Justin Fowler - software engineer at FUTO",
}

// Default content if page doesn't exist in database
const defaultContent = `
<p>My name is Justin—I'm a Software Engineer at <a href="https://futo.org">FUTO</a>. Previously, I was a Product Manager at places like <a href="https://indeed.com">Indeed</a>, <a href="https://aceable.com">Aceable</a>, and <a href="https://upswing.io">Upswing</a>.</p>
<p>In my spare time I coach softball, do comedy, <a href="/photography">take photos</a>, and hike.</p>
<p>You can find me on <a href="https://github.com/somewhatjustin">GitHub</a>, <a href="https://mastodon.social/@justinfowler">Mastodon</a>, and <a href="https://x.com/somewhatjustin">X</a>.</p>
`

export default async function AboutPage() {
  const page = await db.query.pages.findFirst({
    where: eq(schema.pages.slug, "about"),
  })

  const content = page?.content || defaultContent

  return (
    <div className="content-wrapper page-content">
      <h1>About</h1>
      <div dangerouslySetInnerHTML={{ __html: content }} />
    </div>
  )
}
