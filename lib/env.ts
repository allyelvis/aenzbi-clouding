import { z } from "zod"

// Define environment variable schema with more flexible validation
const envSchema = z.object({
  // Database - provide a mock/default value for development
  DATABASE_URL: z.string().optional().default("postgresql://postgres:postgres@localhost:5432/aenzbi"),

  // Authentication - provide a default for development (not secure for production)
  JWT_SECRET: z.string().optional().default("dev_jwt_secret_at_least_32_characters_long"),

  // Application
  NEXT_PUBLIC_APP_URL: z.string().optional().default("http://localhost:3000"),
  NEXT_PUBLIC_APP_NAME: z.string().default("AENZBi Cloud"),
  NEXT_PUBLIC_APP_VERSION: z.string().default("1.0.0"),

  // Optional services
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z
    .string()
    .transform((val) => (val ? Number(val) : undefined))
    .optional(),
  SMTP_USER: z.string().optional(),
  SMTP_PASSWORD: z.string().optional(),
  SMTP_FROM: z.string().email().optional(),

  // Logging
  LOG_LEVEL: z.enum(["debug", "info", "warn", "error"]).default("info"),

  // Node environment
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
})

// Parse environment variables with better error handling
function getEnv() {
  try {
    // For server-side code
    if (typeof process !== "undefined") {
      const parsed = envSchema.parse(process.env)

      // Log warning if using default values in production
      if (process.env.NODE_ENV === "production") {
        const usingDefaults = []
        if (!process.env.DATABASE_URL) usingDefaults.push("DATABASE_URL")
        if (!process.env.JWT_SECRET) usingDefaults.push("JWT_SECRET")
        if (!process.env.NEXT_PUBLIC_APP_URL) usingDefaults.push("NEXT_PUBLIC_APP_URL")

        if (usingDefaults.length > 0) {
          console.warn(
            `⚠️ WARNING: Using default values for ${usingDefaults.join(", ")} in production. This is not secure!`,
          )
        }
      }

      return parsed
    }

    // For client-side code, only return public variables
    return {
      NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
      NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME || "AENZBi Cloud",
      NEXT_PUBLIC_APP_VERSION: process.env.NEXT_PUBLIC_APP_VERSION || "1.0.0",
    }
  } catch (error) {
    // Log the error but don't crash the application
    console.error("Environment variable validation error:", error)

    // Return default values as fallback
    return {
      DATABASE_URL: "postgresql://postgres:postgres@localhost:5432/aenzbi",
      JWT_SECRET: "dev_jwt_secret_at_least_32_characters_long",
      NEXT_PUBLIC_APP_URL: "http://localhost:3000",
      NEXT_PUBLIC_APP_NAME: "AENZBi Cloud",
      NEXT_PUBLIC_APP_VERSION: "1.0.0",
      LOG_LEVEL: "info",
      NODE_ENV: "development",
    }
  }
}

// Export validated environment variables
export const env = getEnv()

// Helper function to check if we're in development mode
export const isDev = env.NODE_ENV === "development"

// Helper function to check if we're in production mode
export const isProd = env.NODE_ENV === "production"

// Helper function to check if we're in test mode
export const isTest = env.NODE_ENV === "test"

