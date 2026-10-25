# Internal project hub

`https://internal.justin.how` is a small Cloudflare Worker hosted from this directory.
It currently links to Antenna Sports on Tailscale. Edit `index.html` to add projects
and `styles.css` to change the presentation.

This is deployed separately from the public Eleventy site. The root
`.eleventyignore` excludes this entire directory from the public Pages build.

## Develop and deploy

Use Node.js 22.15 or newer:

```sh
cd internal-hub
npm ci
npm test
npm run check
npm run deploy
```

Deployment requires Wrangler authentication to the Cloudflare account in
`wrangler.jsonc`. It can also be performed through the connected Cloudflare plugin
by uploading `worker.js` as an ES module, `index.html` and `styles.css` as Text
modules, and the bindings from the config. There are no runtime secrets.

`npm run dev` starts Wrangler. Requests fail closed without Access. For local
authenticated development, use an untracked Wrangler config with `access.dev.aud`
matching `ACCESS_AUD` and `access.dev.identity.email` matching `ALLOWED_EMAIL`.
Do not add development identities to the production config.

## Access configuration

- Account: `692ece0608133b6afd27b995dd70d94e`
- Zone: `018e8706b31b3273e14b87646197c664` (`justin.how`)
- Worker: `justin-internal-hub` / `7c6fe730d679426ebb9bd92c4cd88109`
- Access application: `06a31d20-66c6-4a89-aca9-eb0e8c1643f5` (`Justin Internal`)
- Policy: `aed786c1-1427-4483-ba25-e1ebadf358b4` (`Justin only`)
- Allowed identity: `justinfowler1996@gmail.com`, verified by the existing email
  one-time PIN provider. Sessions last seven days.

The Access application protects both the custom hostname and the Worker itself.
The Worker additionally checks the trusted runtime `ctx.access` audience and
verified identity. Client-supplied identity headers are not trusted. Missing
Access context returns 401; an unauthorized identity returns 403.

Both `workers.dev` and preview URLs are disabled. The custom domain manages its
own DNS record and HTTPS certificate. The linked sports app still requires
Tailscale independently of the hub's email sign-in.

After deployment, a signed-out request to the custom domain should redirect to
`somewhatjustin.cloudflareaccess.com`. To remove the hub, remove this Worker's
custom domain and Worker, then its dedicated Access application. No public-site
routes or other Access policies need to change.
