import { NextResponse } from "next/server"
import { commentSchema } from "@/lib/validation"
import { authenticateRequest } from "@/lib/auth"
import { addComment } from "@/services/newsService"

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = authenticateRequest(request)
    if (!user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()
    const parsed = commentSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0].message },
        { status: 400 }
      )
    }

    const news = await addComment(id, parsed.data, user.userId, user.name)
    return NextResponse.json(news)
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to add comment"
    return NextResponse.json({ error: message }, { status: 400 })
  }
}
