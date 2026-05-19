import { SidebarTrigger } from "@/components/ui/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"

export const metadata = { title: "Clientes — TechTrack MD" }

export default function ClientsPage() {
  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="-ml-1" />
        <h1 className="text-xl font-semibold">Clientes</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Historial de clientes</CardTitle>
          <CardDescription>
            Todos los clientes registrados y sus órdenes — RF-12
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* TODO (D-05 / DA): List clients with order count, link to /clients/[id] */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 rounded border border-dashed p-3 text-sm text-muted-foreground">
              <Badge variant="outline">Pendiente</Badge>
              <span>Tarea D-05 — Lista de clientes con conteo de órdenes históricas</span>
            </div>

            <div className="grid grid-cols-4 gap-3 border-b pb-2 text-xs font-medium text-muted-foreground">
              <span>Nombre</span>
              <span>Cédula</span>
              <span>Teléfono</span>
              <span>Total órdenes</span>
            </div>

            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="grid grid-cols-4 gap-3">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-8" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
