import { redirect } from "next/navigation"

// Root redirects to dashboard. proxy.ts handles the session gate.
export default function RootPage() {
  redirect("/dashboard")
}
