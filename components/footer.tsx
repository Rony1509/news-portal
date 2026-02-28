import { Newspaper } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t border-border/30 bg-card/30 backdrop-blur mt-auto">
      <div className="mx-auto max-w-7xl px-6 py-8 text-center">
        <div className="flex items-center justify-center gap-3 mb-3">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
            <Newspaper className="h-4 w-4 text-foreground" />
          </div>
          <span className="text-sm font-black text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-accent">NEWS PORTAL</span>
        </div>
        <p className="text-xs text-muted-foreground">
          © 2026. Discover, Share, Discuss. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
