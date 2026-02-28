import { NextResponse } from "next/server"
import { getAllUsers } from "@/services/userService"

export async function GET(request: Request) {
  try {
    const { authenticateRequest } = await import("@/lib/auth")
    const auth = authenticateRequest(request)
    if (!auth || auth.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const users = await getAllUsers()
    return NextResponse.json(users)
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch users"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
