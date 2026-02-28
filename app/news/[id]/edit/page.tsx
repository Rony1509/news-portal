"use client"

import { use } from "react"
import { EditNewsForm } from "@/components/edit-news-form"

export default function EditNewsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  return <EditNewsForm newsId={id} />
}
