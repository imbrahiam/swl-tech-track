import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "@/lib/session"
import { getUploadUrl } from "@/lib/storage"

const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/pdf",
]
const MAX_SIZE_MB = 10

/**
 * POST /api/upload
 * Returns a presigned URL for direct client-side upload to MinIO.
 *
 * Body: { key: string; contentType: string; size: number }
 * Response: { url: string }
 *
 * The client uploads directly to MinIO using the presigned URL — the file
 * never passes through this server.
 */
export async function POST(req: NextRequest) {
  const session = await getServerSession()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await req.json()
  const { key, contentType, size } = body as {
    key: string
    contentType: string
    size: number
  }

  if (!key || !contentType || !size) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 })
  }

  if (!ALLOWED_TYPES.includes(contentType)) {
    return NextResponse.json(
      { error: "File type not allowed" },
      { status: 400 }
    )
  }

  if (size > MAX_SIZE_MB * 1024 * 1024) {
    return NextResponse.json(
      { error: `File exceeds ${MAX_SIZE_MB}MB limit` },
      { status: 400 }
    )
  }

  const url = await getUploadUrl(key, contentType)
  return NextResponse.json({ url })
}
