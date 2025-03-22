import { Pool, type PoolClient } from "pg"
import { drizzle } from "drizzle-orm/node-postgres"
import { migrate } from "drizzle-orm/node-postgres/migrator"
import { env } from "@/lib/env"
import logger from "@/lib/logger"

// Create a PostgreSQL connection pool
const pool = new Pool({
  connectionString: env.DATABASE_URL,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
})

// Initialize connection
pool.on("connect", () => {
  logger.info("Connected to PostgreSQL database")
})

pool.on("error", (err) => {
  logger.error({ err }, "PostgreSQL pool error")
})

// Export the drizzle ORM instance
export const db = drizzle(pool)

// Helper function to get a client from the pool
export async function getClient(): Promise<PoolClient> {
  return await pool.connect()
}

// Function to run migrations
export async function runMigrations() {
  try {
    logger.info("Running database migrations...")
    await migrate(db, { migrationsFolder: "drizzle" })
    logger.info("Database migrations completed successfully")
  } catch (error) {
    logger.error({ error }, "Failed to run database migrations")
    throw error
  }
}

// Function to test database connection
export async function testConnection() {
  let client: PoolClient | null = null
  try {
    client = await pool.connect()
    await client.query("SELECT NOW()")
    logger.info("Database connection test successful")
    return true
  } catch (error) {
    logger.error({ error }, "Database connection test failed")
    return false
  } finally {
    if (client) client.release()
  }
}

// Graceful shutdown function
export async function closeConnection() {
  try {
    await pool.end()
    logger.info("Database connection pool closed")
  } catch (error) {
    logger.error({ error }, "Error closing database connection pool")
  }
}

