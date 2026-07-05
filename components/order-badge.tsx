import type { OrderStatus, Priority } from "@/lib/domain"
import { Badge } from "@/components/ui/badge"
import { priorityLabels, statusLabels } from "@/lib/format"

export function StatusBadge({ status }: { status: OrderStatus }) {
  const variant =
    status === "ENTREGADO"
      ? "default"
      : status === "SIN_REPARACION"
        ? "destructive"
        : "secondary"
  return <Badge variant={variant}>{statusLabels[status]}</Badge>
}

export function PriorityBadge({ priority }: { priority: Priority }) {
  return (
    <Badge variant={priority === "ALTA" ? "destructive" : "outline"}>
      {priorityLabels[priority]}
    </Badge>
  )
}
