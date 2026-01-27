"use client"

import { useState, useEffect } from "react"
import { MarkdownEditor } from "./MarkdownEditor"

interface PostFormProps {
  initialData?: {
    title: string
    slug: string
    content: string
    excerpt: string
    published: boolean
  }
  onSubmit: (data: {
    title: string
    slug: string
    content: string
    excerpt: string
    published: boolean
  }) => Promise<void>
  saving: boolean
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
}

export function PostForm({ initialData, onSubmit, saving }: PostFormProps) {
  const [title, setTitle] = useState(initialData?.title || "")
  const [slug, setSlug] = useState(initialData?.slug || "")
  const [content, setContent] = useState(initialData?.content || "")
  const [excerpt, setExcerpt] = useState(initialData?.excerpt || "")
  const [published, setPublished] = useState(initialData?.published || false)
  const [slugEdited, setSlugEdited] = useState(!!initialData?.slug)

  useEffect(() => {
    if (!slugEdited && !initialData) {
      setSlug(slugify(title))
    }
  }, [title, slugEdited, initialData])

  function handleSlugChange(value: string) {
    setSlug(slugify(value))
    setSlugEdited(true)
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    onSubmit({ title, slug, content, excerpt, published })
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="admin-card">
        <div className="admin-form-group">
          <label htmlFor="title" className="admin-label">title</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="admin-input"
          />
        </div>

        <div className="admin-form-group">
          <label htmlFor="slug" className="admin-label">slug</label>
          <div style={{ display: "flex", alignItems: "center", gap: "0" }}>
            <span style={{
              padding: "0.5rem 0.75rem",
              background: "#111",
              border: "1px solid #1a1a1a",
              borderRight: "none",
              borderRadius: "2px 0 0 2px",
              color: "#444",
              fontSize: "0.875rem"
            }}>
              /blog/
            </span>
            <input
              type="text"
              id="slug"
              value={slug}
              onChange={(e) => handleSlugChange(e.target.value)}
              required
              className="admin-input"
              style={{ borderRadius: "0 2px 2px 0" }}
            />
          </div>
        </div>

        <div className="admin-form-group">
          <label htmlFor="excerpt" className="admin-label">excerpt</label>
          <textarea
            id="excerpt"
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            rows={2}
            className="admin-textarea"
            style={{ minHeight: "60px" }}
            placeholder="brief description for seo..."
          />
        </div>

        <div className="admin-form-group">
          <label className="admin-label">content (markdown)</label>
          <MarkdownEditor value={content} onChange={setContent} />
        </div>
      </div>

      <div className="admin-card" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer" }}>
          <input
            type="checkbox"
            checked={published}
            onChange={(e) => setPublished(e.target.checked)}
            className="admin-checkbox"
          />
          <span style={{ color: published ? "#00ff00" : "#666" }}>
            {published ? "published" : "draft"}
          </span>
        </label>

        <button type="submit" disabled={saving} className="admin-btn">
          {saving ? "saving..." : "save"}
        </button>
      </div>
    </form>
  )
}
