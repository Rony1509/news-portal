import { NextResponse } from "next/server"
import { newsSchema } from "@/lib/validation"
import { authenticateRequest } from "@/lib/auth"
import { getNewsById, updateNews, deleteNews } from "@/services/newsService"

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const news = await getNewsById(id)
    return NextResponse.json(news)
  } catch (error) {
    const message = error instanceof Error ? error.message : "News not found"
    return NextResponse.json({ error: message }, { status: 404 })
  }
}

export async function PUT(
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
    const parsed = newsSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0].message },
        { status: 400 }
      )
    }

    const news = await updateNews(id, parsed.data, user.userId)
    return NextResponse.json(news)
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update news"
    const status = message.includes("Unauthorized") ? 403 : 400
    return NextResponse.json({ error: message }, { status })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = authenticateRequest(request)
    if (!user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const { id } = await params
    const result = await deleteNews(id, user.userId)
    return NextResponse.json(result)
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to delete news"
    const status = message.includes("Unauthorized") ? 403 : 400
    return NextResponse.json({ error: message }, { status })
  }
}
