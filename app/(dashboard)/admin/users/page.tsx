import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/session"
import { formatDate } from "@/lib/format"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { updateUser } from "./actions"

export const metadata = { title: "Usuarios — TechTrack" }
export default async function UsersPage() {
  const session = await requireAdmin()
  const users = await prisma.user.findMany({ orderBy: { createdAt: "asc" } })
  return (
    <div className="space-y-6 p-4 md:p-8">
      <div>
        <h1 className="text-2xl font-semibold">Usuarios</h1>
        <p className="text-sm text-muted-foreground">
          Roles y acceso al sistema.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>{users.length} usuarios</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Correo</TableHead>
                <TableHead>Rol</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Registro</TableHead>
                <TableHead>Acción</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{user.role}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={user.banned ? "destructive" : "secondary"}>
                      {user.banned ? "Desactivado" : "Activo"}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatDate(user.createdAt)}</TableCell>
                  <TableCell>
                    <form action={updateUser} className="flex gap-2">
                      <input type="hidden" name="userId" value={user.id} />
                      <input
                        type="hidden"
                        name="banned"
                        value={user.banned ? "false" : "true"}
                      />
                      <select
                        name="role"
                        defaultValue={user.role}
                        className="h-8 rounded-md border bg-background px-2 text-xs"
                      >
                        <option value="ADMIN">Admin</option>
                        <option value="TECNICO">Técnico</option>
                      </select>
                      <Button
                        size="sm"
                        variant={user.banned ? "secondary" : "outline"}
                        disabled={user.id === session.user.id}
                      >
                        {user.banned ? "Reactivar" : "Desactivar"}
                      </Button>
                    </form>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
