import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { ClerkProvider } from "@clerk/nextjs"
import "./globals.css"

export const metadata: Metadata = {
  title: "Secure PDF Sharing Platform",
  description: "Professional document sharing with password protection and secure access controls",
  generator: "v0.app",
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
        <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>{children}</body>
      </html>
    </ClerkProvider>
  )
}
