"use server"

import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { requireSession } from "@/lib/session"
import { putObject } from "@/lib/storage"

function text(data: FormData, key: string) {
  return String(data.get(key) ?? "").trim()
}

export async function createOrder(data: FormData) {
  const session = await requireSession()
  const clientId = text(data, "clientId")
  const name = text(data, "name")
  const cedula = text(data, "cedula")
  const phone = text(data, "phone")
  const brand = text(data, "brand")
  const model = text(data, "model")
  const faultDesc = text(data, "faultDesc")

  if (
    (!clientId && (!name || !cedula || !phone)) ||
    !brand ||
    !model ||
    faultDesc.length < 10
  ) {
    throw new Error(
      "Completa los campos requeridos; la falla debe tener al menos 10 caracteres."
    )
  }

  const order = await prisma.$transaction(async (tx) => {
    const latest = await tx.order.aggregate({ _max: { number: true } })
    const client = clientId
      ? await tx.client.findUniqueOrThrow({ where: { id: clientId } })
      : await tx.client.upsert({
          where: { cedula },
          update: { name, phone },
          create: { name, cedula, phone },
        })
    const created = await tx.order.create({
      data: {
        number: (latest._max.number ?? 1000) + 1,
        clientId: client.id,
        brand,
        model,
        serial: text(data, "serial") || null,
        faultDesc,
        extras: text(data, "extras") || null,
        priority: (text(data, "priority") || "MEDIA") as
          | "ALTA"
          | "MEDIA"
          | "BAJA",
        technicianId: session.user.id,
      },
    })
    await tx.orderLog.create({
      data: {
        orderId: created.id,
        userId: session.user.id,
        newStatus: "RECIBIDO",
        comment: "Orden recibida",
      },
    })
    return created
  })

  const image = data.get("image")
  if (image instanceof File && image.size > 0) {
    if (!image.type.startsWith("image/") || image.size > 10 * 1024 * 1024) {
      throw new Error(
        "La imagen debe ser JPG, PNG o WebP y pesar máximo 10 MB."
      )
    }
    const imageKey = `techtrack/orders/${order.id}/equipment`
    await putObject(
      imageKey,
      new Uint8Array(await image.arrayBuffer()),
      image.type
    )
    await prisma.order.update({ where: { id: order.id }, data: { imageKey } })
  }
  redirect(`/orders/${order.id}`)
}
