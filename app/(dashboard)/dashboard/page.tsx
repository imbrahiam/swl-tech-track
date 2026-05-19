import { ClipboardList, Clock, AlertTriangle, CheckCircle2 } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { SidebarTrigger } from "@/components/ui/sidebar"

export const metadata = { title: "Dashboard — TechTrack MD" }

// ── Placeholder stat cards ─────────────────────────────────────────────
// TODO (D-01): Replace with real prisma.order.groupBy() aggregation
const STAT_CARDS = [
  {
    label: "Órdenes activas",
    value: "—",
    icon: ClipboardList,
    description: "En proceso actualmente",
  },
  {
    label: "Ingresadas hoy",
    value: "—",
    icon: Clock,
    description: "Recibidas en el día",
  },
  {
    label: "Con alerta",
    value: "—",
    icon: AlertTriangle,
    description: "+10 días sin cambio",
    variant: "destructive" as const,
  },
  {
    label: "Completadas hoy",
    value: "—",
    icon: CheckCircle2,
    description: "Entregadas o cerradas",
  },
]

export default function PaginaDashboard() {
  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex items-center gap-2">
        <SidebarTrigger className="-ml-1" />
        <h1 className="text-xl font-semibold">Dashboard</h1>
      </div>

      {/* Stat cards — RF-07 */}
      <section>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STAT_CARDS.map((card) => (
            <Card key={card.label}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{card.label}</CardTitle>
                <card.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{card.value}</div>
                <p className="text-xs text-muted-foreground">{card.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Work queue placeholder — RF-08 */}
      <section>
        <Card>
          <CardHeader>
            <CardTitle>Cola de trabajo</CardTitle>
            <CardDescription>
              Órdenes activas ordenadas por prioridad y fecha de ingreso
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* TODO (D-02 / CC): Implement sortable order queue table */}
            <div className="space-y-3">
              <div className="flex items-center gap-3 border border-dashed p-3 text-sm text-muted-foreground">
                <Badge variant="outline">Pendiente</Badge>
                <span>Tarea D-02 — Cola de trabajo con filtros y ordenamiento</span>
              </div>
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3">
                  <Skeleton className="h-4 w-16 rounded" />
                  <Skeleton className="h-4 flex-1 rounded" />
                  <Skeleton className="h-4 w-20 rounded" />
                  <Skeleton className="h-4 w-16 rounded" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}
