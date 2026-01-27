import Database from "better-sqlite3"
import { drizzle } from "drizzle-orm/better-sqlite3"
import * as schema from "../src/lib/db/schema"
import fs from "fs"
import path from "path"
import { nanoid } from "nanoid"
import matter from "gray-matter"
import { hash } from "@node-rs/argon2"
import sharp from "sharp"

const dbPath = process.env.DATABASE_PATH || path.join(process.cwd(), "data", "site.db")
const sqlite = new Database(dbPath)
const db = drizzle(sqlite, { schema })

const BLOG_DIR = path.join(process.cwd(), "blog")
const PHOTOGRAPHY_DIR = path.join(process.cwd(), "photography")
const UPLOADS_DIR = path.join(process.cwd(), "public", "uploads")

async function main() {
  console.log("Starting content migration...")

  // Ensure uploads directory exists
  if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true })
  }

  // Create admin user
  await createAdminUser()

  // Migrate blog posts
  await migrateBlogPosts()

  // Migrate photos
  await migratePhotos()

  // Create static pages
  await createStaticPages()

  console.log("Migration complete!")
  sqlite.close()
}

async function createAdminUser() {
  console.log("\nCreating admin user...")

  const existing = await db.query.users.findFirst()
  if (existing) {
    console.log("Admin user already exists, skipping...")
    return
  }

  const username = process.env.ADMIN_USERNAME || "admin"
  const password = process.env.ADMIN_PASSWORD || "changeme123"

  const passwordHash = await hash(password)

  await db.insert(schema.users).values({
    id: nanoid(),
    username,
    passwordHash,
    createdAt: new Date(),
  })

  console.log(`Created admin user: ${username}`)
  console.log("IMPORTANT: Change the password after first login!")
}

async function migrateBlogPosts() {
  console.log("\nMigrating blog posts...")

  if (!fs.existsSync(BLOG_DIR)) {
    console.log("No blog directory found, skipping...")
    return
  }

  const files = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith(".md") && f !== "index.md")

  for (const file of files) {
    const filePath = path.join(BLOG_DIR, file)
    const content = fs.readFileSync(filePath, "utf-8")
    const { data, content: markdown } = matter(content)

    const slug = file.replace(".md", "")

    // Check if post already exists
    const existing = await db.query.posts.findFirst({
      where: (posts, { eq }) => eq(posts.slug, slug),
    })

    if (existing) {
      console.log(`  Post "${slug}" already exists, skipping...`)
      continue
    }

    const publishedAt = data.date ? new Date(data.date) : new Date()

    await db.insert(schema.posts).values({
      id: nanoid(),
      slug,
      title: data.title || slug,
      content: markdown.trim(),
      excerpt: extractExcerpt(markdown),
      published: true,
      publishedAt,
      createdAt: publishedAt,
      updatedAt: new Date(),
    })

    console.log(`  Migrated: ${data.title || slug}`)
  }
}

async function migratePhotos() {
  console.log("\nMigrating photos...")

  if (!fs.existsSync(PHOTOGRAPHY_DIR)) {
    console.log("No photography directory found, skipping...")
    return
  }

  const files = fs.readdirSync(PHOTOGRAPHY_DIR).filter((f) => {
    const ext = path.extname(f).toLowerCase()
    return [".jpg", ".jpeg", ".png", ".gif", ".webp"].includes(ext)
  })

  let sortOrder = 0

  for (const file of files) {
    const srcPath = path.join(PHOTOGRAPHY_DIR, file)

    // Check if photo already exists by original filename
    const existing = await db.query.photos.findFirst({
      where: (photos, { eq }) => eq(photos.originalFilename, file),
    })

    if (existing) {
      console.log(`  Photo "${file}" already exists, skipping...`)
      sortOrder++
      continue
    }

    // Generate new filename with nanoid
    const ext = path.extname(file)
    const id = nanoid()
    const newFilename = `${id}${ext}`
    const destPath = path.join(UPLOADS_DIR, newFilename)

    // Copy file
    fs.copyFileSync(srcPath, destPath)

    // Get image dimensions
    let width: number | undefined
    let height: number | undefined

    try {
      const metadata = await sharp(srcPath).metadata()
      width = metadata.width
      height = metadata.height
    } catch (e) {
      console.log(`  Could not get dimensions for ${file}`)
    }

    await db.insert(schema.photos).values({
      id,
      filename: newFilename,
      originalFilename: file,
      width,
      height,
      sortOrder,
      createdAt: new Date(),
    })

    console.log(`  Migrated: ${file}`)
    sortOrder++
  }
}

