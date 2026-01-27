import { db, schema } from "@/lib/db"
import { eq } from "drizzle-orm"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Projects",
  description: "Projects by Justin Fowler",
}

// Default content if page doesn't exist in database
const defaultContent = `
<div class="project-list">
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
</div>
`

export default async function ProjectsPage() {
  const page = await db.query.pages.findFirst({
    where: eq(schema.pages.slug, "projects"),
  })

  const content = page?.content || defaultContent

  return (
    <div className="content-wrapper page-content">
      <h1>Projects</h1>
      <div dangerouslySetInnerHTML={{ __html: content }} />
    </div>
  )
}
