import Database from "better-sqlite3"
import { drizzle } from "drizzle-orm/better-sqlite3"
import { migrate } from "drizzle-orm/better-sqlite3/migrator"
import path from "path"
import fs from "fs"

const dbPath = process.env.DATABASE_PATH || path.join(process.cwd(), "data", "site.db")

// Ensure data directory exists
const dbDir = path.dirname(dbPath)
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true })
}

const sqlite = new Database(dbPath)
const db = drizzle(sqlite)

console.log("Running migrations...")
migrate(db, { migrationsFolder: path.join(process.cwd(), "drizzle") })
console.log("Migrations complete!")

sqlite.close()
