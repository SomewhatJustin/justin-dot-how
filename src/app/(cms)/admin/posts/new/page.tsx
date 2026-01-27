"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { PostForm } from "@/components/cms/PostForm"

export default function NewPostPage() {
  const router = useRouter()
  const [error, setError] = useState("")
  const [saving, setSaving] = useState(false)

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
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (!res.ok) {
        const result = await res.json()
        throw new Error(result.error || "failed to create post")
      }

      const post = await res.json()
      router.push(`/admin/posts/${post.id}`)
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : "failed to create post")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <h1>new post</h1>
      <p>create a new blog entry</p>

      {error && <div className="admin-error">{error}</div>}

      <PostForm onSubmit={handleSubmit} saving={saving} />
    </div>
  )
}
