"use client"

import { useState, useEffect, use } from "react"
import { useRouter } from "next/navigation"
import { PostForm } from "@/components/cms/PostForm"

interface Post {
  id: string
  title: string
  slug: string
  content: string
  excerpt: string | null
  published: boolean
}

export default function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const [post, setPost] = useState<Post | null>(null)
  const [error, setError] = useState("")
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/posts/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setPost(data)
        setLoading(false)
      })
      .catch(() => {
        setError("failed to load post")
        setLoading(false)
      })
  }, [id])

  async function handleSubmit(data: {
    title: string
    slug: string
    content: string
    excerpt: string
    published: boolean
  }) {
    setError("")
    setSaving(true)

    try {
      const res = await fetch(`/api/posts/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (!res.ok) {
        const result = await res.json()
        throw new Error(result.error || "failed to update post")
      }

      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : "failed to update post")
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    if (!confirm("delete this post?")) return

    try {
      const res = await fetch(`/api/posts/${id}`, { method: "DELETE" })
      if (!res.ok) throw new Error("failed to delete post")
      router.push("/admin/posts")
      router.refresh()
    } catch {
      setError("failed to delete post")
    }
  }

  if (loading) {
    return (
      <div>
        <p style={{ color: "#666" }}>loading...</p>
      </div>
    )
  }

  if (!post) {
    return (
      <div>
        <h1>error</h1>
        <p>post not found</p>
      </div>
    )
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
        <div>
          <h1>edit post</h1>
          <p>/blog/{post.slug}</p>
        </div>
        <button onClick={handleDelete} className="admin-btn admin-btn-danger">
          delete
        </button>
      </div>

      {error && <div className="admin-error">{error}</div>}

      <PostForm
        initialData={{
          title: post.title,
          slug: post.slug,
          content: post.content,
          excerpt: post.excerpt || "",
          published: post.published,
        }}
        onSubmit={handleSubmit}
        saving={saving}
      />
    </div>
  )
}
