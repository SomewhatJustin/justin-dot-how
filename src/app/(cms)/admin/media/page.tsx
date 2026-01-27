"use client"

import { useState, useEffect, useCallback } from "react"
import Image from "next/image"

interface Media {
  id: string
  filename: string
  originalFilename: string | null
  mimeType: string | null
  size: number | null
  width: number | null
  height: number | null
}

export default function MediaPage() {
  const [media, setMedia] = useState<Media[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState("")
  const [copied, setCopied] = useState<string | null>(null)

  const loadMedia = useCallback(async () => {
    try {
      const res = await fetch("/api/media")
      const data = await res.json()
      setMedia(data)
    } catch {
      setError("failed to load media")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadMedia()
  }, [loadMedia])

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files
    if (!files?.length) return

    setUploading(true)
    setError("")

    try {
      for (const file of Array.from(files)) {
        const formData = new FormData()
        formData.append("file", file)
        formData.append("type", "media")

        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        })

        if (!res.ok) {
          throw new Error("upload failed")
        }
      }

      loadMedia()
    } catch {
      setError("failed to upload files")
    } finally {
      setUploading(false)
      e.target.value = ""
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("delete this file?")) return

    try {
      await fetch(`/api/media/${id}`, { method: "DELETE" })
      setMedia(media.filter((m) => m.id !== id))
    } catch {
      setError("failed to delete file")
    }
  }

  function copyToClipboard(filename: string) {
    const url = `/uploads/${filename}`
    navigator.clipboard.writeText(url)
    setCopied(filename)
    setTimeout(() => setCopied(null), 2000)
  }

  function formatSize(bytes: number | null): string {
    if (!bytes) return "?"
    if (bytes < 1024) return `${bytes}b`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}kb`
    return `${(bytes / (1024 * 1024)).toFixed(1)}mb`
  }

  if (loading) {
    return (
      <div>
        <p style={{ color: "#666" }}>loading...</p>
      </div>
    )
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
        <div>
          <h1>media</h1>
          <p>images for blog posts</p>
        </div>
        <label className="admin-btn" style={{ cursor: "pointer" }}>
          {uploading ? "uploading..." : "+ upload"}
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleUpload}
            disabled={uploading}
            style={{ display: "none" }}
          />
        </label>
      </div>

      {error && <div className="admin-error">{error}</div>}

      <div className="admin-photo-grid">
        {media.map((item) => (
          <div key={item.id} className="admin-photo-item">
            {item.mimeType?.startsWith("image/") ? (
              <Image
                src={`/uploads/${item.filename}`}
                alt={item.originalFilename || "Media"}
                fill
                style={{ objectFit: "cover" }}
                sizes="150px"
              />
            ) : (
              <div style={{
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "#111"
              }}>
                <span style={{ fontSize: "2rem" }}>file</span>
              </div>
            )}
            <div className="admin-photo-actions" style={{ display: "flex", gap: "0.25rem" }}>
              <button
                onClick={() => copyToClipboard(item.filename)}
                className="admin-btn admin-btn-sm"
                style={{ padding: "0.125rem 0.375rem" }}
              >
                {copied === item.filename ? "ok" : "cp"}
              </button>
              <button
                onClick={() => handleDelete(item.id)}
                className="admin-btn admin-btn-danger admin-btn-sm"
                style={{ padding: "0.125rem 0.375rem" }}
              >
                x
              </button>
            </div>
            <div style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              background: "rgba(0,0,0,0.8)",
              padding: "0.25rem 0.5rem",
              fontSize: "0.6875rem",
              color: "#666"
            }}>
              <div style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {item.originalFilename || item.filename}
              </div>
              <div>{formatSize(item.size)}</div>
            </div>
          </div>
        ))}
        {media.length === 0 && (
          <div style={{ gridColumn: "1 / -1", padding: "2rem", textAlign: "center", color: "#666" }}>
            no media files yet
          </div>
        )}
      </div>
    </div>
  )
}
