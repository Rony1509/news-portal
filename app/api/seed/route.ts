import { NextResponse } from "next/server"
import { resetStore } from "@/lib/db"

export async function POST(request: Request) {
  try {
    // only admin can reset database
    const { authenticateRequest } = await import("@/lib/auth")
    const auth = authenticateRequest(request)
    if (!auth || auth.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    // Clear all existing data
    resetStore()

    // create a default admin and a reporter for testing
    const bcrypt = await import("bcryptjs")
    const { createUser } = await import("@/lib/db")

    const now = new Date().toISOString()
    const adminPass = await bcrypt.hash("adminpass", 12)
    createUser({
      name: "Site Admin",
      email: "admin@example.com",
      password: adminPass,
      role: "admin",
    })

    const reporterPass = await bcrypt.hash("password123", 12)
    createUser({
      name: "Jane Reporter",
      email: "reporter@example.com",
      password: reporterPass,
      role: "reporter",
    })

    return NextResponse.json({
      message: "Database cleared and default users created (admin & reporter).",
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Reset failed"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
