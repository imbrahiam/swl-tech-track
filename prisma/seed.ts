import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { copyObjectIfMissing } from "@/lib/storage"

const PASSWORD = process.env.SEED_DEFAULT_PASSWORD || "TechTrack2026!"
const USERS = [
  ["Brahiam Montero", "brahiam@techtrack.dev", "ADMIN"],
  ["Diomarys Abad", "diomarys@techtrack.dev", "ADMIN"],
  ["Lía Fernández", "lia@techtrack.dev", "ADMIN"],
  ["Darvin Aquino", "darvin@techtrack.dev", "ADMIN"],
  ["Carlos Veras", "carlos@techtrack.dev", "ADMIN"],
  ["Thanney García", "thanney@techtrack.dev", "ADMIN"],
  ["Reynaldo Peña", "reynaldo@techtrack.dev", "ADMIN"],
  ["Técnico Demo", "tecnico@techtrack.dev", "TECNICO"],
] as const

const CLIENTS = [
  {
    id: "seed-client-ana",
    name: "Ana Rodríguez",
    cedula: "001-1845632-4",
    phone: "809-555-0101",
  },
  {
    id: "seed-client-luis",
    name: "Luis Martínez",
    cedula: "001-2039485-7",
    phone: "829-555-0102",
  },
  {
    id: "seed-client-carla",
    name: "Carla Méndez",
    cedula: "402-1176342-8",
    phone: "849-555-0103",
  },
  {
    id: "seed-client-jose",
    name: "José Ramírez",
    cedula: "031-0392847-1",
    phone: "809-555-0104",
  },
]

const ORDERS = [
  {
    id: "seed-order-iphone",
    clientId: "seed-client-ana",
    brand: "Apple",
    model: "iPhone 15 Pro",
    serial: "F2LX91TT",
    faultDesc: "La pantalla no responde al tacto en la zona superior.",
    extras: "Funda transparente",
    status: "RECIBIDO",
    priority: "ALTA",
  },
  {
    id: "seed-order-samsung",
    clientId: "seed-client-luis",
    brand: "Samsung",
    model: "Galaxy S24 Ultra",
    serial: "R58W31A2",
    faultDesc: "El conector USB-C carga únicamente al mover el cable.",
    extras: "Cable USB-C",
    status: "EN_DIAGNOSTICO",
    priority: "MEDIA",
  },
  {
    id: "seed-order-macbook",
    clientId: "seed-client-carla",
    brand: "Apple",
    model: "MacBook Air M2",
    serial: "C02Y81ML",
    faultDesc: "No enciende después de un apagado inesperado.",
    extras: "Cargador original",
    status: "ESPERANDO_APROBACION",
    priority: "ALTA",
  },
  {
    id: "seed-order-lenovo",
    clientId: "seed-client-jose",
    brand: "Lenovo",
    model: "ThinkPad E14",
    serial: "PF4K912",
    faultDesc: "El ventilador hace ruido y el equipo se apaga por temperatura.",
    extras: null,
    status: "EN_REPARACION",
    priority: "MEDIA",
  },
  {
    id: "seed-order-ipad",
    clientId: "seed-client-ana",
    brand: "Apple",
    model: "iPad Air",
    serial: "DMQX81PL",
    faultDesc: "El equipo está listo después del reemplazo de batería.",
    extras: "Estuche azul",
    status: "LISTO",
    priority: "BAJA",
  },
  {
    id: "seed-order-dell",
    clientId: "seed-client-luis",
    brand: "Dell",
    model: "Inspiron 15",
    serial: "D8N2K11",
    faultDesc: "Mantenimiento completado y equipo entregado al cliente.",
    extras: "Cargador",
    status: "ENTREGADO",
    priority: "BAJA",
  },
] as const

async function seedUsers() {
  for (const [name, email, role] of USERS) {
    const existing = await prisma.user.findUnique({ where: { email } })
    let userId = existing?.id
    if (!userId) {
      const result = await auth.api.signUpEmail({
        body: { name, email, password: PASSWORD },
      })
      userId = result.user.id
    }
    await prisma.user.update({
      where: { id: userId },
      data: { name, role, banned: false },
    })
  }
}

async function seedDemoData() {
  const technician = await prisma.user.findUniqueOrThrow({
    where: { email: "tecnico@techtrack.dev" },
  })
  for (const client of CLIENTS)
    await prisma.client.upsert({
      where: { cedula: client.cedula },
      update: { name: client.name, phone: client.phone },
      create: client,
    })
  const sourceKeys = (process.env.SEED_IMAGE_SOURCE_KEYS || "")
    .split(",")
    .map((key) => key.trim())
    .filter(Boolean)
  for (const [index, data] of ORDERS.entries()) {
    const imageKey = sourceKeys[index]
      ? `techtrack/seed/products/${String(index + 1).padStart(2, "0")}`
      : null
    if (sourceKeys[index] && imageKey)
      await copyObjectIfMissing(
        process.env.SEED_IMAGE_SOURCE_BUCKET || "mds-web",
        sourceKeys[index],
        imageKey
      )
    const order = await prisma.order.upsert({
      where: { id: data.id },
      update: {
        ...data,
        number: 1001 + index,
        technicianId: technician.id,
        imageKey,
      },
      create: {
        ...data,
        number: 1001 + index,
        technicianId: technician.id,
        imageKey,
      },
    })
    await prisma.orderLog.upsert({
      where: { id: `seed-log-${data.id}` },
      update: { newStatus: data.status },
      create: {
        id: `seed-log-${data.id}`,
        orderId: order.id,
        userId: technician.id,
        newStatus: data.status,
        comment: "Dato de demostración",
      },
    })
  }
}

async function main() {
  await seedUsers()
  await seedDemoData()
  console.log(
    `Seed listo: ${USERS.length} usuarios, ${CLIENTS.length} clientes y ${ORDERS.length} órdenes.`
  )
}

main()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
