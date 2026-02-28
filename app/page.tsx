"use client"

import { useState } from "react"
import { NewsList } from "@/components/news-list"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Trash2, Loader2, CheckCircle, Newspaper } from "lucide-react"
import { useAuth } from "@/context/auth-context"
import Link from "next/link"

export default function HomePage() {
  const { user } = useAuth()
  const [clearing, setClearing] = useState(false)
  const [clearResult, setClearResult] = useState<string | null>(null)

  const handleClear = async () => {
    setClearing(true)
    setClearResult(null)
    try {
      const res = await fetch("/api/seed", { method: "POST", credentials: "include" })
      const data = await res.json()
      if (res.ok) {
        setClearResult(data.message)
        window.location.reload()
      } else {
        setClearResult(`Error: ${data.error}`)
      }
    } catch {
      setClearResult("Failed to clear database")
    } finally {
      setClearing(false)
    }
  }

  return (
    <main className="mx-auto max-w-7xl px-6 py-12">
      {/* Hero Section */}
      <section className="mb-16 relative rounded-2xl overflow-hidden border border-border/50">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-secondary/10 to-transparent"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-secondary/30 to-transparent rounded-full blur-3xl -mr-48 -mt-48"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-accent/20 to-transparent rounded-full blur-3xl -ml-48 -mb-48"></div>
        
        <div className="relative px-8 py-16 sm:px-12 sm:py-24">
          <div className="max-w-3xl">
            <div className="inline-block mb-6">
              <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-primary/20 border border-primary/30 backdrop-blur">
                <Newspaper className="h-4 w-4 text-primary" />
                <span className="text-xs font-bold text-primary uppercase tracking-wider">Latest Stories</span>
              </div>
            </div>
            
            <h1 className="text-5xl sm:text-6xl font-black tracking-tighter mb-6 leading-tight">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-accent">
                Explore The World
              </span>
              <br />
              <span className="text-foreground">Through News</span>
            </h1>
            
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed max-w-2xl">
              Discover compelling stories from around the globe. Read, share, and engage with our vibrant community of news enthusiasts.
            </p>
            
            <div className="flex flex-wrap items-center gap-3">
              {!user && (
                <Link href="/register">
                  <Button size="lg" className="font-bold bg-gradient-to-r from-primary to-secondary hover:shadow-lg hover:shadow-primary/40 transition-all gap-2">
                    <span>Get Started</span>
                  </Button>
                </Link>
              )}
              {user?.role === 'admin' && (
                <Button
                  size="lg"
                  variant="default"
                  onClick={handleClear}
                  disabled={clearing}
                  className="font-bold gap-2 bg-secondary text-foreground hover:bg-secondary/80 transition-all"
                >
                  {clearing ? <Loader2 className="h-5 w-5 animate-spin" /> : <Trash2 className="h-5 w-5" />}
                  Clear Database
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>

      {clearResult && (
        <Alert className="mb-8 border-green-500/50 bg-green-500/10 backdrop-blur">
          <CheckCircle className="h-5 w-5 text-green-400" />
          <AlertDescription className="text-green-300 font-semibold">{clearResult}</AlertDescription>
        </Alert>
      )}

      <NewsList />
    </main>
  )
}
