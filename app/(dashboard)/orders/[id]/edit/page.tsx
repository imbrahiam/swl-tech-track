import Link from "next/link"
import { notFound, redirect } from "next/navigation"
import { ArrowLeft, Save } from "lucide-react"
import { prisma } from "@/lib/prisma"
import { isFinalStatus } from "@/lib/order-transitions"
import { formatOrderNumber } from "@/lib/format"
import type { OrderStatus } from "@/lib/domain"
import { updateOrder } from "../actions"
import { StatusBadge } from "@/components/order-badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export const metadata = { title: "Editar orden — TechTrack" }

export default async function EditOrderPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const order = await prisma.order.findUnique({ where: { id } })
  if (!order) notFound()
  if (isFinalStatus(order.status as OrderStatus)) redirect(`/orders/${id}`)
  return (
    <div className="mx-auto max-w-3xl space-y-6 p-4 md:p-8">
      <div className="space-y-4">
        <Button asChild variant="ghost" size="sm" className="-ml-2 gap-1">
          <Link href={`/orders/${id}`}>
            <ArrowLeft /> Volver a la orden
          </Link>
        </Button>
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-2xl font-semibold">
            Editar {formatOrderNumber(order.number)}
          </h1>
          <StatusBadge status={order.status as OrderStatus} />
        </div>
      </div>

      <form action={updateOrder} className="space-y-6">
        <input type="hidden" name="orderId" value={id} />

        <Card>
          <CardHeader>
            <CardTitle>Equipo</CardTitle>
            <CardDescription>Datos del equipo recibido.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="brand">Marca</Label>
              <Input id="brand" name="brand" defaultValue={order.brand} required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="model">Modelo</Label>
              <Input id="model" name="model" defaultValue={order.model} required />
            </div>
            <div className="grid gap-2 sm:col-span-2">
              <Label htmlFor="serial">Serie</Label>
              <Input
                id="serial"
                name="serial"
                defaultValue={order.serial ?? ""}
                placeholder="No indicada"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Diagnóstico</CardTitle>
            <CardDescription>Falla reportada y accesorios.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="faultDesc">Falla</Label>
              <Textarea
                id="faultDesc"
                name="faultDesc"
                defaultValue={order.faultDesc}
                minLength={10}
                rows={4}
                required
              />
              <p className="text-xs text-muted-foreground">Mínimo 10 caracteres.</p>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="extras">Accesorios</Label>
              <Input
                id="extras"
                name="extras"
                defaultValue={order.extras ?? ""}
                placeholder="Cargador, funda…"
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button asChild variant="outline">
            <Link href={`/orders/${id}`}>Cancelar</Link>
          </Button>
          <Button type="submit" className="gap-1">
            <Save /> Guardar cambios
          </Button>
        </div>
      </form>
    </div>
  )
}
