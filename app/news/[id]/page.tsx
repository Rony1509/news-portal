"use client"

import { use } from "react"
import { NewsDetail } from "@/components/news-detail"

export default function NewsDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  return <NewsDetail newsId={id} />
}
