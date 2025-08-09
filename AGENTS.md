# Repository Guidelines

## Project Structure & Module Organization
- Source: Markdown/HTML pages in root and folders like `blog/`, `about/`, `projects/`.
- Layouts/partials: `_includes/` (e.g., `layout.html`, `post-layout.html`).
- Data: `_data/photography.js` provides image lists for templates.
- Static assets: `assets/` and `photography/` (images only are copied). CSS in `main.css`, `drinks.css`.
- Config: `.eleventy.js` (collections, passthrough, filters). Build output: `_site/` (git-ignored).

## Build, Test, and Development Commands
- `npm run dev`: Start Eleventy with local server and live reload.
- `npm run eleventy`: One-off build to `_site/`.
- `npm test`: Placeholder (no tests defined).
Deployment is automated via `webhook-server.js` -> `update.sh` on the server; do not invoke `update.sh` locally.

## Coding Style & Naming Conventions
- Formatting: Prettier (2 spaces, no semicolons, trailing commas, 100-char width). Run `npx prettier . --write` before PRs.
- Content: Blog posts in `blog/` use kebab-case filenames and YAML front matter (`title`, `date`). Shared defaults live in `blog/blog.json` (`layout`, `tags: post`).
- Templates: Reuse layouts in `_includes/`; avoid inline styles when possible.

## Testing Guidelines
- No automated tests yet. When adding utilities (filters, shortcodes, data files), prefer pure functions and add minimal unit tests in a future `tests/` folder.
- For now, validate locally: run `npm run dev`, check pages render, image paths resolve, and collections (`post`, `photos`) populate correctly.

## Commit & Pull Request Guidelines
- Commits: Short, imperative tense (e.g., "add post layout", "fix photo passthrough"). Group related changes.
- PRs: Include a clear summary, rationale, and screenshots for visual changes. Link related issues if applicable. Note build or content migration steps.

## Security & Ops Notes
- Webhook server listens on port `3000`. Keep it behind a reverse proxy and restrict the endpoint; server-side `update.sh` resets to `origin/main` and restarts the Eleventy service.
- Large binaries: Place images under `assets/` or `photography/`; avoid committing generated `_site/`.

