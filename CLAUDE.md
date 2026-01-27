# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal website for [justin.how](https://justin.how), built with Eleventy and hosted on Cloudflare Pages.

## Commands

- `npm run dev` - Start Eleventy dev server with live reload
- `npm run eleventy` - One-off build to `_site/`
- `npx prettier . --write` - Format code before PRs

## Architecture

**Static Site Generator:** Eleventy 3.x configured in `.eleventy.js`

**Content Sources:**
- `blog/*.md` - Blog posts (use kebab-case filenames, YAML front matter with `title` and `date`)
- `blog/blog.json` - Shared defaults for posts (`layout`, `tags: post`)
- Root-level `.md` and `.html` files for standalone pages

**Templates:**
- `_includes/` - Layouts and partials (`layout.html`, `post-layout.html`, `photos-layout.html`, etc.)
- `_includes/header.html` and `_includes/footer.html` - Site-wide components

**Data:**
- `_data/photography.js` - Generates image lists for templates (returns `all` and randomized `filmstrip` for homepage)
- `_data/pixelfed.json` - Ledger of processed Pixelfed post IDs (prevents re-downloading)

## Pixelfed Integration

Photos are automatically synced from Pixelfed to the `photography/` folder via GitHub Actions.

**How it works:**
1. `.github/workflows/sync-pixelfed.yml` runs daily at 06:00 UTC (or manually via workflow_dispatch)
2. `scripts/fetch-pixelfed.js` fetches recent media posts from Pixelfed API
3. New images are downloaded to `photography/` with naming pattern `pixelfed-{statusId}-{mediaId}.{ext}`
4. `_data/pixelfed.json` tracks processed post IDs to avoid duplicates
5. Changes are auto-committed and pushed, triggering Cloudflare Pages rebuild

**Required GitHub secrets:**
- `PIXELFED_TOKEN` - API bearer token
- `PIXELFED_INSTANCE` - Instance URL (e.g., `https://pixelfed.social`)

**Collections (defined in .eleventy.js):**
- `post` - All blog posts from `blog/*.md` (excludes index, sorted newest first)
- `photos` - All images from `photography/` folder (sorted by modification time)

**Static Assets:**
- `assets/` - General static files (copied to output)
- `photography/` - Photo images only (jpg, jpeg, png, gif, webp copied)
- `main.css`, `drinks.css` - Stylesheets (copied to output)

**Build Output:** `_site/` (git-ignored, deployed automatically by Cloudflare Pages)

## Formatting

Prettier config: 2 spaces, no semicolons, trailing commas, 100-char width.
