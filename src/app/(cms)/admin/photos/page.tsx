"use client"

import { useState, useEffect, useCallback } from "react"
import Image from "next/image"

interface Photo {
  id: string
  filename: string
  originalFilename: string | null
  altText: string | null
  width: number | null
  height: number | null
  sortOrder: number
}

export default function PhotosPage() {
  const [photos, setPhotos] = useState<Photo[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState("")

  const loadPhotos = useCallback(async () => {
    try {
      const res = await fetch("/api/photos")
      const data = await res.json()
      setPhotos(data)
    } catch {
      setError("failed to load photos")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadPhotos()
  }, [loadPhotos])

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files
    if (!files?.length) return

    setUploading(true)
    setError("")

    try {
      for (const file of Array.from(files)) {
        const formData = new FormData()
        formData.append("file", file)
        formData.append("type", "photo")

        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        })

        if (!res.ok) {
          throw new Error("upload failed")
        }
      }

      loadPhotos()
    } catch {
      setError("failed to upload photos")
    } finally {
      setUploading(false)
      e.target.value = ""
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("delete this photo?")) return

    try {
      await fetch(`/api/photos/${id}`, { method: "DELETE" })
      setPhotos(photos.filter((p) => p.id !== id))
    } catch {
      setError("failed to delete photo")
    }
  }

  async function handleUpdateAlt(id: string, altText: string) {
    try {
      await fetch(`/api/photos/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ altText }),
      })
    } catch {
      setError("failed to update alt text")
    }
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
          <h1>photos</h1>
          <p>{photos.length} images in gallery</p>
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
        {photos.map((photo) => (
          <div key={photo.id} className="admin-photo-item">
            <Image
              src={`/uploads/${photo.filename}`}
              alt={photo.altText || photo.originalFilename || "Photo"}
              fill
              style={{ objectFit: "cover" }}
              sizes="150px"
            />
            <div className="admin-photo-actions">
              <button
                onClick={() => handleDelete(photo.id)}
                className="admin-btn admin-btn-danger admin-btn-sm"
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
              padding: "0.25rem"
            }}>
              <input
                type="text"
                placeholder="alt..."
                defaultValue={photo.altText || ""}
                onBlur={(e) => handleUpdateAlt(photo.id, e.target.value)}
                style={{
                  width: "100%",
                  background: "transparent",
                  border: "none",
                  color: "#00ff00",
                  fontSize: "0.6875rem",
                  fontFamily: "inherit",
                  outline: "none"
                }}
              />
            </div>
          </div>
        ))}
        {photos.length === 0 && (
          <div style={{ gridColumn: "1 / -1", padding: "2rem", textAlign: "center", color: "#666" }}>
            no photos yet
          </div>
        )}
      </div>
    </div>
  )
}
