import page from "./index.html"
import stylesheet from "./styles.css"

export default {
  async fetch(request, env, ctx) {
    // Access runs on the Worker itself. Fail closed on every alternate route
    // and if the Access application is accidentally detached.
    if (!ctx.access || ctx.access.aud !== env.ACCESS_AUD) {
      return new Response("Sign-in required", { status: 401 })
    }
    const identity = await ctx.access.getIdentity()
    if (identity?.email?.toLowerCase() !== env.ALLOWED_EMAIL) {
      return new Response("Access denied", { status: 403 })
    }

    const pathname = new URL(request.url).pathname
    if (request.method !== "GET" && request.method !== "HEAD") {
      return new Response("Method not allowed", { status: 405, headers: { Allow: "GET, HEAD" } })
    }
    const headers = {
      "Cache-Control": "private, no-store",
      "X-Content-Type-Options": "nosniff",
      "X-Robots-Tag": "noindex, nofollow",
      "Referrer-Policy": "no-referrer",
      "Content-Security-Policy":
        "default-src 'none'; style-src 'self'; base-uri 'none'; frame-ancestors 'none'; form-action 'none'",
    }
    let body
    if (pathname === "/" || pathname === "/index.html") {
      body = page
      headers["Content-Type"] = "text/html; charset=utf-8"
    } else if (pathname === "/styles.css") {
      body = stylesheet
      headers["Content-Type"] = "text/css; charset=utf-8"
    } else {
      return new Response("Not found", { status: 404, headers })
    }
    return new Response(request.method === "HEAD" ? null : body, { headers })
  },
}
