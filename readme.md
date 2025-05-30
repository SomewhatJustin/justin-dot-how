# Justin Dot How - Personal Website

This is the repository for my personal website, [justin.how](https://justin.how).

## Tech Stack

*   **Static Site Generator:** [Eleventy (@11ty/eleventy)](https://www.11ty.dev/)
*   **Content:** Markdown and HTML
*   **Hosting:** Self-hosted on a Raspberry Pi
*   **Deployment:** Automatic updates via a GitHub webhook triggering a build script (`update.sh`) on the server.
*   **Webhook Server:** Simple Node.js/Express server (`webhook-server.js`)

## Structure

*   `.eleventy.js`: Eleventy configuration file.
*   `*.md`, `*.html`: Content files (various directories like `blog/`, `projects/`, `about/`).
*   `main.css`, `drinks.css`: Stylesheets.
*   `photography/`: Directory for photos, processed by a custom Eleventy collection.
*   `assets/`: General static assets.
*   `update.sh`: Script triggered by webhook to pull changes and rebuild the site.
*   `webhook-server.js`: Listens for GitHub webhooks to trigger updates.
*   `_site/`: Output directory generated by Eleventy (should be in `.gitignore`).

## Development

1.  Clone the repository.
2.  Run `npm install`.
3.  Run `npm run dev` to start the Eleventy development server.