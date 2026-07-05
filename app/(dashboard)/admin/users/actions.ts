"use server"

import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/session"

export async function updateUser(data: FormData) {
  const session = await requireAdmin()
  const userId = String(data.get("userId"))
  if (userId === session.user.id && data.get("banned") === "true")
    throw new Error("No puedes desactivar tu propia cuenta")
  const role = String(data.get("role"))
  const banned = String(data.get("banned")) === "true"
  if (!["ADMIN", "TECNICO"].includes(role)) throw new Error("Rol inválido")
  await prisma.user.update({
    where: { id: userId },
    data: { role: role as "ADMIN" | "TECNICO", banned },
  })
  revalidatePath("/admin/users")
}
