import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { ClerkProvider } from "@clerk/nextjs"
import { DynamicTitle } from "@/components/dynamic-title"
import "./globals.css"

export const metadata: Metadata = {
  title: "Nepal Embassy - India",
  description: "Nepal Embassy - India",
  generator: "np-in",
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  other: {
    "X-Robots-Tag": "noindex, nofollow, noarchive, nosnippet, noimageindex",
  },
}

function validateClerkEnvironment() {
  const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
  const secretKey = process.env.CLERK_SECRET_KEY

  if (!publishableKey) {
    console.error("Missing NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY environment variable")
  }

  if (!secretKey) {
    console.error("Missing CLERK_SECRET_KEY environment variable")
  }
}

// Validate environment variables in development
if (process.env.NODE_ENV === "development") {
  validateClerkEnvironment()
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
          <DynamicTitle />
          {children}
        </body>
      </html>
    </ClerkProvider>
  )
}
