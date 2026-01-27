"use client"

import { useState, useEffect, use } from "react"
import { useRouter } from "next/navigation"

interface Page {
  id: string
  title: string
  slug: string
  content: string
  layout: string | null
}

export default function EditPagePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const [page, setPage] = useState<Page | null>(null)
  const [content, setContent] = useState("")
  const [error, setError] = useState("")
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/pages/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setPage(data)
        setContent(data.content)
        setLoading(false)
      })
      .catch(() => {
        setError("failed to load page")
        setLoading(false)
      })
  }, [id])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setSaving(true)

    try {
      const res = await fetch(`/api/pages/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      })

      if (!res.ok) {
        throw new Error("failed to save")
      }

      router.refresh()
    } catch {
      setError("failed to save page")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div>
        <p style={{ color: "#666" }}>loading...</p>
      </div>
    )
  }

  if (!page) {
    return (
      <div>
        <h1>error</h1>
        <p>page not found</p>
      </div>
    )
  }

  return (
    <div>
      <div style={{ marginBottom: "1.5rem" }}>
        <h1>edit {page.title.toLowerCase()}</h1>
        <p>/{page.slug}</p>
      </div>

      {error && <div className="admin-error">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="admin-card">
          <div className="admin-form-group">
            <label htmlFor="content" className="admin-label">
              content (html)
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={20}
              className="admin-textarea"
              style={{ minHeight: "400px" }}
            />
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <button type="submit" disabled={saving} className="admin-btn">
              {saving ? "saving..." : "save"}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}
