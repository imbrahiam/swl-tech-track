import Link from "next/link"
import { ORDER_STATUSES, type OrderStatus } from "@/lib/domain"
import { prisma } from "@/lib/prisma"
import { businessDaysBetween, isOrderOverdue } from "@/lib/business-days"
import { formatDate, formatOrderNumber, statusLabels } from "@/lib/format"
import { StatusBadge } from "@/components/order-badge"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export const metadata = { title: "Órdenes — TechTrack" }
const statuses = ORDER_STATUSES

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string }>
}) {
  const { q = "", status = "" } = await searchParams
  const numeric = Number(q.replace("#", ""))
  const orders = await prisma.order.findMany({
    where: {
      ...(status && statuses.includes(status as OrderStatus)
        ? { status: status as OrderStatus }
        : {}),
      ...(q
        ? {
            OR: [
              { client: { name: { contains: q } } },
              { brand: { contains: q } },
              ...(!Number.isNaN(numeric) ? [{ number: numeric }] : []),
            ],
          }
        : {}),
    },
    include: { client: true, technician: true },
    orderBy: { createdAt: "desc" },
  })
  return (
    <div className="space-y-6 p-4 md:p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Órdenes</h1>
          <p className="text-sm text-muted-foreground">
            Consulta y gestiona los servicios.
          </p>
        </div>
        <Button asChild>
          <Link href="/orders/new">Nueva orden</Link>
        </Button>
      </div>
      <form className="flex flex-col gap-3 sm:flex-row">
        <Input
          name="q"
          defaultValue={q}
          placeholder="N.º, cliente o equipo"
          className="max-w-md"
        />
        <select
          name="status"
          defaultValue={status}
          className="h-9 rounded-md border bg-background px-3 text-sm"
        >
          <option value="">Todos los estados</option>
          {statuses.map((item) => (
            <option key={item} value={item}>
              {statusLabels[item]}
            </option>
          ))}
        </select>
        <Button type="submit" variant="secondary">
          Filtrar
        </Button>
      </form>
      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Orden</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead>Equipo</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Prioridad</TableHead>
              <TableHead>Técnico</TableHead>
              <TableHead>Ingreso</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell>
                  <Link
                    className="font-medium underline-offset-4 hover:underline"
                    href={`/orders/${order.id}`}
                  >
                    {formatOrderNumber(order.number)}
                  </Link>
                </TableCell>
                <TableCell>
                  <Link
                    href={`/clients/${order.clientId}`}
                    className="hover:underline"
                  >
                    {order.client.name}
                  </Link>
                </TableCell>
                <TableCell>
                  {order.brand} {order.model}
                </TableCell>
                <TableCell className="space-x-2">
                  <StatusBadge status={order.status as OrderStatus} />
                  {isOrderOverdue(order.updatedAt) && (
                    <Badge variant="destructive">
                      {businessDaysBetween(order.updatedAt, new Date())} días
                    </Badge>
                  )}
                </TableCell>
                <TableCell>{order.priority}</TableCell>
                <TableCell>{order.technician.name}</TableCell>
                <TableCell>{formatDate(order.createdAt)}</TableCell>
              </TableRow>
            ))}
            {orders.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="h-24 text-center text-muted-foreground"
                >
                  No se encontraron órdenes.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
