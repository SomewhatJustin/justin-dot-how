"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || "auth failed")
      }

      router.push("/admin")
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : "auth failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      style={{
        minHeight: "calc(100vh + 80px)",
        marginTop: "-80px",
        background: "#0a0a0a",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'JetBrains Mono', 'Fira Code', 'SF Mono', Consolas, monospace",
        padding: "1rem",
      }}
    >
      <div style={{ width: "100%", maxWidth: "320px" }}>
        <div style={{ marginBottom: "2rem", color: "#00ff00" }}>
          <div style={{ fontSize: "0.75rem", color: "#444", marginBottom: "0.5rem" }}>
            $ ssh admin@justin.how
          </div>
          <div style={{ fontSize: "1rem" }}>authentication required</div>
        </div>

        <form onSubmit={handleSubmit}>
          {error && (
            <div
              style={{
                background: "#1f0f0f",
                border: "1px solid #ff4444",
                padding: "0.5rem 0.75rem",
                marginBottom: "1rem",
                color: "#ff4444",
                fontSize: "0.8125rem",
              }}
            >
              error: {error}
            </div>
          )}

          <div style={{ marginBottom: "1rem" }}>
            <label
              style={{
                display: "block",
                color: "#666",
                fontSize: "0.75rem",
                marginBottom: "0.25rem",
                textTransform: "uppercase",
                letterSpacing: "0.03em",
              }}
            >
              user
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoComplete="username"
              style={{
                width: "100%",
                padding: "0.5rem 0.75rem",
                background: "#0a0a0a",
                border: "1px solid #1a1a1a",
                color: "#00ff00",
                fontFamily: "inherit",
                fontSize: "0.875rem",
                outline: "none",
              }}
            />
          </div>

          <div style={{ marginBottom: "1.5rem" }}>
            <label
              style={{
                display: "block",
                color: "#666",
                fontSize: "0.75rem",
                marginBottom: "0.25rem",
                textTransform: "uppercase",
                letterSpacing: "0.03em",
              }}
            >
              pass
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              style={{
                width: "100%",
                padding: "0.5rem 0.75rem",
                background: "#0a0a0a",
                border: "1px solid #1a1a1a",
                color: "#00ff00",
                fontFamily: "inherit",
                fontSize: "0.875rem",
                outline: "none",
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "0.5rem 1rem",
              background: "transparent",
              border: "1px solid #00ff00",
              color: "#00ff00",
              fontFamily: "inherit",
              fontSize: "0.8125rem",
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.5 : 1,
            }}
          >
            {loading ? "authenticating..." : "login"}
          </button>
        </form>

        <div style={{ marginTop: "2rem", color: "#333", fontSize: "0.6875rem" }}>
          <div>connection secured</div>
          <div>justin.how cms v1.0</div>
        </div>
      </div>
    </div>
  )
}
