import jwt from "jsonwebtoken"
import { cookies } from "next/headers"

const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret-change-me"

export interface JWTPayload {
  userId: string
  email: string
  name: string
  role: "admin" | "reporter"
}

export function signToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" })
}

export function verifyToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload
  } catch {
    return null
  }
}

export async function getAuthUser(): Promise<JWTPayload | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get("auth-token")?.value
  if (!token) return null
  return verifyToken(token)
}

export function getTokenFromHeader(request: Request): string | null {
  const authHeader = request.headers.get("authorization")
  if (authHeader?.startsWith("Bearer ")) {
    return authHeader.slice(7)
  }
  const cookieHeader = request.headers.get("cookie")
  if (cookieHeader) {
    const match = cookieHeader.match(/auth-token=([^;]+)/)
    if (match) return match[1]
  }
  return null
}

export function authenticateRequest(request: Request): JWTPayload | null {
  const token = getTokenFromHeader(request)
  if (!token) return null
  return verifyToken(token)
}
