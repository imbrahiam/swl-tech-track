import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { formatDate, formatOrderNumber } from "@/lib/format"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

function dateAt(value: string | undefined, end = false) {
  const date = value ? new Date(`${value}T00:00:00`) : new Date()
  if (!value) date.setHours(0, 0, 0, 0)
  if (end) date.setHours(23, 59, 59, 999)
  return date
}

export default async function ReportsPage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string; to?: string }>
}) {
  const { from, to } = await searchParams
  const start = dateAt(from),
    end = dateAt(to, true)
  const [orders, logs] = await Promise.all([
    prisma.order.findMany({
      where: { createdAt: { gte: start, lte: end } },
      include: { client: true, technician: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.orderLog.findMany({
      where: { createdAt: { gte: start, lte: end } },
      include: { order: { include: { client: true } }, user: true },
      orderBy: { createdAt: "desc" },
    }),
  ])
  const query = new URLSearchParams({
    ...(from ? { from } : {}),
    ...(to ? { to } : {}),
  }).toString()
  return (
    <div className="space-y-6 p-4 md:p-8">
      <div>
        <h1 className="text-2xl font-semibold">Reportes</h1>
        <p className="text-sm text-muted-foreground">
          Actividad por rango de fechas.
        </p>
      </div>
      <form className="flex flex-wrap items-end gap-3">
        <div>
          <label className="text-sm">Desde</label>
          <Input type="date" name="from" defaultValue={from} />
        </div>
        <div>
          <label className="text-sm">Hasta</label>
          <Input type="date" name="to" defaultValue={to} />
        </div>
        <Button>Consultar</Button>
        <Button asChild variant="outline">
          <a href={`/api/reports/export?${query}`}>Exportar CSV</a>
        </Button>
      </form>
      <Card>
        <CardHeader>
          <CardTitle>Órdenes ingresadas ({orders.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Orden</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Equipo</TableHead>
                <TableHead>Técnico</TableHead>
                <TableHead>Fecha</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>
                    <Link href={`/orders/${order.id}`}>
                      {formatOrderNumber(order.number)}
                    </Link>
                  </TableCell>
                  <TableCell>{order.client.name}</TableCell>
                  <TableCell>
                    {order.brand} {order.model}
                  </TableCell>
                  <TableCell>{order.technician.name}</TableCell>
                  <TableCell>{formatDate(order.createdAt)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Cambios de estado ({logs.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Orden</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Usuario</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Fecha</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell>{formatOrderNumber(log.order.number)}</TableCell>
                  <TableCell>{log.order.client.name}</TableCell>
                  <TableCell>{log.user.name}</TableCell>
                  <TableCell>{log.newStatus}</TableCell>
                  <TableCell>{formatDate(log.createdAt)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
