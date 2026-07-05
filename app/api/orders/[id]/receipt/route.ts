import { renderToBuffer } from "@react-pdf/renderer"
import { prisma } from "@/lib/prisma"
import { requireSession } from "@/lib/session"
import { objectExists, putObject } from "@/lib/storage"
import { ReceiptDocument } from "@/lib/receipt-pdf"

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  await requireSession()
  const { id } = await params
  const order = await prisma.order.findUnique({
    where: { id },
    include: { client: true, technician: true },
  })
  if (!order) return new Response("Orden no encontrada", { status: 404 })
  const buffer = await renderToBuffer(ReceiptDocument({ order }))
  const key = `techtrack/receipts/${order.id}/receipt.pdf`
  if (!(await objectExists(key)))
    await putObject(key, new Uint8Array(buffer), "application/pdf")
  return new Response(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename=orden-${order.number}.pdf`,
    },
  })
}
