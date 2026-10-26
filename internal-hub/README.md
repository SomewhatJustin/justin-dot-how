# Internal project hub

`https://internal.justin.how` is a public, empty redirect to
`https://openclaw-thinko.tail6900fe.ts.net/internal/`. The page itself is served
only over Tailscale. There is no Cloudflare Access application, account login,
or email verification. The browser address changes to the Tailscale URL.

Edit `index.html` to add projects and `styles.css` to change the presentation.
The root `.eleventyignore` excludes this directory from the public Pages build.

## Deploy the private page

```sh
./internal-hub/deploy-tailnet.sh
```

This copies only HTML/CSS and the user service to `openclaw-thinko`. The service
listens on `127.0.0.1:8791`. Tailscale Serve publishes it at `/internal` with
HTTPS and restricts network access to the tailnet. Existing `/` and `/sports`
handlers are preserved. Tailscale manages certificate renewal.

## Deploy the memorable-address redirect

```sh
cd internal-hub
npm ci
npm test
npm run check
npm run deploy
```

Deployment requires Wrangler authentication to the Cloudflare account in
`wrangler.jsonc`. The Cloudflare connector can also upload `worker.js` as an
ES module with no bindings. No HTML, CSS, credentials, or private project data
are deployed to the Worker. Both `workers.dev` and preview URLs are disabled.

The Cloudflare Worker is `justin-internal-hub` in account
`692ece0608133b6afd27b995dd70d94e`. Its custom domain is `internal.justin.how` in
zone `018e8706b31b3273e14b87646197c664`. Cloudflare maintains HTTPS for the redirect.

## Verification

- The custom domain returns an empty 302 to the fixed Tailscale destination.
- A tailnet device can load the hub and stylesheet without signing in.
- The server listens on loopback only; Tailscale Serve says tailnet only.
- The public Eleventy build contains no hub page.
- Antenna Sports and the server's existing root route remain available.
