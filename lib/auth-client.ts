import { createAuthClient } from "better-auth/react"
import { adminClient } from "better-auth/client/plugins"

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  plugins: [adminClient()],
})

// Named exports for common operations — use these instead of authClient directly.
// They keep call sites clean and make refactoring easy.
export const {
  signIn,
  signOut,
  signUp,
  useSession,
  getSession,
} = authClient
