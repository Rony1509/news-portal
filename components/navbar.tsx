"use client"

import Link from "next/link"
import { useAuth } from "@/context/auth-context"
import { Button } from "@/components/ui/button"
import { Newspaper, LogOut, Plus, User } from "lucide-react"

export function Navbar() {
  const { user, logout, loading } = useAuth()

  return (
    <header className="sticky top-0 z-50 border-b border-border/30 bg-card/40 backdrop-blur-2xl">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-secondary overflow-hidden group-hover:shadow-lg group-hover:shadow-primary/50 transition-all">
            <div className="absolute inset-0 bg-black/20"></div>
            <Newspaper className="h-5 w-5 text-foreground absolute inset-2.5" />
          </div>
          <span className="text-lg font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-accent hidden sm:inline">NEWS PORTAL</span>
        </Link>

        <div className="flex items-center gap-4">
          {loading ? (
            <div className="h-8 w-32 rounded-lg bg-muted/40 animate-pulse" />
          ) : user ? (
            <>
              <Link href="/news/create">
                <Button variant="default" size="sm" className="gap-2 h-9 text-xs font-bold rounded-lg bg-gradient-to-r from-primary to-secondary hover:shadow-lg hover:shadow-primary/30 transition-all">
                  <Plus className="h-4 w-4" />
                  <span className="hidden sm:inline">Write</span>
                </Button>
              </Link>
              <div className="flex flex-col items-center gap-1 px-3 py-1.5 rounded-lg bg-muted/30 border border-border/30 backdrop-blur">
                <div className="h-6 w-6 rounded-full bg-gradient-to-br from-secondary to-accent flex items-center justify-center text-xs font-bold text-foreground">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-xs font-semibold text-foreground hidden sm:inline">{user.name}</span>
                  <span className="text-[10px] uppercase text-secondary">{user.role}</span>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={logout}
                className="gap-2 h-9 text-xs font-semibold text-muted-foreground hover:text-accent hover:bg-muted/40 transition-all"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Exit</span>
              </Button>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" size="sm" className="h-9 text-xs font-semibold hover:text-primary hover:bg-muted/40">
                  Sign In
                </Button>
              </Link>
              <Link href="/register">
                <Button size="sm" className="h-9 text-xs font-bold rounded-lg bg-gradient-to-r from-primary to-secondary hover:shadow-lg hover:shadow-primary/30 transition-all">
                  Join Now
                </Button>
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  )
}
