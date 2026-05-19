import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { SidebarTrigger } from "@/components/ui/sidebar"

export const metadata = { title: "Nueva orden — TechTrack MD" }

export default function NewOrderPage() {
  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="-ml-1" />
        <Button variant="ghost" size="sm" asChild className="-ml-2">
          <Link href="/orders">
            <ArrowLeft className="h-4 w-4" />
            Volver
          </Link>
        </Button>
        <h1 className="text-xl font-semibold">Nueva orden</h1>
      </div>

      {/* TODO (O-01 / DA): Add client autocomplete component here */}
      <div className="flex items-center gap-2 rounded border border-dashed p-3 text-sm text-muted-foreground">
        <Badge variant="outline">Pendiente</Badge>
        <span>Tarea O-01 — Autocompletado de cliente por cédula/teléfono</span>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Datos del cliente</CardTitle>
            <CardDescription>
              Ingresa la cédula o teléfono para buscar un cliente existente
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cedula">Cédula</Label>
                <Input id="cedula" name="cedula" placeholder="001-0000000-0" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="telefono">Teléfono</Label>
                <Input id="telefono" name="telefono" placeholder="809-000-0000" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="nombre">Nombre completo</Label>
              <Input id="nombre" name="nombre" placeholder="Juan Pérez" required />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Datos del equipo</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="marca">Marca</Label>
                <Input id="marca" name="marca" placeholder="Dell, HP, Apple..." required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="modelo">Modelo</Label>
                <Input id="modelo" name="modelo" placeholder="Latitude 5420" required />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="serie">Número de serie</Label>
              <Input id="serie" name="serie" placeholder="SN1234567" />
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Descripción del servicio</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="falla">Descripción de la falla</Label>
              <Textarea
                id="falla"
                name="falla"
                placeholder="Describe el problema que reporta el cliente..."
                rows={3}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="extras">Extras dejados</Label>
              <Input id="extras" name="extras" placeholder="Cargador, funda, mouse..." />
              <p className="text-xs text-muted-foreground">
                Accesorios que el cliente deja junto al equipo
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end gap-3">
        <Button variant="outline" asChild>
          <Link href="/orders">Cancelar</Link>
        </Button>
        {/* TODO (O-02 / DA): Wire to createOrder Server Action in ./actions.ts */}
        <Button type="submit" disabled>
          Registrar orden
        </Button>
      </div>

      <p className="text-right text-xs text-muted-foreground">
        Tarea O-02 — Conectar formulario a Server Action <code>createOrder</code>
      </p>
    </div>
  )
}
