import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import { registerHooks } from "node:module"
import { test } from "node:test"

// Load the same Text modules that Wrangler uploads, without a network service.
registerHooks({
  load(url, context, nextLoad) {
    if (url.endsWith(".html") || url.endsWith(".css")) {
      return {
        format: "module",
        source: `export default ${JSON.stringify(readFileSync(new URL(url), "utf8"))}`,
        shortCircuit: true,
      }
    }
    return nextLoad(url, context)
  },
})
const { default: worker } = await import("./worker.js")
const env = { ACCESS_AUD: "hub-audience", ALLOWED_EMAIL: "justinfowler1996@gmail.com" }
const context = (email = env.ALLOWED_EMAIL, aud = env.ACCESS_AUD) => ({
  access: { aud, getIdentity: async () => ({ email }) },
})
const request = (path = "/", options) => new Request(`https://internal.justin.how${path}`, options)

test("missing Access context and forged client headers cannot reveal projects", async () => {
  for (const path of ["/", "/index.html", "/styles.css"]) {
    const response = await worker.fetch(
      request(path, { headers: { "Cf-Access-Jwt-Assertion": "forged" } }),
      env,
      {},
    )
    assert.equal(response.status, 401)
    assert.doesNotMatch(await response.text(), /Antenna Sports|tail6900fe/)
  }
})

test("only this Access app and Justin's verified email can open the hub", async () => {
  assert.equal(
    (await worker.fetch(request(), env, context(env.ALLOWED_EMAIL, "other-app"))).status,
    401,
  )
  assert.equal((await worker.fetch(request(), env, context("someone@example.com"))).status, 403)
  assert.equal(
    (
      await worker.fetch(request(), env, {
        access: { aud: env.ACCESS_AUD, getIdentity: async () => undefined },
      })
    ).status,
    403,
  )
})

test("authorized hub has one Antenna Sports link and private responses", async () => {
  const response = await worker.fetch(request(), env, context())
  assert.equal(response.status, 200)
  assert.equal(response.headers.get("Cache-Control"), "private, no-store")
  assert.match(response.headers.get("Content-Security-Policy"), /frame-ancestors 'none'/)
  const html = await response.text()
  assert.equal((html.match(/https:\/\/openclaw-thinko.tail6900fe.ts.net\/sports/g) || []).length, 1)
  assert.match(html, /Tailscale required/)
  const css = await worker.fetch(request("/styles.css"), env, context())
  assert.match(css.headers.get("Content-Type"), /text\/css/)
  assert.match(await css.text(), /max-width: 580px/)
})

test("HEAD, unknown routes, and unsupported methods behave correctly", async () => {
  assert.equal(
    await (await worker.fetch(request("/", { method: "HEAD" }), env, context())).text(),
    "",
  )
  assert.equal((await worker.fetch(request("/unknown"), env, context())).status, 404)
  assert.equal((await worker.fetch(request("/", { method: "POST" }), env, context())).status, 405)
})
