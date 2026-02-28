"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/context/auth-context"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Newspaper, Eye, EyeOff } from "lucide-react"

export default function RegisterPage() {
  const { register } = useAuth()
  const router = useRouter()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (name.trim().length < 2) {
      setError("Name must be at least 2 characters")
      return
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters")
      return
    }

    setLoading(true)
    try {
      await register(name.trim(), email, password)
      router.push("/")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="flex min-h-[calc(100vh-8rem)] items-center justify-center px-4 py-12 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/5"></div>
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-10 w-72 h-72 bg-secondary/20 rounded-full blur-3xl"></div>
      
      <div className="w-full max-w-md relative z-10">
        <div className="mb-10 text-center">
          <Link href="/" className="inline-flex items-center gap-3 group">
            <div className="relative w-12 h-12 rounded-lg bg-gradient-to-br from-primary to-secondary group-hover:shadow-lg group-hover:shadow-primary/40 transition-all">
              <div className="absolute inset-0 bg-black/20"></div>
              <Newspaper className="h-6 w-6 text-foreground absolute inset-3" />
            </div>
            <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary hidden sm:inline">NEWS PORTAL</span>
          </Link>
        </div>

        <Card className="border-border/50 bg-card/50 backdrop-blur rounded-xl overflow-hidden relative">
          <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-primary/20 to-transparent rounded-full blur-2xl -mr-20 -mt-20"></div>
          <div className="relative z-10">
            <CardHeader className="pb-6 border-b border-border/30 text-center">
              <CardTitle className="text-3xl font-black tracking-tight">Join The Community</CardTitle>
              <CardDescription className="text-base mt-2 text-muted-foreground">Create your NewsPortal account (reporter by default)</CardDescription>
            </CardHeader>
            
            <form onSubmit={handleSubmit}>
              <CardContent className="flex flex-col gap-5 pt-6">
                {error && (
                  <Alert variant="destructive" className="border-destructive/40 bg-destructive/10">
                    <AlertDescription className="font-bold">{error}</AlertDescription>
                  </Alert>
                )}
                
                <div className="flex flex-col gap-2">
                  <Label htmlFor="name" className="text-sm font-bold text-secondary uppercase tracking-wide">Full Name</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    autoComplete="name"
                    className="h-11 border-border/40 bg-muted/30 focus:bg-muted/50 focus:border-primary/50"
                  />
                </div>
                
                <div className="flex flex-col gap-2">
                  <Label htmlFor="email" className="text-sm font-bold text-secondary uppercase tracking-wide">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                    className="h-11 border-border/40 bg-muted/30 focus:bg-muted/50 focus:border-primary/50"
                  />
                </div>
                
                <div className="flex flex-col gap-2">
                  <Label htmlFor="password" className="text-sm font-bold text-secondary uppercase tracking-wide">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Min 6 characters"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={6}
                      autoComplete="new-password"
                      className="h-11 pr-10 border-border/40 bg-muted/30 focus:bg-muted/50 focus:border-primary/50"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                  <p className={`text-xs font-bold uppercase tracking-wider ${password.length < 6 ? 'text-destructive' : 'text-secondary'}`}>
                    {password.length < 6 ? `${6 - password.length} characters needed` : '✓ Password set'}
                  </p>
                </div>
              </CardContent>
              
              <CardFooter className="flex flex-col gap-4 pt-4 border-t border-border/30">
                <Button type="submit" size="lg" className="h-12 w-full font-black text-base bg-gradient-to-r from-primary to-secondary hover:shadow-xl hover:shadow-primary/30 transition-all" disabled={loading}>
                  {loading && <Loader2 className="mr-3 h-5 w-5 animate-spin" />}
                  {loading ? 'Creating Account...' : 'Create Account'}
                </Button>
                <p className="text-center text-sm text-muted-foreground">
                  Already have account?{" "}
                  <Link href="/login" className="font-bold text-secondary hover:text-primary transition-colors">
                    Sign In
                  </Link>
                </p>
              </CardFooter>
            </form>
          </div>
        </Card>
      </div>
    </main>
  )
}
