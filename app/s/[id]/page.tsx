"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Lock, FileText, Eye, EyeOff } from "lucide-react"

interface PDFInfo {
  id: string
  filename: string
  name: string
  createdAt: string
}

interface PDFAccess {
  success: boolean
  pdfUrl: string
  filename: string
  name: string
}

export default function PDFViewerPage() {
  const params = useParams()
  const id = params.id as string

  const [pdfInfo, setPdfInfo] = useState<PDFInfo | null>(null)
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [pdfAccess, setPdfAccess] = useState<PDFAccess | null>(null)
  const [initialLoading, setInitialLoading] = useState(true)

  useEffect(() => {
    fetchPDFInfo()
  }, [id])

  const fetchPDFInfo = async () => {
    try {
      const response = await fetch(`/api/pdf/${id}`)
      const data = await response.json()

      if (response.ok) {
        setPdfInfo(data)
      } else {
        setError(data.error || "Document not found")
      }
    } catch (error) {
      setError("Network error. Please try again.")
    } finally {
      setInitialLoading(false)
    }
  }

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const response = await fetch(`/api/pdf/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
      })

      const data = await response.json()

      if (response.ok) {
        setPdfAccess({
          ...data,
          pdfUrl: data.pdfUrl, // Use the actual blob URL directly
        })
      } else {
        setError(data.error || "Access denied")
      }
    } catch (error) {
      setError("Network error. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = () => {
    if (pdfAccess?.pdfUrl) {
      const link = document.createElement("a")
      link.href = pdfAccess.pdfUrl
      link.download = pdfAccess.filename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  if (initialLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading Document...</p>
        </div>
      </div>
    )
  }

  if (error && !pdfInfo) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-4">
              <FileText className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
            <CardTitle className="text-xl text-red-600 dark:text-red-400">Document Not Found</CardTitle>
            <CardDescription>The requested document could not be found</CardDescription>
          </CardHeader>
          <CardContent>
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (pdfAccess) {
    return (
      <div className="fixed inset-0 w-full h-full bg-white">
        <iframe src={pdfAccess.pdfUrl} className="w-full h-full border-0" title={pdfAccess.filename} />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <Lock className="w-6 h-6 text-primary" />
          </div>
          <CardTitle>Protected PDF</CardTitle>
          <CardDescription>Enter the password to view this document</CardDescription>
        </CardHeader>
        <CardContent>
          {pdfInfo && (
            <div className="mb-6 p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
              <div className="flex items-center gap-3 mb-2">
                <FileText className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">{pdfInfo.filename}</p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                Created on {new Date(pdfInfo.createdAt).toLocaleDateString()}
              </p>
            </div>
          )}

          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Enter access password"
                  className="pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Verifying..." : "Access PDF"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
