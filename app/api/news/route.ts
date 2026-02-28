import { NextResponse } from "next/server"
import { newsSchema } from "@/lib/validation"
import { authenticateRequest } from "@/lib/auth"
import { createNews, getAllNews } from "@/services/newsService"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category") || undefined
    const news = await getAllNews(category)
    return NextResponse.json(news)
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch news"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const user = authenticateRequest(request)
    if (!user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const body = await request.json()
    const parsed = newsSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0].message },
        { status: 400 }
      )
    }

    const news = await createNews(parsed.data, user.userId, user.name)
    return NextResponse.json(news, { status: 201 })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create news"
    return NextResponse.json({ error: message }, { status: 400 })
  }
}
