# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal website for [justin.how](https://justin.how), built with Next.js 14+ and a custom SQLite-backed CMS. Self-hostable with Docker.

## Commands

- `npm run dev` - Start Next.js dev server
- `npm run build` - Build for production (runs migrations first)
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run db:generate` - Generate Drizzle migrations
- `npm run db:migrate` - Run database migrations
- `npm run db:studio` - Open Drizzle Studio for database inspection
- `npm run migrate-content` - Import existing blog posts and photos

## Architecture

**Framework:** Next.js 14+ with App Router, TypeScript, Tailwind CSS

**Database:** SQLite with Drizzle ORM (stored in `data/site.db`)

**Auth:** Lucia v3 for session-based authentication

**Project Structure:**
```
src/
├── app/
│   ├── (public)/           # Public routes (/, /about, /blog, etc.)
│   ├── (cms)/              # Protected CMS routes (/admin/*)
│   │   ├── login/
│   │   └── admin/
│   │       ├── posts/      # Post CRUD
│   │       ├── photos/     # Photo management
│   │       ├── pages/      # Page editing
│   │       └── media/      # Media library
│   └── api/                # API routes
├── components/
│   ├── layout/             # Header, Footer
│   └── cms/                # CMSSidebar, PostForm, MarkdownEditor
├── lib/
│   ├── db/                 # Drizzle schema & client
│   ├── auth.ts             # Lucia config
│   └── markdown.ts         # Markdown processing
public/
└── uploads/                # User uploads (photos, blog images)
```

**Database Schema:**
- `users` - Admin users (id, username, passwordHash)
- `sessions` - Auth sessions
- `posts` - Blog posts (slug, title, content, published, publishedAt)
- `photos` - Gallery photos (filename, altText, sortOrder)
- `pages` - Static pages (about, projects)
- `media` - Media library for blog images
- `settings` - Site configuration

## URL Routes

| URL | Route |
|-----|-------|
| `/` | Homepage with latest posts |
| `/about` | About page |
| `/blog` | Blog post list |
| `/blog/[slug]` | Individual blog post |
| `/projects` | Projects page |
| `/photography` | Photo gallery |
| `/drinks` | Special drinks menu page |
| `/sadie` | Special letter page |
| `/admin` | CMS dashboard (protected) |
| `/login` | CMS login |
| `/sitemap.xml` | XML sitemap |

## Development

1. Install dependencies: `npm install`
2. Run migrations: `npm run db:migrate`
3. Import existing content: `npm run migrate-content`
4. Start dev server: `npm run dev`
5. Access CMS at `/admin` (default: admin/changeme123)

## Self-Hosting with Docker

```bash
# Build and run
docker-compose up -d

# Or build manually
docker build -t justin-dot-how .
docker run -p 3000:3000 -v ./data:/app/data -v ./public/uploads:/app/public/uploads justin-dot-how
```

**Environment Variables:**
- `DATABASE_PATH` - SQLite database path (default: `./data/site.db`)
- `ADMIN_USERNAME` - Initial admin username (default: `admin`)
- `ADMIN_PASSWORD` - Initial admin password (default: `changeme123`)

## Legacy Files (Eleventy)

The following files are from the previous Eleventy setup and can be removed after migration is verified:
- `_includes/` - Old template files
- `_data/` - Old data files
- `blog/` - Old markdown posts (migrated to database)
- `photography/` - Old photo files (migrated to uploads)
- `.eleventy.js` - Old Eleventy config
- `drinks.html`, `sadie.md`, etc. - Old page files
