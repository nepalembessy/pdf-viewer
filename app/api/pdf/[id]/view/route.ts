import { type NextRequest, NextResponse } from "next/server"
import { getRedisClient } from "@/lib/redis"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const redis = getRedisClient()

    // Get PDF info from Redis
    const pdfData = await redis.get(`pdf:${id}`)
    if (!pdfData) {
      return new NextResponse("PDF not found", { status: 404 })
    }

    const pdfInfo = JSON.parse(pdfData)

    // Check if user has access (via session or token)
    const sessionToken = request.cookies.get("pdf-access-" + id)?.value
    if (!sessionToken || sessionToken !== "granted") {
      return new NextResponse("Access denied", { status: 403 })
    }

    // Fetch the PDF from blob storage
    const response = await fetch(pdfInfo.blobUrl)
    if (!response.ok) {
      return new NextResponse("PDF not found", { status: 404 })
    }

    const pdfBuffer = await response.arrayBuffer()

    // Return PDF with proper headers
    return new NextResponse(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="${pdfInfo.filename}"`,
        "Cache-Control": "private, no-cache",
      },
    })
  } catch (error) {
    console.error("Error serving PDF:", error)
    return new NextResponse("Internal server error", { status: 500 })
  }
}
