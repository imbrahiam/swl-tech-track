import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { businessDaysBetween, isOrderOverdue } from "@/lib/business-days"
import { formatOrderNumber } from "@/lib/format"
import { PriorityBadge, StatusBadge } from "@/components/order-badge"
import type { OrderStatus, Priority } from "@/lib/domain"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export const metadata = { title: "Dashboard — TechTrack" }

export default async function DashboardPage() {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const [active, enteredToday, completedToday, queue] = await Promise.all([
    prisma.order.count({
      where: { status: { notIn: ["ENTREGADO", "SIN_REPARACION"] } },
    }),
    prisma.order.count({ where: { createdAt: { gte: today } } }),
    prisma.order.count({
      where: {
        status: { in: ["ENTREGADO", "SIN_REPARACION"] },
        updatedAt: { gte: today },
      },
    }),
    prisma.order.findMany({
      where: { status: { notIn: ["ENTREGADO", "SIN_REPARACION"] } },
      include: { client: true },
      orderBy: { createdAt: "asc" },
    }),
  ])
  const priorityOrder: Record<Priority, number> = { ALTA: 0, MEDIA: 1, BAJA: 2 }
  queue.sort(
    (a, b) =>
      priorityOrder[a.priority as Priority] -
        priorityOrder[b.priority as Priority] ||
      a.createdAt.getTime() - b.createdAt.getTime()
  )
  const overdue = queue.filter((order) =>
    isOrderOverdue(order.updatedAt)
  ).length
  const stats = [
    ["Órdenes activas", active],
    ["Ingresadas hoy", enteredToday],
    ["Con alerta", overdue],
    ["Completadas hoy", completedToday],
  ] as const
  return (
    <div className="space-y-6 p-4 md:p-8">
      <div>
        <h1 className="text-2xl font-semibold">Panel de trabajo</h1>
        <p className="text-sm text-muted-foreground">
          Estado operativo en tiempo real.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map(([label, value]) => (
          <Card key={label}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {label}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold">{value}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Cola activa</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Orden</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Equipo</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Prioridad</TableHead>
                <TableHead>Días laborables sin cambio</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {queue.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>
                    <Link
                      href={`/orders/${order.id}`}
                      className="font-medium hover:underline"
                    >
                      {formatOrderNumber(order.number)}
                    </Link>
                  </TableCell>
                  <TableCell>{order.client.name}</TableCell>
                  <TableCell>
                    {order.brand} {order.model}
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={order.status as OrderStatus} />
                  </TableCell>
                  <TableCell>
                    <PriorityBadge priority={order.priority as Priority} />
                  </TableCell>
                  <TableCell
                    className={
                      isOrderOverdue(order.updatedAt)
                        ? "font-semibold text-destructive"
                        : ""
                    }
                  >
                    {businessDaysBetween(order.updatedAt, new Date())}
                  </TableCell>
                </TableRow>
              ))}
              {queue.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    No hay órdenes activas.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
