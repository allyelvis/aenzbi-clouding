import { type NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import logger from "@/lib/logger"

export async function GET(request: NextRequest) {
  try {
    // Get current user
    const user = await getCurrentUser(request)

    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    // Return user data
    return NextResponse.json({ user })
  } catch (error) {
    logger.error({ error }, "Failed to get current user")

    return NextResponse.json({ error: "Authentication failed" }, { status: 500 })
  }
}

