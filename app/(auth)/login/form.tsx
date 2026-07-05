"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "@tanstack/react-form-nextjs"
import { signIn } from "@/lib/auth-client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function LoginForm() {
  const router = useRouter()
  const [authError, setAuthError] = useState<string | null>(null)

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    onSubmit: async ({ value }) => {
      setAuthError(null)
      const result = await signIn.email({
        email: value.email,
        password: value.password,
      })
      if (result.error) {
        setAuthError("Correo o contraseña incorrectos.")
        return
      }
      router.push("/dashboard")
      router.refresh()
    },
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Iniciar sesión</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <form
          onSubmit={(e) => {
            e.preventDefault()
            e.stopPropagation()
            form.handleSubmit()
          }}
          className="space-y-4"
        >
          <form.Field
            name="email"
            validators={{
              onBlur: ({ value }) => {
                if (!value) return "El correo es requerido"
                if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
                  return "Ingresa un correo válido"
                return undefined
              },
            }}
          >
            {(field) => (
              <div className="space-y-2">
                <Label htmlFor={field.name}>Correo electrónico</Label>
                <Input
                  id={field.name}
                  type="email"
                  placeholder="nombre@empresa.com"
                  autoComplete="email"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
                {field.state.meta.isTouched &&
                  field.state.meta.errors.length > 0 && (
                    <p className="text-sm text-destructive">
                      {field.state.meta.errors.join(", ")}
                    </p>
                  )}
              </div>
            )}
          </form.Field>

          <form.Field
            name="password"
            validators={{
              onBlur: ({ value }) =>
                !value ? "La contraseña es requerida" : undefined,
            }}
          >
            {(field) => (
              <div className="space-y-2">
                <Label htmlFor={field.name}>Contraseña</Label>
                <Input
                  id={field.name}
                  type="password"
                  autoComplete="current-password"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
                {field.state.meta.isTouched &&
                  field.state.meta.errors.length > 0 && (
                    <p className="text-sm text-destructive">
                      {field.state.meta.errors.join(", ")}
                    </p>
                  )}
              </div>
            )}
          </form.Field>

          {authError && <p className="text-sm text-destructive">{authError}</p>}

          <form.Subscribe
            selector={(s) => [s.canSubmit, s.isSubmitting] as const}
          >
            {([canSubmit, isSubmitting]) => (
              <Button type="submit" className="w-full" disabled={!canSubmit}>
                {isSubmitting ? "Ingresando..." : "Ingresar"}
              </Button>
            )}
          </form.Subscribe>
        </form>

      </CardContent>
    </Card>
  )
}
