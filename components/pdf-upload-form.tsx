"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { Upload, FileText, CheckCircle, Copy } from "lucide-react"

interface UploadResult {
  success: boolean
  id: string
  shareUrl: string
  message: string
}

export function PDFUploadForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  })
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [uploadResult, setUploadResult] = useState<UploadResult | null>(null)
  const [uploadProgress, setUploadProgress] = useState(0)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      if (selectedFile.type !== "application/pdf") {
        setError("Please select a PDF file")
        return
      }
      if (selectedFile.size > 10 * 1024 * 1024) {
        setError("File size must be less than 10MB")
        return
      }
      setFile(selectedFile)
      setError("")
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file) {
      setError("Please select a PDF file")
      return
    }

    setLoading(true)
    setError("")
    setUploadProgress(0)

    try {
      const formDataToSend = new FormData()
      formDataToSend.append("file", file)
      formDataToSend.append("name", formData.name)
      formDataToSend.append("email", formData.email)
      formDataToSend.append("password", formData.password)

      // Simulate progress
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => Math.min(prev + 10, 90))
      }, 200)

      const response = await fetch("/api/admin/upload", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("admin-token")}`,
        },
        body: formDataToSend,
      })

      clearInterval(progressInterval)
      setUploadProgress(100)

      const data = await response.json()

      if (response.ok) {
        setUploadResult(data)
        setFormData({ name: "", email: "", password: "" })
        setFile(null)
      } else {
        setError(data.error || "Upload failed")
      }
    } catch (error) {
      setError("Network error. Please try again.")
    } finally {
      setLoading(false)
      setTimeout(() => setUploadProgress(0), 1000)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const resetForm = () => {
    setUploadResult(null)
    setFormData({ name: "", email: "", password: "" })
    setFile(null)
    setError("")
  }

  if (uploadResult) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
          </div>
          <CardTitle className="text-xl text-green-600 dark:text-green-400">Upload Successful!</CardTitle>
          <CardDescription>Your PDF has been uploaded and is ready to share</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Sharing Link</Label>
            <div className="flex items-center gap-2">
              <Input
                value={`${window.location.origin}${uploadResult.shareUrl}`}
                readOnly
                className="font-mono text-sm"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(`${window.location.origin}${uploadResult.shareUrl}`)}
              >
                <Copy className="w-4 h-4" />
              </Button>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Entry ID</Label>
            <Input value={uploadResult.id} readOnly className="font-mono text-sm" />
          </div>
          <Button onClick={resetForm} className="w-full">
            Upload Another PDF
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
          <Upload className="w-6 h-6 text-primary" />
        </div>
        <CardTitle>Upload PDF</CardTitle>
        <CardDescription>Create a secure sharing link for your PDF document</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              placeholder="Your full name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              placeholder="your@email.com"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Access Password</Label>
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
              placeholder="Password to access PDF"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="file">PDF File</Label>
            <div className="relative">
              <Input id="file" type="file" accept=".pdf" onChange={handleFileChange} required />
              {file && (
                <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                  <FileText className="w-4 h-4" />
                  <span>{file.name}</span>
                  <span>({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                </div>
              )}
            </div>
          </div>

          {loading && uploadProgress > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Uploading...</span>
                <span>{uploadProgress}%</span>
              </div>
              <Progress value={uploadProgress} className="w-full" />
            </div>
          )}

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Uploading..." : "Upload PDF"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
