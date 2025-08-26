import { type NextRequest, NextResponse } from "next/server"
import { getPDFEntry } from "@/lib/redis"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    const entry = await getPDFEntry(id)
    if (!entry) {
      return NextResponse.json({ error: "PDF not found" }, { status: 404 })
    }

    // Return entry info without sensitive data
    return NextResponse.json({
      id: entry.id,
      filename: entry.filename,
      name: entry.name,
      createdAt: entry.createdAt,
    })
  } catch (error) {
    console.error("Error fetching PDF info:", error)
    return NextResponse.json({ error: "Failed to fetch PDF info" }, { status: 500 })
  }
}

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const { password } = await request.json()

    if (!password) {
      return NextResponse.json({ error: "Password is required" }, { status: 400 })
    }

    const entry = await getPDFEntry(id)
    if (!entry) {
      return NextResponse.json({ error: "PDF not found" }, { status: 404 })
    }

    // Verify password
    if (entry.password !== password) {
      return NextResponse.json({ error: "Invalid password" }, { status: 401 })
    }

    // Return PDF URL and info
    return NextResponse.json({
      success: true,
      pdfUrl: entry.blobUrl,
      filename: entry.filename,
      name: entry.name,
    })
  } catch (error) {
    console.error("Error verifying password:", error)
    return NextResponse.json({ error: "Failed to verify password" }, { status: 500 })
  }
}
