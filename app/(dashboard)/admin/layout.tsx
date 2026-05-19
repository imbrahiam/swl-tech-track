import { requireAdmin } from "@/lib/session"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Redirects to /dashboard if user is not ADMIN
  await requireAdmin()
  return <>{children}</>
}
