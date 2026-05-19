import Link from "next/link"
import { ArrowLeft, Clock, User, Wrench } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"

export const metadata = { title: "Detalle de orden — TechTrack MD" }

// TODO (O-04 / CC): Replace with real data
// prisma.order.findUniqueOrThrow({ where: { id }, include: { client: true, technician: true, logs: { include: { user: true } } } })
export default function OrderDetailPage({ params }: { params: { id: string } }) {
  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="-ml-1" />
        <Button variant="ghost" size="sm" asChild className="-ml-2">
          <Link href="/orders">
            <ArrowLeft className="h-4 w-4" />
            Órdenes
          </Link>
        </Button>
        <h1 className="text-xl font-semibold">
          Orden <span className="font-mono text-muted-foreground">#{params.id}</span>
        </h1>
        <Badge variant="secondary" className="ml-2">
          RECIBIDO
        </Badge>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <User className="h-4 w-4" /> Cliente y equipo
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* TODO (O-04 / CC): Replace skeletons with real order data */}
              <dl className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
                {[
                  "Nombre", "Teléfono",
                  "Cédula", "Fecha ingreso",
                  "Marca", "Modelo",
                  "Serie", "Técnico",
                ].map((label) => (
                  <div key={label}>
                    <dt className="text-xs text-muted-foreground">{label}</dt>
                    <Skeleton className="mt-1 h-4 w-32" />
                  </div>
                ))}
              </dl>
              <Separator className="my-4" />
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Descripción de la falla</p>
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Clock className="h-4 w-4" /> Historial de estados
              </CardTitle>
              <CardDescription>Registro de todos los cambios — RF-16</CardDescription>
            </CardHeader>
            <CardContent>
              {/* TODO (O-04 / CC): Map order.logs to timeline entries */}
              <div className="space-y-3">
                {Array.from({ length: 2 }).map((_, i) => (
                  <div key={i} className="flex gap-3 text-sm">
                    <Skeleton className="mt-0.5 h-4 w-24 shrink-0" />
                    <Skeleton className="h-4 flex-1" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Wrench className="h-4 w-4" /> Acciones
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {/* TODO (O-05 / DA): Status update — import canTransition from @/lib/order-transitions */}
              <div className="rounded border border-dashed p-3 text-xs text-muted-foreground">
                <Badge variant="outline" className="mb-2">Pendiente</Badge>
                <p>Tarea O-05 — Actualizar estado con validación de transición</p>
              </div>

              {/* TODO (O-07 / CC): Priority selector — RF-09 */}
              <div className="rounded border border-dashed p-3 text-xs text-muted-foreground">
                <Badge variant="outline" className="mb-2">Pendiente</Badge>
                <p>Tarea O-07 — Asignar prioridad (Alta / Media / Baja)</p>
              </div>

              {/* TODO (P-02 / CC): Print receipt — RF-06 */}
              <Button variant="outline" className="w-full" disabled>
                Imprimir comprobante
              </Button>
              <p className="text-center text-xs text-muted-foreground">
                Tarea P-02 — Generar PDF del comprobante
              </p>

              <Separator />

              {/* TODO (O-08 / DA): Close order confirm dialog — RF-05 */}
              <Button variant="destructive" className="w-full" disabled>
                Cerrar orden
              </Button>
              <p className="text-center text-xs text-muted-foreground">
                Tarea O-08 — Diálogo de confirmación de cierre
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
