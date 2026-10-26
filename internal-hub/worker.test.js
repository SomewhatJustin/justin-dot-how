import assert from "node:assert/strict"
import { test } from "node:test"
import worker from "./worker.js"

const destination = "https://openclaw-thinko.tail6900fe.ts.net/internal/"

test("the public hostname serves only a redirect to the private hub", async () => {
  const response = worker.fetch(new Request("https://internal.justin.how/"))
  assert.equal(response.status, 302)
  assert.equal(response.headers.get("Location"), destination)
  assert.equal(response.headers.get("Cache-Control"), "no-store")
  assert.equal(await response.text(), "")
})

test("paths, queries, and login headers cannot change the redirect destination", () => {
  for (const path of [
    "/styles.css",
    "/index.html",
    "/?next=https://example.com",
    "/cdn-cgi/access/logout",
  ]) {
    const response = worker.fetch(
      new Request(`https://internal.justin.how${path}`, {
        headers: { "Cf-Access-Jwt-Assertion": "unused" },
      }),
    )
    assert.equal(response.headers.get("Location"), destination)
  }
})

test("HEAD works and mutation requests are rejected", async () => {
  assert.equal(
    worker.fetch(new Request("https://internal.justin.how", { method: "HEAD" })).status,
    302,
  )
  assert.equal(
    worker.fetch(new Request("https://internal.justin.how", { method: "POST" })).status,
    405,
  )
})
