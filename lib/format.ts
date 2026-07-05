import type { OrderStatus, Priority } from "@/lib/domain"

export const statusLabels: Record<OrderStatus, string> = {
  RECIBIDO: "Recibido",
  EN_DIAGNOSTICO: "En diagnóstico",
  ESPERANDO_APROBACION: "Esperando aprobación",
  EN_REPARACION: "En reparación",
  LISTO: "Listo",
  ENTREGADO: "Entregado",
  SIN_REPARACION: "Sin reparación",
}

export const priorityLabels: Record<Priority, string> = {
  ALTA: "Alta",
  MEDIA: "Media",
  BAJA: "Baja",
}

export function formatOrderNumber(number: number) {
  return `#${number.toString().padStart(5, "0")}`
}

export function formatDate(date: Date) {
  return new Intl.DateTimeFormat("es-DO", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date)
}
