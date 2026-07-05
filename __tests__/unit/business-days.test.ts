import { describe, expect, it } from "vitest"
import { businessDaysBetween, isOrderOverdue } from "@/lib/business-days"

describe("businessDaysBetween", () => {
  it("cuenta solo días laborables dentro de una semana", () => {
    expect(
      businessDaysBetween(new Date(2026, 6, 6), new Date(2026, 6, 9))
    ).toBe(3)
  })

  it("no cuenta el fin de semana", () => {
    expect(
      businessDaysBetween(new Date(2026, 6, 3), new Date(2026, 6, 6))
    ).toBe(1)
  })

  it("no marca alerta al cumplir exactamente diez días", () => {
    expect(isOrderOverdue(new Date(2026, 5, 22), 10)).toBe(false)
  })

  it("marca alerta después de diez días laborables", () => {
    expect(isOrderOverdue(new Date(2026, 5, 18), 10)).toBe(true)
  })
})
