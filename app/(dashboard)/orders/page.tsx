import Link from "next/link"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { SidebarTrigger } from "@/components/ui/sidebar"

export const metadata = { title: "Órdenes — TechTrack MD" }

export default function OrdersPage() {
  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <SidebarTrigger className="-ml-1" />
          <h1 className="text-xl font-semibold">Órdenes</h1>
        </div>
        <Button asChild size="sm">
          <Link href="/orders/new">
            <Plus className="h-4 w-4" />
            Nueva orden
          </Link>
        </Button>
      </div>

      {/* Order table — RF-02, RF-08 */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de órdenes</CardTitle>
          <CardDescription>Todas las órdenes activas del taller</CardDescription>
        </CardHeader>
        <CardContent>
          {/* TODO (O-03 / CC): Implement order list with search, filters, status badges */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 rounded border border-dashed p-3 text-sm text-muted-foreground">
              <Badge variant="outline">Pendiente</Badge>
              <span>Tarea O-03 — Tabla de órdenes con búsqueda y filtros por estado/prioridad</span>
            </div>

            <div className="grid grid-cols-5 gap-3 border-b pb-2 text-xs font-medium text-muted-foreground">
              <span># Orden</span>
              <span>Cliente</span>
              <span>Equipo</span>
              <span>Estado</span>
              <span>Prioridad</span>
            </div>

            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="grid grid-cols-5 gap-3">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-5 w-20 rounded-full" />
                <Skeleton className="h-5 w-12 rounded-full" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
