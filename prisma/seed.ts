/**
 * Seed script — populates dev database with team user accounts.
 *
 * Run: bun run db:seed
 *
 * Uses Better Auth's API to create users so passwords are properly hashed
 * and all Better Auth tables (user, account) are populated correctly.
 */

import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

type TeamMember = {
  name: string
  email: string
  password: string
  role: "ADMIN" | "TECNICO"
}

const TEAM: TeamMember[] = [
  // ── Team — all ADMIN so every member can access admin features during dev ──
  { name: "Brahiam Montero", email: "brahiam@techtrack.dev",   password: "TechTrack2026!", role: "ADMIN" },
  { name: "Diomarys Abad",   email: "diomarys@techtrack.dev",  password: "TechTrack2026!", role: "ADMIN" },
  { name: "Lía Fernández",   email: "lia@techtrack.dev",       password: "TechTrack2026!", role: "ADMIN" },
  { name: "Darvin Aquino",   email: "darvin@techtrack.dev",    password: "TechTrack2026!", role: "ADMIN" },
  { name: "Carlos Veras",    email: "carlos@techtrack.dev",    password: "TechTrack2026!", role: "ADMIN" },
  { name: "Thanney García",  email: "thanney@techtrack.dev",   password: "TechTrack2026!", role: "ADMIN" },
  { name: "Reynaldo Peña",   email: "reynaldo@techtrack.dev",  password: "TechTrack2026!", role: "ADMIN" },

  // ── Fake TECNICO accounts — for debugging the TECNICO view ──────────────
  { name: "Técnico Demo 1",  email: "tecnico1@techtrack.dev",  password: "TechTrack2026!", role: "TECNICO" },
  { name: "Técnico Demo 2",  email: "tecnico2@techtrack.dev",  password: "TechTrack2026!", role: "TECNICO" },
]

async function main() {
  console.log("🌱 Seeding team users...")

  for (const member of TEAM) {
    // Check if user already exists
    const existing = await prisma.user.findUnique({
      where: { email: member.email },
    })

    if (existing) {
      console.log(`  ⏭  ${member.email} already exists — skipping`)
      continue
    }

    // Create via Better Auth so password hashing and account table are handled
    const result = await auth.api.signUpEmail({
      body: {
        name: member.name,
        email: member.email,
        password: member.password,
      },
    })

    if (!result.user) {
      console.error(`  ✗  Failed to create ${member.email}`)
      continue
    }

    // Always set role explicitly — don't rely on Better Auth defaults
    await prisma.user.update({
      where: { id: result.user.id },
      data: { role: member.role },
    })

    console.log(`  ✓  Created ${member.role}: ${member.name} (${member.email})`)
  }

  console.log("\n✅ Seed complete.")
  console.log("   Default password for all users: TechTrack2026!")
  console.log("   Change passwords after first login.\n")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
