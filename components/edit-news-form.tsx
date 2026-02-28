"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import useSWR from "swr"
import { useAuth } from "@/context/auth-context"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, ArrowLeft, ShieldAlert } from "lucide-react"

const categories = ["Technology", "Sports", "Politics", "Entertainment", "Science", "Health", "Business", "General"]

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export function EditNewsForm({ newsId }: { newsId: string }) {
  const { user } = useAuth()
  const router = useRouter()
  const { data: news, isLoading: newsLoading } = useSWR(`/api/news/${newsId}`, fetcher)

  const [title, setTitle] = useState("")
  const [body, setBody] = useState("")
  const [category, setCategory] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (news && !news.error) {
      setTitle(news.title || "")
      setBody(news.body || "")
      setCategory(news.category || "")
    }
  }, [news])

  if (newsLoading) {
    return (
      <main className="mx-auto max-w-2xl px-4 py-8">
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </main>
    )
  }

  if (!user) {
    return (
      <main className="mx-auto max-w-2xl px-4 py-12">
        <Card>
          <CardContent className="flex flex-col items-center gap-4 py-12">
            <p className="text-muted-foreground">You need to be logged in to edit news.</p>
            <Link href="/login">
              <Button size="sm">Sign In</Button>
            </Link>
          </CardContent>
        </Card>
      </main>
    )
  }

  if (news && user.id !== (news.authorId?._id || news.authorId)) {
    return (
      <main className="mx-auto max-w-2xl px-4 py-12">
        <Card>
          <CardContent className="flex flex-col items-center gap-4 py-12">
            <ShieldAlert className="h-10 w-10 text-muted-foreground" />
            <p className="text-muted-foreground">You can only edit your own articles.</p>
            <Link href={`/news/${newsId}`}>
              <Button variant="outline" size="sm">Back to Article</Button>
            </Link>
          </CardContent>
        </Card>
      </main>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (title.trim().length < 3) {
      setError("Title must be at least 3 characters")
      return
    }
    if (body.trim().length < 20) {
      setError("Body must be at least 20 characters")
      return
    }
    if (!category) {
      setError("Please select a category")
      return
    }

    setLoading(true)
    try {
      const res = await fetch(`/api/news/${newsId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ title: title.trim(), body: body.trim(), category }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      router.push(`/news/${newsId}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update news")
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="mx-auto max-w-2xl px-4 py-8 relative">
      <Link
        href={`/news/${newsId}`}
        className="mb-8 inline-flex items-center gap-1.5 text-sm text-secondary hover:text-primary transition-colors font-bold uppercase tracking-wide"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Article
      </Link>

      <Card className="border-border/50 bg-card/50 backdrop-blur rounded-xl overflow-hidden relative">
        <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-primary/20 to-transparent rounded-full blur-2xl -mr-20 -mt-20"></div>
        <div className="relative z-10">
          <CardHeader className="pb-6 border-b border-border/30">
            <CardTitle className="text-3xl font-black tracking-tight">Edit Your Story</CardTitle>
            <CardDescription className="text-base mt-2">Update your news article</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="flex flex-col gap-5 pt-6">
              {error && (
                <Alert variant="destructive" className="border-destructive/40 bg-destructive/10">
                  <AlertDescription className="font-bold">{error}</AlertDescription>
                </Alert>
              )}
              <div className="flex flex-col gap-2">
                <Label htmlFor="title" className="text-sm font-bold text-secondary uppercase tracking-wide">Title</Label>
                <Input
                  id="title"
                  placeholder="Enter news title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  minLength={3}
                  className="h-11 border-border/40 bg-muted/30 focus:bg-muted/50 focus:border-primary/50"
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="category" className="text-sm font-bold text-secondary uppercase tracking-wide">Category</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger className="h-11 border-border/40 bg-muted/30 focus:bg-muted/50 focus:border-primary/50">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border/40">
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="body" className="text-sm font-bold text-secondary uppercase tracking-wide">Body</Label>
                <Textarea
                  id="body"
                  placeholder="Write your news article (min 20 characters)"
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  required
                  minLength={20}
                  rows={10}
                  className="resize-y border-border/40 bg-muted/30 focus:bg-muted/50 focus:border-primary/50"
                />
                <p className={`text-xs font-bold uppercase tracking-wider ${body.length < 20 ? 'text-destructive' : 'text-secondary'}`}>
                  {body.length < 20 ? `${20 - body.length} characters needed` : `${body.length} characters`}
                </p>
              </div>
              <Button type="submit" size="lg" className="h-12 w-full font-black text-base bg-gradient-to-r from-primary to-secondary hover:shadow-xl hover:shadow-primary/30 transition-all" disabled={loading}>
                {loading && <Loader2 className="mr-3 h-5 w-5 animate-spin" />}
                Update Article
              </Button>
            </CardContent>
          </form>
        </div>
      </Card>
    </main>
  )
}
