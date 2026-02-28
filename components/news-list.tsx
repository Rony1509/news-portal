"use client"

import { useState } from "react"
import useSWR from "swr"
import { NewsCard } from "@/components/news-card"
import { Button } from "@/components/ui/button"
import { Loader2, RefreshCw, Newspaper } from "lucide-react"

const categories = ["All", "Technology", "Sports", "Politics", "Entertainment", "Science", "Health", "Business", "General"]

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export function NewsList() {
  const [activeCategory, setActiveCategory] = useState("All")

  const url = activeCategory === "All" ? "/api/news" : `/api/news?category=${activeCategory}`
  const { data, error, isLoading, mutate } = useSWR(url, fetcher, {
    revalidateOnFocus: false,
  })

  return (
    <div className="flex flex-col gap-8">
      {/* Category Filter */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-black text-primary uppercase tracking-widest">Explore Categories</p>
            <p className="text-xs text-muted-foreground mt-1">Discover stories by topic</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => mutate()}
            className="gap-2 h-8 text-xs font-semibold text-muted-foreground hover:text-secondary hover:bg-muted/40 transition-all"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-2 backdrop-blur">
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <Button
                key={cat}
                variant={activeCategory === cat ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveCategory(cat)}
                className={`h-8 rounded-full px-4 text-xs font-bold transition-all ${
                  activeCategory === cat
                    ? "bg-gradient-to-r from-primary via-secondary to-accent shadow-lg shadow-primary/40 border-primary/50"
                    : "border-border/50 hover:border-primary/50 hover:bg-muted/50 text-muted-foreground"
                }`}
              >
                {cat}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="flex items-center justify-center py-24">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="text-sm font-semibold text-muted-foreground">Loading stories...</p>
          </div>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center gap-4 py-24">
          <p className="text-base font-bold text-foreground">Unable to Load</p>
          <p className="text-sm text-muted-foreground">Failed to fetch articles</p>
          <Button variant="outline" size="sm" onClick={() => mutate()} className="gap-2 font-semibold">
            <RefreshCw className="h-4 w-4" />
            Try Again
          </Button>
        </div>
      ) : !data || data.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-4 rounded-xl border-2 border-dashed border-border py-24 bg-muted/10 text-center">
          <Newspaper className="h-14 w-14 text-muted-foreground/30" />
          <div>
            <p className="text-lg font-bold text-foreground">No Stories Yet</p>
            <p className="text-sm text-muted-foreground mt-1">Be the first to share your story</p>
          </div>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 animation-fade-in">
          {data.map((news: { _id: string; title: string; body: string; category: string; authorName: string; comments: { _id?: string }[]; createdAt: string }) => (
            <NewsCard key={news._id} news={news} />
          ))}
        </div>
      )}
    </div>
  )
}
