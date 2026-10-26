const HUB_URL = "https://openclaw-thinko.tail6900fe.ts.net/internal/"

export default {
  fetch(request) {
    if (request.method !== "GET" && request.method !== "HEAD") {
      return new Response("Method not allowed", { status: 405, headers: { Allow: "GET, HEAD" } })
    }
    // This public endpoint serves no project content. Tailscale controls access
    // to the destination, so there is no separate account or email login.
    return new Response(null, {
      status: 302,
      headers: {
        Location: HUB_URL,
        "Cache-Control": "no-store",
        "X-Robots-Tag": "noindex, nofollow",
        "Referrer-Policy": "no-referrer",
      },
    })
  },
}
