"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ZoomIn, ZoomOut, RotateCw, Download, Maximize2 } from "lucide-react"

interface PDFViewerProps {
  pdfUrl: string
  filename: string
}

export function PDFViewer({ pdfUrl, filename }: PDFViewerProps) {
  const [zoom, setZoom] = useState(100)
  const [rotation, setRotation] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [error, setError] = useState("")

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 25, 200))
  }

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 25, 50))
  }

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360)
  }

  const handleDownload = () => {
    try {
      const link = document.createElement("a")
      link.href = pdfUrl
      link.download = filename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (error) {
      setError("Failed to download PDF")
    }
  }

  const handleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
  }

  return (
    <div className={`${isFullscreen ? "fixed inset-0 z-50 bg-white dark:bg-slate-900" : ""}`}>
      {/* Toolbar */}
      <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleZoomOut} disabled={zoom <= 50}>
              <ZoomOut className="w-4 h-4" />
            </Button>
            <span className="text-sm font-medium min-w-[60px] text-center">{zoom}%</span>
            <Button variant="outline" size="sm" onClick={handleZoomIn} disabled={zoom >= 200}>
              <ZoomIn className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={handleRotate}>
              <RotateCw className="w-4 h-4" />
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleFullscreen}>
              <Maximize2 className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={handleDownload}>
              <Download className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

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
