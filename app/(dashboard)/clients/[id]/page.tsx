import Link from "next/link"
import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { formatDate, formatOrderNumber } from "@/lib/format"
import { StatusBadge } from "@/components/order-badge"
import type { OrderStatus } from "@/lib/domain"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export default async function ClientPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const client = await prisma.client.findUnique({
    where: { id },
    include: {
      orders: { include: { technician: true }, orderBy: { createdAt: "desc" } },
    },
  })
  if (!client) notFound()
  return (
    <div className="space-y-6 p-4 md:p-8">
      <div>
        <h1 className="text-2xl font-semibold">{client.name}</h1>
        <p className="text-muted-foreground">
          {client.cedula} · {client.phone}
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Historial de órdenes</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Orden</TableHead>
                <TableHead>Equipo</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Técnico</TableHead>
                <TableHead>Fecha</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {client.orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>
                    <Link
                      href={`/orders/${order.id}`}
                      className="font-medium hover:underline"
                    >
                      {formatOrderNumber(order.number)}
                    </Link>
                  </TableCell>
                  <TableCell>
                    {order.brand} {order.model}
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={order.status as OrderStatus} />
                  </TableCell>
                  <TableCell>{order.technician.name}</TableCell>
                  <TableCell>{formatDate(order.createdAt)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
