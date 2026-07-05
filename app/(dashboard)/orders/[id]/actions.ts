"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import type { OrderStatus, Priority } from "@/lib/domain"
import { canTransition, isFinalStatus } from "@/lib/order-transitions"
import { prisma } from "@/lib/prisma"
import { requireSession } from "@/lib/session"

export async function updateOrderStatus(data: FormData) {
  const session = await requireSession()
  const orderId = String(data.get("orderId"))
  const newStatus = String(data.get("status")) as OrderStatus
  const order = await prisma.order.findUniqueOrThrow({ where: { id: orderId } })
  if (!canTransition(order.status as OrderStatus, newStatus))
    throw new Error(`Transición inválida: ${order.status} → ${newStatus}`)
  await prisma.$transaction([
    prisma.order.update({
      where: { id: orderId },
      data: { status: newStatus },
    }),
    prisma.orderLog.create({
      data: {
        orderId,
        userId: session.user.id,
        previousStatus: order.status,
        newStatus,
        comment: String(data.get("comment") || "") || null,
      },
    }),
  ])
  revalidatePath(`/orders/${orderId}`)
  revalidatePath("/orders")
  revalidatePath("/dashboard")
}

export async function updateOrderPriority(data: FormData) {
  await requireSession()
  const orderId = String(data.get("orderId"))
  const priority = String(data.get("priority")) as Priority
  if (!["ALTA", "MEDIA", "BAJA"].includes(priority))
    throw new Error("Prioridad inválida")
  await prisma.order.update({ where: { id: orderId }, data: { priority } })
  revalidatePath(`/orders/${orderId}`)
  revalidatePath("/dashboard")
}

export async function updateOrder(data: FormData) {
  await requireSession()
  const orderId = String(data.get("orderId"))
  const order = await prisma.order.findUniqueOrThrow({ where: { id: orderId } })
  if (isFinalStatus(order.status as OrderStatus))
    throw new Error("Una orden finalizada no puede editarse")
  const faultDesc = String(data.get("faultDesc") || "").trim()
  if (faultDesc.length < 10)
    throw new Error("Describe la falla con al menos 10 caracteres")
  await prisma.order.update({
    where: { id: orderId },
    data: {
      brand: String(data.get("brand") || "").trim(),
      model: String(data.get("model") || "").trim(),
      serial: String(data.get("serial") || "").trim() || null,
      faultDesc,
      extras: String(data.get("extras") || "").trim() || null,
    },
  })
  redirect(`/orders/${orderId}`)
}
