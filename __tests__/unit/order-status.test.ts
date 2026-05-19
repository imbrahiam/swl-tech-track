/**
 * Unit tests for order status transition logic.
 *
 * Tests encode WHY behavior matters (business rules), not just WHAT it does.
 * These are the canonical tests for the transition rules — keep them passing.
 */

import { describe, it, expect } from "vitest"
import { OrderStatus } from "@/generated/prisma/client"
import {
  canTransition,
  isFinalStatus,
  getNextStatuses,
} from "@/lib/order-transitions"

describe("Order status transitions", () => {
  it("allows RECIBIDO → EN_DIAGNOSTICO (first step in workflow)", () => {
    expect(canTransition("RECIBIDO", "EN_DIAGNOSTICO")).toBe(true)
  })

  it("blocks RECIBIDO → LISTO (skipping steps would lose audit trail)", () => {
    expect(canTransition("RECIBIDO", "LISTO")).toBe(false)
  })

  it("allows EN_DIAGNOSTICO → SIN_REPARACION (irreparable device)", () => {
    expect(canTransition("EN_DIAGNOSTICO", "SIN_REPARACION")).toBe(true)
  })

  it("blocks all transitions from ENTREGADO (closed order)", () => {
    const allStatuses = Object.values(OrderStatus)
    for (const status of allStatuses) {
      expect(canTransition("ENTREGADO", status)).toBe(false)
    }
  })

  it("blocks all transitions from SIN_REPARACION (closed order)", () => {
    const allStatuses = Object.values(OrderStatus)
    for (const status of allStatuses) {
      expect(canTransition("SIN_REPARACION", status)).toBe(false)
    }
  })

  it("identifies ENTREGADO and SIN_REPARACION as final statuses (RF-05)", () => {
    expect(isFinalStatus("ENTREGADO")).toBe(true)
    expect(isFinalStatus("SIN_REPARACION")).toBe(true)
    expect(isFinalStatus("LISTO")).toBe(false)
    expect(isFinalStatus("RECIBIDO")).toBe(false)
  })

  it("covers complete happy path: RECIBIDO → ENTREGADO", () => {
    const happyPath: OrderStatus[] = [
      "RECIBIDO",
      "EN_DIAGNOSTICO",
      "ESPERANDO_APROBACION",
      "EN_REPARACION",
      "LISTO",
      "ENTREGADO",
    ]
    for (let i = 0; i < happyPath.length - 1; i++) {
      expect(canTransition(happyPath[i], happyPath[i + 1])).toBe(true)
    }
  })

  it("getNextStatuses returns correct options for EN_DIAGNOSTICO", () => {
    const next = getNextStatuses("EN_DIAGNOSTICO")
    expect(next).toContain("ESPERANDO_APROBACION")
    expect(next).toContain("SIN_REPARACION")
    expect(next).not.toContain("ENTREGADO")
  })

  it("getNextStatuses returns empty array for final statuses", () => {
    expect(getNextStatuses("ENTREGADO")).toHaveLength(0)
    expect(getNextStatuses("SIN_REPARACION")).toHaveLength(0)
  })
})
