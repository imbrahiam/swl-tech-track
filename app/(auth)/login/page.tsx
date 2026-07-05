import Link from "next/link"
import { LoginForm } from "./form"

export const metadata = { title: "Iniciar sesión — TechTrack" }

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="space-y-1 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">TechTrack</h1>
          <p className="text-sm text-muted-foreground">
            Sistema de gestión de órdenes de servicio
          </p>
        </div>

        <LoginForm />

        <p className="text-center text-sm text-muted-foreground">
          ¿No tienes cuenta?{" "}
          <Link
            href="/register"
            className="underline underline-offset-4 hover:text-foreground"
          >
            Regístrate
          </Link>
        </p>
      </div>
    </div>
  )
}
