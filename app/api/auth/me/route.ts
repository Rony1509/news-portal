import { NextResponse } from "next/server"
import { authenticateRequest } from "@/lib/auth"

export async function GET(request: Request) {
  const user = authenticateRequest(request)
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }
  return NextResponse.json({
    user: {
      id: user.userId,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  })
}
