import { type NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { loginUser, setAuthCookie } from "@/lib/auth"
import logger from "@/lib/logger"

// Login request schema
const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
})

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json()

    // Validate request body
    const result = loginSchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json({ error: "Invalid request", details: result.error.format() }, { status: 400 })
    }

    const { email, password } = result.data

    // Attempt to login user
    const loginResult = await loginUser(email, password)

    if (!loginResult) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
    }

    const { user, token } = loginResult

    // Set auth cookie
    setAuthCookie(token)

    logger.info({ userId: user.id }, "User logged in successfully")

    // Return user data (without sensitive information)
    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    })
  } catch (error) {
    logger.error({ error }, "Login failed")

    return NextResponse.json({ error: "Authentication failed" }, { status: 500 })
  }
}

