"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface PDFViewerProps {
  pdfUrl: string
  filename: string
}

export function PDFViewer({ pdfUrl, filename }: PDFViewerProps) {
  const [zoom, setZoom] = useState(100)
  const [rotation, setRotation] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [error, setError] = useState("")


  return (
    <div className={`${isFullscreen ? "fixed inset-0 z-50 bg-white dark:bg-slate-900" : ""}`}>
      {error && (
        <div className="p-4">
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </div>
      )}

      {/* PDF Display */}
      <div
        className={`${isFullscreen ? "h-[calc(100vh-80px)]" : "h-[70vh]"} overflow-auto bg-slate-100 dark:bg-slate-800`}
      >
        <div className="flex items-center justify-center min-h-full p-4">
          <Card className="shadow-lg">
            <CardContent className="p-0">
              <iframe
                src={`${pdfUrl}#zoom=${zoom}&rotate=${rotation}&toolbar=0&navpanes=0&scrollbar=1`}
                className={`border-0 ${isFullscreen ? "w-[90vw] h-[calc(100vh-120px)]" : "w-[800px] h-[600px]"}`}
                title={filename}
                onError={() => setError("Failed to load PDF")}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
