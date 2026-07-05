import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "@/lib/session"

export async function GET(request: NextRequest) {
  if (!(await getServerSession())) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  }
  const q = request.nextUrl.searchParams.get("q")?.trim() ?? ""
  if (q.length < 2) return NextResponse.json([])
  const clients = await prisma.client.findMany({
    where: {
      OR: [
        { cedula: { contains: q } },
        { phone: { contains: q } },
        { name: { contains: q } },
      ],
    },
    take: 5,
    orderBy: { name: "asc" },
  })
  return NextResponse.json(clients)
}
