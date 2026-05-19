import { SidebarTrigger } from "@/components/ui/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { UserPlus } from "lucide-react"

export const metadata = { title: "Usuarios — TechTrack MD" }

export default function UsersPage() {
  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <SidebarTrigger className="-ml-1" />
          <h1 className="text-xl font-semibold">Usuarios</h1>
          <Badge variant="secondary" className="ml-1">Solo Admin</Badge>
        </div>
        {/* TODO (A-04 / DA): Trigger invite user dialog */}
        <Button size="sm" disabled>
          <UserPlus className="h-4 w-4" />
          Invitar usuario
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Gestión de usuarios</CardTitle>
          <CardDescription>
            Administra roles y acceso del equipo — RF-14, RF-15
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* TODO (A-04 / DA): prisma.user.findMany() in a Server Component, allow role change + deactivation */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 rounded border border-dashed p-3 text-sm text-muted-foreground">
              <Badge variant="outline">Pendiente</Badge>
              <span>Tarea A-04 — Lista de usuarios con cambio de rol y desactivación</span>
            </div>

            <div className="grid grid-cols-4 gap-3 border-b pb-2 text-xs font-medium text-muted-foreground">
              <span>Nombre</span>
              <span>Correo</span>
              <span>Rol</span>
              <span>Acciones</span>
            </div>

            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="grid grid-cols-4 items-center gap-3">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-4 w-36" />
                <Skeleton className="h-5 w-16 rounded-full" />
                <Skeleton className="h-7 w-20 rounded" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
