# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies for native modules
RUN apk add --no-cache python3 make g++ vips-dev

COPY package*.json ./
RUN npm ci

COPY . .

# Generate Prisma client and build
RUN npm run db:generate
RUN npm run build

# Production stage
FROM node:20-alpine AS runner

WORKDIR /app

# Install runtime dependencies
RUN apk add --no-cache vips

ENV NODE_ENV=production
ENV DATABASE_PATH=/app/data/site.db

# Create non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy built assets
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/drizzle ./drizzle
COPY --from=builder /app/node_modules/better-sqlite3 ./node_modules/better-sqlite3

# Create data directory
RUN mkdir -p /app/data /app/public/uploads
RUN chown -R nextjs:nodejs /app/data /app/public/uploads

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
