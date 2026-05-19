import { cache } from "react"
import { headers } from "next/headers"
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"

/**
 * Returns the current session from a Server Component or Route Handler.
 * Cached per-request via React cache() — safe to call multiple times.
 */
export const getServerSession = cache(async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  })
  return session
})

/**
 * Returns the current user or redirects to /login.
 * Use at the top of any protected Server Component or layout.
 *
 * @example
 * const user = await requireSession()
 */
export async function requireSession() {
  const session = await getServerSession()
  if (!session) {
    redirect("/login")
  }
  return session
}

/**
 * Requires ADMIN role. Redirects to /dashboard if user is not admin.
 */
export async function requireAdmin() {
  const session = await requireSession()
  if (session.user.role !== "ADMIN") {
    redirect("/dashboard")
  }
  return session
}
