import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/session"

function csv(value: unknown) {
  return `"${String(value ?? "").replaceAll('"', '""')}"`
}
export async function GET(request: NextRequest) {
  await requireAdmin()
  const from = request.nextUrl.searchParams.get("from")
  const to = request.nextUrl.searchParams.get("to")
  const start = from
    ? new Date(`${from}T00:00:00`)
    : new Date(new Date().setHours(0, 0, 0, 0))
  const end = to ? new Date(`${to}T23:59:59.999`) : new Date()
  const orders = await prisma.order.findMany({
    where: { createdAt: { gte: start, lte: end } },
    include: { client: true, technician: true },
    orderBy: { createdAt: "desc" },
  })
  const rows = [
    [
      "Orden",
      "Cliente",
      "Cédula",
      "Equipo",
      "Estado",
      "Prioridad",
      "Técnico",
      "Fecha",
    ],
    ...orders.map((order) => [
      order.number,
      order.client.name,
      order.client.cedula,
      `${order.brand} ${order.model}`,
      order.status,
      order.priority,
      order.technician.name,
      order.createdAt.toISOString(),
    ]),
  ]
  return new Response(rows.map((row) => row.map(csv).join(",")).join("\n"), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": "attachment; filename=techtrack-reporte.csv",
    },
  })
}
