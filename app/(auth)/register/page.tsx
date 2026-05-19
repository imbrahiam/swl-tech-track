import Link from "next/link"
import { RegisterForm } from "./form"

export const metadata = { title: "Registro — TechTrack MD" }

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="space-y-1 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">TechTrack MD</h1>
          <p className="text-sm text-muted-foreground">Crear cuenta nueva</p>
        </div>

        <RegisterForm />

        <p className="text-center text-sm text-muted-foreground">
          ¿Ya tienes cuenta?{" "}
          <Link href="/login" className="underline underline-offset-4 hover:text-foreground">
            Inicia sesión
          </Link>
        </p>
      </div>
    </div>
  )
}
