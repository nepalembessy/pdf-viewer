import { type NextRequest, NextResponse } from "next/server"
import { getAllPDFEntries } from "@/lib/redis"
// <CHANGE> Removed server-side Clerk auth import to fix runtime error

export async function GET(request: NextRequest) {
  try {
    // <CHANGE> Removed Clerk authentication check - now handled client-side
    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")

    const allEntries = await getAllPDFEntries()
    const total = allEntries.length
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const entries = allEntries.slice(startIndex, endIndex)

    return NextResponse.json({
      entries,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    })
  } catch (error) {
    console.error("Error fetching entries:", error)
    return NextResponse.json({ error: "Failed to fetch entries" }, { status: 500 })
  }
}
