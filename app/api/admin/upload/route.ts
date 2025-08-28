import { type NextRequest, NextResponse } from "next/server"
import { put } from "@vercel/blob"
import { savePDFEntry } from "@/lib/redis"
import { generateUniqueId, isValidFileType } from "@/lib/utils"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File
    const name = formData.get("name") as string
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    // Validate required fields
    if (!file || !name || !email || !password) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 })
    }

    // Validate file type
    if (!isValidFileType(file.name)) {
      return NextResponse.json({ error: "Only Image/PDF files are allowed" }, { status: 400 })
    }

    // Validate file size (10MB limit)
    const maxSize = 20 * 1024 * 1024 // 10MB
    if (file.size > maxSize) {
      return NextResponse.json({ error: "File size must be less than 20MB" }, { status: 400 })
    }

    // Generate unique ID for the entry
    const uniqueId = generateUniqueId()

    // Upload to Vercel Blob with organized path
    const filename = `pdfs/${uniqueId}/${file.name}`
    const blob = await put(filename, file, {
      access: "public",
    })

    // Save entry to Redis
    const pdfEntry = {
      id: uniqueId,
      name,
      email,
      password,
      filename: file.name,
      blobUrl: blob.url,
      createdAt: new Date().toISOString(),
    }

    await savePDFEntry(pdfEntry)

    return NextResponse.json({
      success: true,
      id: uniqueId,
      shareUrl: `/s/${uniqueId}`,
      message: "PDF uploaded successfully",
    })
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json({ error: "Upload failed" }, { status: 500 })
  }
}
