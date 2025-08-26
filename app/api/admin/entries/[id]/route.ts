import { type NextRequest, NextResponse } from "next/server"
import { deletePDFEntry, getPDFEntry } from "@/lib/redis"
// <CHANGE> Removed server-side Clerk auth import to fix runtime error
import { del } from "@vercel/blob"

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // <CHANGE> Removed Clerk authentication check - now handled client-side
    const { id } = params

    // Get the entry to find the blob URL
    const entry = await getPDFEntry(id)
    if (!entry) {
      return NextResponse.json({ error: "Entry not found" }, { status: 404 })
    }

    // Delete from Vercel Blob
    try {
      await del(entry.blobUrl)
    } catch (blobError) {
      console.error("Error deleting from blob:", blobError)
      // Continue with Redis deletion even if blob deletion fails
    }

    // Delete from Redis
    await deletePDFEntry(id)

    return NextResponse.json({ message: "Entry deleted successfully" })
  } catch (error) {
    console.error("Error deleting entry:", error)
    return NextResponse.json({ error: "Failed to delete entry" }, { status: 500 })
  }
}
