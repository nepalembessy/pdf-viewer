import { type NextRequest, NextResponse } from "next/server"
import { getRedisClient } from "@/lib/redis"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  console.log("[v0] PDF proxy route hit!")
  console.log("[v0] Request URL:", request.url)
  console.log("[v0] Request method:", request.method)
  console.log("[v0] Params received:", params)

  try {
    const { id } = params
    console.log("[v0] PDF proxy request for ID:", id)

    if (!id) {
      console.log("[v0] No ID parameter provided")
      return new NextResponse("Missing PDF ID", { status: 400 })
    }

    const redis = getRedisClient()
    console.log("[v0] Redis client obtained")

    // Get PDF info from Redis
    const pdfData = await redis.get(`pdf:${id}`)
    console.log("[v0] Redis lookup result:", pdfData ? "found" : "not found")

    if (!pdfData) {
      console.log("[v0] PDF not found in Redis for ID:", id)
      try {
        const allKeys = await redis.keys("pdf:*")
        console.log("[v0] Available PDF keys in Redis:", allKeys)
      } catch (keyError) {
        console.log("[v0] Could not list Redis keys:", keyError)
      }
      return new NextResponse("Document not found", { status: 404 })
    }

    const fileInfo = JSON.parse(pdfData)
    console.log("[v0] PDF info found:", { filename: fileInfo.filename, hasUrl: !!fileInfo.blobUrl })

    // Check if user has access (via session or token)
    const sessionToken = request.cookies.get("pdf-access-" + id)?.value
    console.log("[v0] Session token:", sessionToken)
    console.log(
      "[v0] All cookies:",
      request.cookies.getAll().map((c) => ({ name: c.name, value: c.value })),
    )

    if (!sessionToken || sessionToken !== "granted") {
      console.log("[v0] Access denied - no valid session token")
      return new NextResponse("Access denied", { status: 403 })
    }

    // Fetch the PDF from blob storage
    console.log("[v0] Fetching PDF from blob URL:", fileInfo.blobUrl)
    const response = await fetch(fileInfo.blobUrl)
    console.log("[v0] Blob fetch response status:", response.status)

    if (!response.ok) {
      console.log("[v0] Failed to fetch PDF from blob storage:", response.status, response.statusText)
      return new NextResponse("PDF not found in storage", { status: 404 })
    }

    const pdfBuffer = await response.arrayBuffer()
    console.log("[v0] PDF fetched successfully, size:", pdfBuffer.byteLength)

    let contentType = "application/octet-stream";
    if (fileInfo.filename?.endsWith(".pdf")) {
      contentType = "application/pdf";
    } else if (fileInfo.filename?.endsWith(".png")) {
      contentType = "image/png";
    } else if (fileInfo.filename?.endsWith(".jpg") || fileInfo.filename?.endsWith(".jpeg")) {
      contentType = "image/jpeg";
    } // add more types as needed
    console.log("[v0] Determined content type:", contentType)

    // Return PDF with proper headers
    return new NextResponse(pdfBuffer, {
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `inline; filename="${fileInfo.filename}"`,
        "Cache-Control": "private, no-cache",
      },
    })
  } catch (error) {
    console.error("[v0] Error serving PDF:", error)
    console.error("[v0] Error stack:", error instanceof Error ? error.stack : "No stack trace")
    return new NextResponse("Internal server error", { status: 500 })
  }
}
