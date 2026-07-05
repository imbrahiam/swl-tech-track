import { notFound, redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { isFinalStatus } from "@/lib/order-transitions"
import type { OrderStatus } from "@/lib/domain"
import { updateOrder } from "../actions"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

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
    <div className="mx-auto max-w-3xl p-4 md:p-8">
      <Card>
        <CardHeader>
          <CardTitle>Editar orden #{order.number}</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={updateOrder} className="grid gap-4 md:grid-cols-2">
            <input type="hidden" name="orderId" value={id} />
            <div>
              <Label>Marca</Label>
              <Input name="brand" defaultValue={order.brand} required />
            </div>
            <div>
              <Label>Modelo</Label>
              <Input name="model" defaultValue={order.model} required />
            </div>
            <div className="md:col-span-2">
              <Label>Serie</Label>
              <Input name="serial" defaultValue={order.serial ?? ""} />
            </div>
            <div className="md:col-span-2">
              <Label>Falla</Label>
              <Textarea
                name="faultDesc"
                defaultValue={order.faultDesc}
                minLength={10}
                required
              />
            </div>
            <div className="md:col-span-2">
              <Label>Accesorios</Label>
              <Input name="extras" defaultValue={order.extras ?? ""} />
            </div>
            <Button className="md:col-span-2">Guardar cambios</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
