"use client"

import Link from "next/link"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MessageSquare, Clock, User } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

interface NewsCardProps {
  news: {
    _id: string
    title: string
    body: string
    category: string
    authorName: string
    comments: { _id?: string }[]
    createdAt: string
  }
}

const categoryStyles: Record<string, string> = {
  Technology: "bg-cyan-950/50 text-cyan-300 border-cyan-700/50",
  Sports: "bg-lime-950/50 text-lime-300 border-lime-700/50",
  Politics: "bg-rose-950/50 text-rose-300 border-rose-700/50",
  Entertainment: "bg-purple-950/50 text-purple-300 border-purple-700/50",
  Science: "bg-blue-950/50 text-blue-300 border-blue-700/50",
  Health: "bg-emerald-950/50 text-emerald-300 border-emerald-700/50",
  Business: "bg-orange-950/50 text-orange-300 border-orange-700/50",
  General: "bg-muted/30 text-muted-foreground border-border/50",
}

export function NewsCard({ news }: NewsCardProps) {
  return (
    <Link href={`/news/${news._id}`} className="group block">
      <Card className="h-full border-border/30 bg-card/50 backdrop-blur hover:bg-card/70 hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:shadow-primary/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/20 to-transparent rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
        <CardHeader className="pb-3 relative z-10">
          <div className="flex items-start justify-between gap-3 mb-3">
            <Badge
              variant="outline"
              className={`text-xs font-bold px-2.5 py-1 rounded-full border ${categoryStyles[news.category] || categoryStyles.General}`}
            >
              {news.category}
            </Badge>
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
              <Clock className="h-3.5 w-3.5 text-primary/50" />
              {formatDistanceToNow(new Date(news.createdAt), { addSuffix: true })}
            </span>
          </div>
          <h3 className="text-base font-bold leading-tight text-foreground group-hover:text-primary transition-colors line-clamp-2">
            {news.title}
          </h3>
        </CardHeader>
        <CardContent className="pb-3 relative z-10">
          <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
            {news.body}
          </p>
        </CardContent>
        <CardFooter className="flex items-center justify-between text-xs border-t border-border/20 pt-3 relative z-10">
          <span className="flex items-center gap-2 text-muted-foreground">
            <div className="h-5 w-5 rounded-full bg-gradient-to-br from-secondary to-accent/50 flex items-center justify-center text-[10px] font-bold text-foreground">
              {news.authorName.charAt(0).toUpperCase()}
            </div>
            {news.authorName}
          </span>
          <span className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-muted/30 font-semibold text-primary">
            <MessageSquare className="h-3.5 w-3.5" />
            {news.comments.length}
          </span>
        </CardFooter>
      </Card>
    </Link>
  )
}
