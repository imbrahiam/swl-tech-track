import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { createOrder } from "./actions"
import { ClientSearch } from "@/components/client-search"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export const metadata = { title: "Nueva orden — TechTrack" }

export default function NewOrderPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-6 p-4 md:p-8">
      <div className="flex items-center gap-3">
        <Button asChild variant="ghost" size="icon">
          <Link href="/orders">
            <ArrowLeft />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-semibold">Nueva orden</h1>
          <p className="text-sm text-muted-foreground">
            Registra la recepción del equipo.
          </p>
        </div>
      </div>
      <form action={createOrder} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Cliente</CardTitle>
          </CardHeader>
          <CardContent>
            <ClientSearch />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Equipo y servicio</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="brand">Marca *</Label>
              <Input id="brand" name="brand" maxLength={50} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="model">Modelo *</Label>
              <Input id="model" name="model" maxLength={100} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="serial">Número de serie</Label>
              <Input id="serial" name="serial" maxLength={100} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="priority">Prioridad</Label>
              <select
                id="priority"
                name="priority"
                defaultValue="MEDIA"
                className="h-9 w-full rounded-md border bg-background px-3 text-sm"
              >
                <option value="ALTA">Alta</option>
                <option value="MEDIA">Media</option>
                <option value="BAJA">Baja</option>
              </select>
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="faultDesc">Falla reportada *</Label>
              <Textarea
                id="faultDesc"
                name="faultDesc"
                minLength={10}
                maxLength={500}
                required
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="extras">Accesorios incluidos</Label>
              <Input id="extras" name="extras" maxLength={200} />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="image">Foto del equipo</Label>
              <Input
                id="image"
                name="image"
                type="file"
                accept="image/jpeg,image/png,image/webp"
              />
              <p className="text-xs text-muted-foreground">
                Máximo 10 MB. Una nueva carga reemplaza la anterior sin crear
                duplicados.
              </p>
            </div>
          </CardContent>
        </Card>
        <div className="flex justify-end gap-3">
          <Button asChild variant="outline">
            <Link href="/orders">Cancelar</Link>
          </Button>
          <Button type="submit">Crear orden</Button>
        </div>
      </form>
    </div>
  )
}