async function createStaticPages() {
  console.log("\nCreating static pages...")

  const pages = [
    {
      slug: "about",
      title: "About",
      content: `<p>My name is Justin—I'm a Software Engineer at <a href="https://futo.org">FUTO</a>. Previously, I was a Product Manager at places like <a href="https://indeed.com">Indeed</a>, <a href="https://aceable.com">Aceable</a>, and <a href="https://upswing.io">Upswing</a>.</p>
<p>In my spare time I coach softball, do comedy, <a href="/photography">take photos</a>, and hike.</p>
<p>You can find me on <a href="https://github.com/somewhatjustin">GitHub</a>, <a href="https://mastodon.social/@justinfowler">Mastodon</a>, and <a href="https://x.com/somewhatjustin">X</a>.</p>`,
    },
    {
      slug: "projects",
      title: "Projects",
      content: `<div class="project-list">
  <div class="project-card">
    <h3><a href="https://futocore.futo.org/" target="_blank" rel="noopener noreferrer">FUTOcore Software Store</a></h3>
    <p>Developing a privacy-respecting Android app store built on open-source principles. My work spans the mobile app (React Native) and a high-performance payment library written in Kotlin.</p>
    <p><a href="https://futocore.futo.org/" target="_blank" rel="noopener noreferrer">Explore FUTOcore &rarr;</a></p>
  </div>

  <div class="project-card">
    <h3><a href="https://www.youtube.com/watch?v=7ARnEKlHlis" target="_blank" rel="noopener noreferrer">GreenLight Grocery (Video Demo)</a></h3>
    <p>B2B ordering made simple: a platform for restaurants to source inventory directly from suppliers—think DoorDash, but for wholesale. I contributed as a software engineer using React, AWS Lambdas, Serverless Framework, and Tailwind CSS.</p>
    <p><a href="https://www.youtube.com/watch?v=7ARnEKlHlis" target="_blank" rel="noopener noreferrer">Watch the demo &rarr;</a></p>
  </div>

  <div class="project-card">
    <h3><a href="https://www.indeed.com/career-advice/interviewing/one-way-video-interview" target="_blank" rel="noopener noreferrer">One-way Video Interviews at Indeed</a></h3>
    <p>As a Product Manager in Indeed's Incubator, I led research and product definition for the company's first asynchronous (one-way) video interview feature, designed to improve the job seeker experience.</p>
    <p><a href="https://www.indeed.com/career-advice/interviewing/one-way-video-interview" target="_blank" rel="noopener noreferrer">One-way video interviews &rarr;</a></p>
  </div>
</div>`,
    },
  ]

  for (const page of pages) {
    const existing = await db.query.pages.findFirst({
      where: (pages, { eq }) => eq(pages.slug, page.slug),
    })

    if (existing) {
      console.log(`  Page "${page.slug}" already exists, skipping...`)
      continue
    }

    await db.insert(schema.pages).values({
      id: nanoid(),
      slug: page.slug,
      title: page.title,
      content: page.content,
      updatedAt: new Date(),
    })

    console.log(`  Created: ${page.title}`)
  }
}

function extractExcerpt(content: string, maxLength = 160): string {
  const plainText = content
    .replace(/#{1,6}\s/g, "")
    .replace(/\*\*(.+?)\*\*/g, "$1")
    .replace(/\*(.+?)\*/g, "$1")
    .replace(/\[(.+?)\]\(.+?\)/g, "$1")
    .replace(/!\[.+?\]\(.+?\)/g, "")
    .replace(/`(.+?)`/g, "$1")
    .replace(/```[\s\S]*?```/g, "")
    .replace(/\n+/g, " ")
    .trim()

  if (plainText.length <= maxLength) {
    return plainText
  }

  return plainText.slice(0, maxLength).replace(/\s+\S*$/, "") + "..."
}

main().catch(console.error)
