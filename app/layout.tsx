import type { Metadata } from 'next'
import { Inter, Source_Serif_4, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { AuthProvider } from '@/context/auth-context'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { Toaster } from 'sonner'
import './globals.css'

const _inter = Inter({ subsets: ["latin"] })
const _sourceSerif = Source_Serif_4({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: 'NewsPortal - Stay Informed',
  description: 'A full-stack news portal application with CRUD operations, authentication, and comments.',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased flex min-h-screen flex-col bg-background text-foreground">
        <AuthProvider>
          <Navbar />
          <div className="flex-1">{children}</div>
          <Footer />
          <Toaster position="top-right" richColors />
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  )
}
