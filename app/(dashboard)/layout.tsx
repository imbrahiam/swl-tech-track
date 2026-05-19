import { requireSession } from "@/lib/session"
import { NavSidebar } from "@/components/nav-sidebar"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { TooltipProvider } from "@/components/ui/tooltip"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Single protection point for all dashboard routes.
  // Redirects to /login if session is missing.
  const session = await requireSession()

  return (
    <TooltipProvider>
      <SidebarProvider>
        <NavSidebar user={session.user} />
        <SidebarInset>{children}</SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  )
}
