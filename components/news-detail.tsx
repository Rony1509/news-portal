"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import useSWR from "swr"
import { useAuth } from "@/context/auth-context"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { ArrowLeft, Clock, User, Edit, Trash2, Loader2, MessageSquare, Send } from "lucide-react"
import { formatDistanceToNow, format } from "date-fns"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

const categoryStyles: Record<string, string> = {
  Technology: "bg-cyan-950/50 text-cyan-300 border-cyan-700/30",
  Sports: "bg-lime-950/50 text-lime-300 border-lime-700/30",
  Politics: "bg-red-950/50 text-red-300 border-red-700/30",
  Entertainment: "bg-magenta-950/50 text-magenta-300 border-magenta-700/30",
  Science: "bg-blue-950/50 text-blue-300 border-blue-700/30",
  Health: "bg-emerald-950/50 text-emerald-300 border-emerald-700/30",
  Business: "bg-orange-950/50 text-orange-300 border-orange-700/30",
  General: "bg-muted/30 text-muted-foreground border-border/30",
}

export function NewsDetail({ newsId }: { newsId: string }) {
  const { user } = useAuth()
  const router = useRouter()
  const { data: news, error, isLoading, mutate } = useSWR(`/api/news/${newsId}`, fetcher)

  const [comment, setComment] = useState("")
  const [commentError, setCommentError] = useState("")
  const [commentLoading, setCommentLoading] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)

  useEffect(() => {
    if (error || !news || news.error) {
      router.push("/")
    }
  }, [error, news, router])

  const isAuthor =
    user && news &&
    (user.id === (news.authorId?._id || news.authorId) || user.role === "admin")

  const handleDelete = async () => {
    setDeleteLoading(true)
    try {
      const res = await fetch(`/api/news/${newsId}`, {
        method: "DELETE",
        credentials: "include",
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error)
      }
      router.push("/")
    } catch {
      setDeleteLoading(false)
    }
  }

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault()
    setCommentError("")

    if (!comment.trim()) {
      setCommentError("Comment is required")
      return
    }

    setCommentLoading(true)
    try {
      const res = await fetch(`/api/news/${newsId}/comments`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ body: comment.trim() }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setComment("")
      mutate()
    } catch (err) {
      setCommentError(err instanceof Error ? err.message : "Failed to add comment")
    } finally {
      setCommentLoading(false)
    }
  }

  if (isLoading) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-8">
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </main>
    )
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-8 relative">
      <Link
        href="/"
        className="mb-8 inline-flex items-center gap-1.5 text-sm text-secondary hover:text-primary transition-colors font-bold uppercase tracking-wide"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to News
      </Link>

      {/* Article */}
      <article>
        <Card className="border-border/50 bg-card/50 backdrop-blur rounded-xl overflow-hidden relative">
          <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-primary/20 to-transparent rounded-full blur-2xl -mr-20 -mt-20"></div>
          <div className="relative z-10">
            <CardHeader className="pb-6 border-b border-border/30">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <Badge
                  variant="outline"
                  className={`text-xs font-bold ${categoryStyles[news.category] || categoryStyles.General}`}
                >
                  {news.category}
                </Badge>
                {isAuthor && (
                  <div className="flex items-center gap-2">
                    <Link href={`/news/${newsId}/edit`}>
                      <Button variant="outline" size="sm" className="gap-1 h-9 text-xs font-bold bg-primary/10 hover:bg-primary/20 border-primary/30 text-primary">
                        <Edit className="h-3.5 w-3.5" />
                        Edit
                      </Button>
                    </Link>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="sm" className="gap-1 h-9 text-xs font-bold" disabled={deleteLoading}>
                          {deleteLoading ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          ) : (
                            <Trash2 className="h-3.5 w-3.5" />
                          )}
                          Delete
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="bg-card border-border/40">
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete this article?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the news article and all its comments.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                )}
              </div>
              <h1 className="mt-6 text-4xl font-black leading-tight text-foreground text-balance">
                {news.title}
              </h1>
              <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5 font-semibold">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-xs font-bold text-foreground">{news.authorName?.[0]?.toUpperCase()}</div>
                  {news.authorName}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4" />
                  {format(new Date(news.createdAt), "MMM d, yyyy 'at' h:mm a")}
                </span>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="text-lg text-foreground leading-relaxed whitespace-pre-wrap text-justify">
                {news.body}
              </div>
            </CardContent>
          </div>
        </Card>

        {/* Comments Section */}
        <div className="mt-12">
          <div className="flex items-center gap-2 mb-6">
            <MessageSquare className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-black text-foreground uppercase tracking-wide">
              Comments ({news.comments?.length || 0})
            </h2>
          </div>

          {/* Comment Form */}
          {user ? (
            <Card className="mb-8 border-border/50 bg-card/50 backdrop-blur rounded-xl overflow-hidden relative">
              <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-secondary/20 to-transparent rounded-full blur-2xl -mr-20 -mt-20"></div>
              <div className="relative z-10">
                <form onSubmit={handleComment}>
                  <CardContent className="flex flex-col gap-4 pt-6">
                    {commentError && (
                      <Alert variant="destructive" className="border-destructive/40 bg-destructive/10">
                        <AlertDescription className="font-bold">{commentError}</AlertDescription>
                      </Alert>
                    )}
                    <Textarea
                      placeholder="Share your thoughts..."
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      rows={4}
                      className="resize-y border-border/40 bg-muted/30 focus:bg-muted/50 focus:border-primary/50"
                    />
                    <Button type="submit" size="lg" className="self-end font-black uppercase tracking-wide bg-gradient-to-r from-secondary to-accent hover:shadow-lg hover:shadow-secondary/30" disabled={commentLoading}>
                      {commentLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      ) : (
                        <Send className="h-4 w-4 mr-2" />
                      )}
                      Post Comment
                    </Button>
                  </CardContent>
                </form>
              </div>
            </Card>
          ) : (
            <Card className="mb-8 border-border/50 bg-card/50 backdrop-blur rounded-xl">
              <CardContent className="flex items-center justify-center gap-2 py-8">
                <p className="text-sm text-muted-foreground">
                  <Link href="/login" className="font-bold text-primary hover:text-secondary transition-colors">
                    Sign in
                  </Link>{" "}
                  to leave a comment
                </p>
              </CardContent>
            </Card>
          )}

          {/* Comments List */}
          <div className="flex flex-col gap-4">
            {news.comments && news.comments.length > 0 ? (
              news.comments
                .slice()
                .reverse()
                .map(
                  (
                    c: { _id: string; userName: string; body: string; createdAt: string },
                    i: number
                  ) => (
                    <Card key={c._id || i} className="border-border/30 bg-muted/20 hover:bg-muted/30 transition-colors">
                      <CardContent className="py-4">
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-xs font-bold text-foreground">{c.userName?.[0]?.toUpperCase()}</div>
                          <span className="text-sm font-bold text-foreground">{c.userName}</span>
                          <Separator orientation="vertical" className="h-3.5 bg-border/50" />
                          <span className="text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(c.createdAt), { addSuffix: true })}
                          </span>
                        </div>
                        <p className="text-sm text-foreground leading-relaxed">{c.body}</p>
                      </CardContent>
                    </Card>
                  )
                )
            ) : (
              <p className="py-12 text-center text-sm text-muted-foreground italic">
                No comments yet. Be the first to share your thoughts!
              </p>
            )}
          </div>
        </div>
      </article>
    </main>
  )
}
