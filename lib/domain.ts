export const ORDER_STATUSES = [
  "RECIBIDO",
  "EN_DIAGNOSTICO",
  "ESPERANDO_APROBACION",
  "EN_REPARACION",
  "LISTO",
  "ENTREGADO",
  "SIN_REPARACION",
] as const

export const PRIORITIES = ["ALTA", "MEDIA", "BAJA"] as const
export const ROLES = ["ADMIN", "TECNICO"] as const

export type OrderStatus = (typeof ORDER_STATUSES)[number]
export type Priority = (typeof PRIORITIES)[number]
export type Role = (typeof ROLES)[number]

export function isOrderStatus(value: string): value is OrderStatus {
  return ORDER_STATUSES.includes(value as OrderStatus)
}
