import Link from "next/link"
import Image from "next/image"
import { notFound } from "next/navigation"
import { Pencil, Printer } from "lucide-react"
import { getNextStatuses, isFinalStatus } from "@/lib/order-transitions"
import type { OrderStatus, Priority } from "@/lib/domain"
import { prisma } from "@/lib/prisma"
import {
  formatDate,
  formatOrderNumber,
  priorityLabels,
  statusLabels,
} from "@/lib/format"
import { getImageUrl } from "@/lib/storage"
import { PriorityBadge, StatusBadge } from "@/components/order-badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { updateOrderPriority, updateOrderStatus } from "./actions"

export const metadata = { title: "Detalle de orden — TechTrack" }

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      client: true,
      technician: true,
      logs: { include: { user: true }, orderBy: { createdAt: "asc" } },
    },
  })
  if (!order) notFound()
  const status = order.status as OrderStatus
  const priority = order.priority as Priority
  const nextStatuses = getNextStatuses(status)
  return (
    <div className="space-y-6 p-4 md:p-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm text-muted-foreground">Orden de servicio</p>
          <h1 className="text-2xl font-semibold">
            {formatOrderNumber(order.number)}
          </h1>
        </div>
        <div className="flex gap-2">
          {!isFinalStatus(status) && (
            <Button asChild variant="outline">
              <Link href={`/orders/${id}/edit`}>
                <Pencil /> Editar
              </Link>
            </Button>
          )}
          <Button asChild>
            <a href={`/api/orders/${id}/receipt`} target="_blank">
              <Printer /> Comprobante
            </a>
          </Button>
        </div>
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Cliente y equipo</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-sm text-muted-foreground">Cliente</p>
                <Link
                  href={`/clients/${order.clientId}`}
                  className="font-medium hover:underline"
                >
                  {order.client.name}
                </Link>
                <p className="text-sm">
                  {order.client.cedula} · {order.client.phone}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Equipo</p>
                <p className="font-medium">
                  {order.brand} {order.model}
                </p>
                <p className="text-sm">
                  Serie: {order.serial || "No indicada"}
                </p>
              </div>
              <div className="sm:col-span-2">
                <p className="text-sm text-muted-foreground">Falla reportada</p>
                <p>{order.faultDesc}</p>
              </div>
              <div className="sm:col-span-2">
                <p className="text-sm text-muted-foreground">Accesorios</p>
                <p>{order.extras || "Ninguno"}</p>
              </div>
              {order.imageKey && (
                <div className="sm:col-span-2">
                  <Image
                    src={getImageUrl(order.imageKey, 900, 600)}
                    alt={`${order.brand} ${order.model}`}
                    width={900}
                    height={600}
                    unoptimized
                    className="max-h-96 w-full rounded-md bg-muted object-contain"
                  />
                </div>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Historial</CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="space-y-4">
                {order.logs.map((log) => (
                  <li key={log.id} className="border-l-2 pl-4">
                    <p className="font-medium">
                      {log.previousStatus
                        ? `${statusLabels[log.previousStatus as OrderStatus]} → `
                        : ""}
                      {statusLabels[log.newStatus as OrderStatus]}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(log.createdAt)} · {log.user.name}
                    </p>
                    {log.comment && <p className="text-sm">{log.comment}</p>}
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>
        </div>
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Estado</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <StatusBadge status={status} />
              <p className="text-sm">
                Recibida por {order.technician.name}
                <br />
                {formatDate(order.createdAt)}
              </p>
              {nextStatuses.map((status) => (
                <form
                  action={updateOrderStatus}
                  key={status}
                  className="space-y-2"
                >
                  <input type="hidden" name="orderId" value={order.id} />
                  <input type="hidden" name="status" value={status} />
                  <Input name="comment" placeholder="Comentario opcional" />
                  <Button
                    className="w-full"
                    variant={
                      status === "ENTREGADO" || status === "SIN_REPARACION"
                        ? "destructive"
                        : "default"
                    }
                  >
                    Marcar: {statusLabels[status]}
                  </Button>
                </form>
              ))}
              {nextStatuses.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  Esta orden está finalizada.
                </p>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Prioridad</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <PriorityBadge priority={priority} />
              <form action={updateOrderPriority} className="flex gap-2">
                <input type="hidden" name="orderId" value={order.id} />
                <select
                  name="priority"
                  defaultValue={order.priority}
                  className="h-9 flex-1 rounded-md border bg-background px-3 text-sm"
                >
                  {Object.entries(priorityLabels).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
                <Button variant="secondary">Guardar</Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
