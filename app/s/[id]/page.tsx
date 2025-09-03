"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import dynamic from "next/dynamic"
import { FileText } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"


const PdfViewer = dynamic(() => import('@/components/pdf-viewer'), {
  ssr: false,
});

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
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [pdfAccess, setPdfAccess] = useState<PDFAccess | null>(null)
  const [initialLoading, setInitialLoading] = useState(true)
  const router = useRouter();

  useEffect(() => {
    fetchPDFInfo()
  }, [id])

  const fetchPDFInfo = async () => {
    try {
      const response = await fetch(`/api/pdf/${id}`)
      const data = await response.json()

      if (response.status === 404) {
        router.replace("/not-found")
        return
      }

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
    const { filename } = pdfInfo || {};
    const isImage = filename?.match(/\.(jpeg|jpg|png|gif|bmp|webp|tiff)$/i);
    return (
      <div className="bg-[#262626] inset-0 w-full h-full">
        {isImage ? (
          <img src={pdfAccess.pdfUrl} alt={pdfAccess.name} className="w-full h-full object-contain" />
        ) : (
          <div className="inset-0 w-full h-full">
            <PdfViewer
              pdfUrl={pdfAccess.pdfUrl}
            />
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center">
      <div className="bg-gray-700 rounded-lg p-8 w-96 max-w-sm mx-4">
        <h2 className="text-white text-xl font-medium mb-6 text-center">This file is protected</h2>

        <form onSubmit={handlePasswordSubmit}>
          <div className="mb-6">
            <label className="block text-blue-400 text-sm mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-transparent border-0 border-b-2 border-blue-400 text-white placeholder-gray-400 focus:outline-none focus:border-blue-300 pb-1"
              required
            />
          </div>

          {error && <div className="text-red-400 text-sm mb-4 text-center">{error}</div>}

          <div className="flex justify-between">
            <button
              type="button"
              onClick={() => (window.location.href = "https://in.nepalembassy.gov.np/")}
              className="text-blue-400 hover:text-blue-300 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="text-blue-400 hover:text-blue-300 transition-colors disabled:opacity-50"
            >
              {loading ? "Verifying..." : "Open"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

