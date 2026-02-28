"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/context/auth-context"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, ArrowLeft, FileText } from "lucide-react"

const categories = ["Technology", "Sports", "Politics", "Entertainment", "Science", "Health", "Business", "General"]

export default function CreateNewsPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [title, setTitle] = useState("")
  const [body, setBody] = useState("")
  const [category, setCategory] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  if (!user) {
    return (
      <main className="mx-auto max-w-2xl px-4 py-12">
        <Card>
          <CardContent className="flex flex-col items-center gap-4 py-12">
            <FileText className="h-10 w-10 text-muted-foreground" />
            <p className="text-muted-foreground">You need to be logged in to create news.</p>
            <Link href="/login">
              <Button size="sm">Sign In</Button>
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
      const res = await fetch("/api/news", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ title: title.trim(), body: body.trim(), category }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      router.push(`/news/${data._id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create news")
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="mx-auto max-w-2xl px-6 py-10">
      <Link href="/" className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-secondary transition-all font-bold uppercase tracking-wider">
        <ArrowLeft className="h-4 w-4" />
        Back
      </Link>

      <Card className="border-border/50 bg-card/50 backdrop-blur rounded-xl overflow-hidden relative">
        <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-primary/20 to-transparent rounded-full blur-2xl -mr-20 -mt-20"></div>
        <div className="relative z-10">
          <CardHeader className="pb-6 border-b border-border/30">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-gradient-to-br from-primary/30 to-secondary/20 rounded-lg">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle className="text-3xl font-black tracking-tight">Write Your Story</CardTitle>
                <CardDescription className="text-base mt-2 text-muted-foreground">Share compelling news with our community</CardDescription>
              </div>
            </div>
          </CardHeader>
          
          <form onSubmit={handleSubmit}>
            <CardContent className="flex flex-col gap-6 pt-8">
              {error && (
                <Alert variant="destructive" className="border-destructive/40 bg-destructive/10 backdrop-blur">
                  <AlertDescription className="font-bold text-destructive">{error}</AlertDescription>
                </Alert>
              )}
              
              <div className="flex flex-col gap-2">
                <Label htmlFor="title" className="text-sm font-bold text-secondary uppercase tracking-wide">Headline</Label>
                <Input
                  id="title"
                  placeholder="Enter headline..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  minLength={3}
                  className="h-11 border-border/40 bg-muted/30 focus:bg-muted/50 focus:border-primary/50 font-semibold"
                />
              </div>
              
              <div className="flex flex-col gap-2">
                <Label htmlFor="category" className="text-sm font-bold text-secondary uppercase tracking-wide">Category</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger className="h-11 border-border/40 bg-muted/30 focus:bg-muted/50 focus:border-primary/50">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="body" className="text-sm font-bold text-secondary uppercase tracking-wide">Your Story</Label>
                <Textarea
                  id="body"
                  placeholder="Tell your story... (minimum 20 characters)"
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  required
                  minLength={20}
                  rows={12}
                  className="resize-y border-border/40 bg-muted/30 focus:bg-muted/50 focus:border-primary/50 font-medium"
                />
                <div className="flex items-center justify-between">
                  <p className={`text-xs font-bold uppercase tracking-wider ${body.length < 20 ? 'text-destructive' : 'text-secondary'}`}>
                    {body.length < 20 ? `${20 - body.length} characters needed` : `${body.length} characters`}
                  </p>
                </div>
              </div>
              
              <Button type="submit" size="lg" className="h-12 w-full font-black text-base bg-gradient-to-r from-primary via-secondary to-accent hover:shadow-xl hover:shadow-primary/30 transition-all" disabled={loading}>
                {loading && <Loader2 className="mr-3 h-5 w-5 animate-spin" />}
                {loading ? 'Publishing...' : 'Publish Article'}
              </Button>
            </CardContent>
          </form>
        </div>
      </Card>
    </main>
  )
}
