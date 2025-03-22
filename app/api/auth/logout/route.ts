import { type NextRequest, NextResponse } from "next/server"
import { clearAuthCookie } from "@/lib/auth"
import logger from "@/lib/logger"

export async function POST(request: NextRequest) {
  try {
    // Clear auth cookie
    clearAuthCookie()

    logger.info("User logged out successfully")

    return NextResponse.json({ success: true })
  } catch (error) {
    logger.error({ error }, "Logout failed")

    return NextResponse.json({ error: "Logout failed" }, { status: 500 })
  }
}

