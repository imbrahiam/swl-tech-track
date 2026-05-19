import { OrderStatus } from "@/generated/prisma/client"

/**
 * Valid order status transitions — enforces business flow from requirements (Section 7).
 * Every status update must go through canTransition() before applying.
 */
export const VALID_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  RECIBIDO: ["EN_DIAGNOSTICO"],
  EN_DIAGNOSTICO: ["ESPERANDO_APROBACION", "SIN_REPARACION"],
  ESPERANDO_APROBACION: ["EN_REPARACION", "SIN_REPARACION"],
  EN_REPARACION: ["LISTO"],
  LISTO: ["ENTREGADO"],
  ENTREGADO: [],
  SIN_REPARACION: [],
}

export function canTransition(from: OrderStatus, to: OrderStatus): boolean {
  return VALID_TRANSITIONS[from].includes(to)
}

export function isFinalStatus(status: OrderStatus): boolean {
  return status === "ENTREGADO" || status === "SIN_REPARACION"
}

/** Returns the allowed next statuses from a given status. */
export function getNextStatuses(from: OrderStatus): OrderStatus[] {
  return VALID_TRANSITIONS[from]
}
