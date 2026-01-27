# justin.how

Personal website with custom CMS, built with Next.js and SQLite.

## Tech Stack

- **Framework:** Next.js 14+ (App Router, TypeScript)
- **Database:** SQLite with Drizzle ORM
- **Auth:** Lucia v3 (password-based sessions)
- **Styling:** Tailwind CSS

## Development

```bash
npm install
npm run dev
```

## Docker Deployment

### Quick Start

```bash
# Set admin credentials
export ADMIN_USERNAME=your_username
export ADMIN_PASSWORD=your_password

# Run with docker-compose
docker-compose up -d
```

The app will be available at `http://localhost:3000`.

### With HTTPS (Caddy)

The included `Caddyfile` provides automatic HTTPS. Update the domain in `Caddyfile`, then:

```bash
docker-compose --profile caddy up -d
```

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `ADMIN_USERNAME` | CMS admin username | Yes |
| `ADMIN_PASSWORD` | CMS admin password | Yes |
| `NODE_ENV` | Set to `production` for deployment | No |

### Data Persistence

Docker volumes are configured for:
- `./data` - SQLite database
- `./public/uploads` - Uploaded media files

## Content Migration

To migrate existing content from the Eleventy site:

```bash
npx tsx scripts/migrate-content.ts
```

## URLs

| Path | Description |
|------|-------------|
| `/` | Homepage |
| `/about` | About page |
| `/blog` | Blog listing |
| `/blog/[slug]` | Blog post |
| `/photography` | Photo gallery |
| `/projects` | Projects page |
| `/drinks` | Drinks page |
| `/sadie` | Sadie page |
| `/login` | CMS login |
| `/admin` | CMS dashboard |
