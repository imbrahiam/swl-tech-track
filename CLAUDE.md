# CLAUDE.md — TechTrack MD

Rules apply to every task. No exceptions unless explicitly overridden in writing.
**Bias: caution over speed.** Use judgment on trivial tasks; ask on anything ambiguous.

---

## Rules

### Rule 1 — Think Before Coding
State assumptions explicitly. If uncertain, ask rather than guess.
Present multiple interpretations when ambiguity exists.
Push back when a simpler approach exists.
Stop when confused. Name what's unclear.

### Rule 2 — Simplicity First
Minimum code that solves the problem. Nothing speculative.
No features beyond what was asked. No abstractions for single-use code.
Test: would a senior engineer say this is overcomplicated? If yes, simplify.

### Rule 3 — Surgical Changes
Touch only what you must. Clean up only your own mess.
Don't "improve" adjacent code, comments, or formatting unless asked.
Don't refactor what isn't broken. Match existing style.

### Rule 4 — Read Before You Write
Before adding code, read the file you're editing + its immediate callers.
Check `lib/` for existing utilities before writing a new one.
"Looks orthogonal" is dangerous. If unsure why code is structured a way, ask.

### Rule 5 — Goal-Driven Execution
Define success criteria before starting. Loop until verified.
Don't just follow steps — define success and iterate toward it.

### Rule 6 — Surface Conflicts, Don't Average Them
If two patterns contradict, pick one (more recent / closer to this file).
Explain why. Flag the other for cleanup.
Don't blend conflicting patterns.

### Rule 7 — Tests Verify Intent, Not Just Behavior
Tests must encode WHY behavior matters (business rules), not just WHAT it does.
A test that passes when business logic breaks is wrong.

### Rule 8 — Checkpoint After Every Significant Step
Summarize what was done, what's verified, what's left.
Don't continue from a state you can't describe back.

### Rule 9 — Match Existing Conventions
Conformance > taste inside this codebase.
If you think a convention is harmful, surface it. Don't fork silently.

### Rule 10 — Fail Loud
"Completed" is wrong if anything was skipped silently.
"Tests pass" is wrong if any were skipped.
Surface uncertainty — don't hide it.

### Rule 11 — Verify Before Commit / PR
Before marking any task done:
- [ ] `bun run typecheck` passes with zero errors
- [ ] `bun run lint` passes with zero errors
- [ ] Relevant tests pass (`bun test` or `bunx vitest run`)
- [ ] Feature works end-to-end in browser (if UI)
- [ ] No `.env` values hardcoded anywhere
- [ ] No `use client` added unnecessarily (see data fetching rules)

### Rule 12 — Token Budgets
Per-task: 4,000 tokens. Per-session: 30,000 tokens.
If approaching limit, summarize and start fresh. Surface the breach.

---

## Project Overview

**TechTrack MD** — digital service order management system for Martinez Devices SRL.
Replaces paper-based repair intake forms. Technicians create orders, track equipment status, print receipts.

**Roles:** `ADMIN` (full access) · `TECNICO` (operational access — create/update orders, no user management)

**Status flow (strictly enforced — no shortcuts):**
```
RECIBIDO → EN_DIAGNOSTICO → ESPERANDO_APROBACION → EN_REPARACION → LISTO → ENTREGADO
                          ↘                       ↘
                           SIN_REPARACION (final)   SIN_REPARACION (final)
```
Valid transitions live in `lib/order-transitions.ts`. Never bypass them.

---

## Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Framework | Next.js (App Router) | 16.x |
| Runtime | React | 19.x |
| Auth | Better Auth | 1.x |
| ORM | Prisma | 7.x |
| DB | PostgreSQL 16 (VPS, bhd_postgres) | 16 |
| DB Adapter | `@prisma/adapter-pg` | 7.x |
| UI | shadcn/ui + Tailwind CSS | v4 |
| Storage | MinIO (S3-compatible, shared VPS) | — |
| Image CDN | imgproxy | — |
| Package manager | **bun only** — never npm or yarn | — |
| Testing | Vitest | 4.x |

---

## Project Structure

```
tech-track/
├── app/
│   ├── (auth)/              # Login, register — public routes
│   │   ├── login/
│   │   └── register/
│   ├── (dashboard)/         # Protected layout — requires session
│   │   ├── layout.tsx       # Calls requireSession() — single protection point
│   │   ├── dashboard/       # Main dashboard, order queue
│   │   ├── orders/          # Order list, detail, new order
│   │   │   ├── page.tsx     # Order list (Server Component)
│   │   │   ├── new/         # New order form
│   │   │   └── [id]/        # Order detail + status updates
│   │   ├── clients/         # Client history
│   │   └── admin/           # ADMIN only: user management, reports
│   │       └── layout.tsx   # Calls requireAdmin()
│   └── api/
│       ├── auth/[...all]/   # Better Auth handler — do not touch
│       └── upload/          # Presigned URL endpoint for file uploads
├── components/
│   └── ui/                  # shadcn/ui components — copy, don't abstract
├── lib/
│   ├── auth.ts              # Better Auth server config — do not import in client
│   ├── auth-client.ts       # Better Auth React client — client components only
│   ├── prisma.ts            # Prisma singleton — import this, never new PrismaClient()
│   ├── session.ts           # getServerSession(), requireSession(), requireAdmin()
│   ├── storage.ts           # MinIO helpers: getUploadUrl, getImageUrl, deleteObject
│   └── utils.ts             # cn() and shared helpers
├── generated/
│   └── prisma/              # Auto-generated — NEVER edit manually
├── prisma/
│   ├── schema.prisma        # Source of truth for data model
│   ├── migrations/          # Auto-generated migration history
│   └── seed.ts              # Team user seeding
├── __tests__/
│   ├── unit/                # Pure logic tests — no DB, fast
│   └── integration/         # Tests that hit the real dev DB (rare, marked separately)
├── proxy.ts                 # Next.js 16 middleware — route auth guard (cookie check)
├── vitest.config.ts
├── prisma.config.ts         # Prisma 7 config — DB URL lives here, not in schema
├── .env                     # Local env — never commit
└── .env.example             # Template — commit this, not .env
```

---

## Data Fetching Rules

**Default to Server Components + Prisma direct.** This is the happy path.

```tsx
// ✅ Correct — Server Component reading DB directly
// app/(dashboard)/orders/page.tsx
import { prisma } from "@/lib/prisma"
import { requireSession } from "@/lib/session"

export default async function OrdenesPage() {
  await requireSession() // protect + get user if needed
  const orders = await prisma.order.findMany({
    include: { client: true, technician: true },
    orderBy: { createdAt: "desc" },
  })
  return <OrderList orders={orders} />
}
```

```tsx
// ✅ Correct — Server Action for mutations (forms)
// app/(dashboard)/orders/new/actions.ts
"use server"
import { prisma } from "@/lib/prisma"
import { requireSession } from "@/lib/session"
import { revalidatePath } from "next/cache"

export async function createOrder(formData: FormData) {
  const session = await requireSession()
  // ... validate + create
  await prisma.order.create({ data: { ... } })
  revalidatePath("/orders") // data is fresh — no client state needed
}
```

```tsx
// ✅ Correct — Route Handler only when client JS needs to call the API
// (e.g., file upload flow, autocomplete search)
// app/api/upload/route.ts — already implemented
```

```tsx
// ❌ Wrong — don't use fetch() in Server Components to call your own API
// ❌ Wrong — don't use useState + useEffect for data that can be fetched on the server
// ❌ Wrong — don't use SWR / React Query for server-owned data
```

**When to add `"use client"`:**
Only when the component uses browser APIs, event handlers, or React hooks (`useState`, `useEffect`, `useRef`).
Forms with progressive enhancement can stay server-side using Server Actions.

---

## Auth Patterns

### Server Components / Server Actions / Route Handlers

```ts
import { getServerSession, requireSession, requireAdmin } from "@/lib/session"

// Get session (returns null if not logged in)
const session = await getServerSession()

// Require session — redirects to /login if missing
const session = await requireSession()

// Require ADMIN — redirects to /dashboard if not admin
const session = await requireAdmin()
```

### Client Components

```tsx
"use client"
import { useSession, signOut } from "@/lib/auth-client"

export function UserMenu() {
  const { data: session } = useSession()
  return <button onClick={() => signOut()}>Cerrar sesión</button>
}
```

**Never import `@/lib/auth` in a client component.** It contains server secrets.
**Never import `@/lib/auth-client` in a Server Component.** It's for React hooks only.

### Route Protection

- **Middleware (`proxy.ts`):** Fast cookie check — blocks unauthenticated requests before they reach any page. Does NOT check role.
- **Layout (`(dashboard)/layout.tsx`):** Calls `requireSession()` — single point of truth for the dashboard.
- **Admin layout (`admin/layout.tsx`):** Calls `requireAdmin()`.
- **Server Actions:** Always call `requireSession()` or `requireAdmin()` at the top — actions are public API endpoints.

---

## Storage (Files & Images)

```ts
import { getUploadUrl, getImageUrl, deleteObject } from "@/lib/storage"

// 1. Get a presigned upload URL (call from a Route Handler, not client)
const uploadUrl = await getUploadUrl("orders/123/photo.jpg", "image/jpeg")

// 2. Client uploads directly to MinIO using the presigned URL
// PUT uploadUrl with the file binary

// 3. Display image via imgproxy CDN
const displayUrl = getImageUrl("orders/123/photo.jpg", 800, 600)

// 4. Delete when order is archived
await deleteObject("orders/123/photo.jpg")
```

**Key naming convention (MinIO object keys — English):**
- Order attachments: `orders/{orderId}/{filename}`
- Receipts (PDF): `receipts/{orderId}/receipt.pdf`

Upload flow: client → `POST /api/upload` (auth check + presigned URL) → client uploads to MinIO → store key in DB.

---

## UI Conventions

- **UI text in Spanish.** Code (variables, functions, types, comments, commits) in English.
- **Icons:** Use `lucide-react` only. Don't mix icon libraries.
- **No toast/sonner for data mutations.** Use `revalidatePath()` after Server Actions — data is fresh automatically.
  - Show inline error messages in forms. Use `redirect()` after successful mutations.
  - For destructive actions (close order), use a confirm dialog, not a toast.
- **Components:** shadcn/ui in `components/ui/`. Copy them in; they're yours to modify.
- **Color theme:** Follow the existing `globals.css` CSS variables. Don't hardcode colors.
- **Forms:** Use TanStack Form (`@tanstack/react-form-nextjs`) for any form with more than 2 fields or custom validation. Plain HTML form + Server Action is only acceptable for trivial single-action forms (e.g., a single-button confirm).

---

## Forms — TanStack Form

Package: `@tanstack/react-form-nextjs` (v1.x). All form components are Client Components (`"use client"`).

### When to use TanStack Form vs plain HTML form

| Situation | Use |
|-----------|-----|
| Multi-field form (≥ 2 fields), custom validation | **TanStack Form** |
| Real-time field validation, cross-field dependencies | **TanStack Form** |
| Single button / trivial no-validation form | Plain HTML + Server Action |

### Basic pattern

```tsx
"use client"
import { useForm } from "@tanstack/react-form-nextjs"

export function NewOrderForm() {
  const form = useForm({
    defaultValues: {
      clientName: "",
      deviceModel: "",
      issueDescription: "",
    },
    onSubmit: async ({ value }) => {
      // call your Server Action here
      await createOrder(value)
    },
  })

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        e.stopPropagation()
        form.handleSubmit()
      }}
    >
      <form.Field
        name="clientName"
        validators={{
          onChange: ({ value }) =>
            !value ? "El nombre del cliente es requerido" : undefined,
        }}
      >
        {(field) => (
          <div>
            <label htmlFor={field.name}>Cliente</label>
            <input
              id={field.name}
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
            />
            {field.state.meta.isTouched && field.state.meta.errors.length > 0 && (
              <p className="text-sm text-destructive">
                {field.state.meta.errors.join(", ")}
              </p>
            )}
          </div>
        )}
      </form.Field>

      <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
        {([canSubmit, isSubmitting]) => (
          <button type="submit" disabled={!canSubmit}>
            {isSubmitting ? "Guardando..." : "Guardar"}
          </button>
        )}
      </form.Subscribe>
    </form>
  )
}
```

### Validation rules — all error messages in Spanish

```ts
validators={{
  // sync — runs on every change
  onChange: ({ value }) => {
    if (!value) return "Este campo es requerido"
    if (value.length < 3) return "Mínimo 3 caracteres"
    if (value.length > 100) return "Máximo 100 caracteres"
    return undefined // valid
  },
  // async — runs on blur (e.g. check duplicate email)
  onChangeAsync: async ({ value }) => {
    const exists = await checkEmailExists(value)
    return exists ? "Este correo ya está registrado" : undefined
  },
  onChangeAsyncDebounceMs: 500, // debounce async validators
}}
```

### Cross-field validation (form-level)

```ts
const form = useForm({
  defaultValues: { password: "", confirm: "" },
  validators: {
    onChange: ({ value }) => {
      if (value.password !== value.confirm) {
        return { fields: { confirm: "Las contraseñas no coinciden" } }
      }
    },
  },
  ...
})
```

### Showing errors

Always gate on `isTouched` so errors don't flash before the user interacts:

```tsx
{field.state.meta.isTouched && field.state.meta.errors.length > 0 && (
  <p className="text-sm text-destructive mt-1">
    {field.state.meta.errors.join(", ")}
  </p>
)}
```

### Server Action integration

TanStack Form handles client-side state. Call the Server Action inside `onSubmit`. Use `useState` for server/API errors — `setErrorMap` has a narrow type signature that doesn't accept plain strings in v1.x:

```tsx
import { useState } from "react"
import { createOrder } from "./actions" // "use server" file

const [serverError, setServerError] = useState<string | null>(null)

const form = useForm({
  onSubmit: async ({ value }) => {
    setServerError(null)
    const result = await createOrder(value)
    if (result?.error) {
      setServerError(result.error) // surface server error — don't use toast
    }
  },
})
```

Render near the submit button:

```tsx
{serverError && (
  <p className="text-sm text-destructive">{serverError}</p>
)}
```

### Rules (agents must follow)

- ❌ Never use `react-hook-form` — not installed, not approved
- ❌ Never use uncontrolled inputs with `FormData` for validated forms — use TanStack Form
- ✅ Error messages always in Spanish
- ✅ Gate error display on `field.state.meta.isTouched`
- ✅ Disable submit while `isSubmitting` is true
- ✅ Call Server Action from `onSubmit`, not from a `useEffect`
- ✅ Keep the Server Action in a separate `actions.ts` file with `"use server"` at the top

---

## Naming Conventions

Everything is English. Only UI-rendered text and enum constants are in Spanish.

| Thing | Convention | Example |
|-------|-----------|---------|
| **Route paths** | **English** | `/orders`, `/orders/new`, `/clients`, `/admin/users` |
| **File/folder names** | **English kebab-case** | `order-detail.tsx`, `new-order.tsx` |
| **Page components** | English PascalCase + `Page` suffix | `OrdersPage`, `NewOrderPage`, `OrderDetailPage` |
| React components (shared) | English PascalCase | `OrderStatusBadge`, `ClientAutocomplete` |
| Server Actions | English camelCase verb | `createOrder`, `updateOrderStatus` |
| DB models | English PascalCase (Prisma) | `Order`, `Client`, `OrderLog` |
| Variables / functions | English camelCase | `orderStatus`, `fetchOrders` |
| Enum constants | Spanish (defined in schema) | `RECIBIDO`, `EN_DIAGNOSTICO`, `ESPERANDO_APROBACION` |
| Env vars | SCREAMING_SNAKE | `DATABASE_URL` |
| Branches | `feature/<task-id>-short-name` | `feature/O-03-order-list` |
| Commits | English conventional commits | `feat(orders): add status transition validation` |

**UI text and enum constants are the only Spanish in the codebase.**

---

## Database Rules

⚠️ **The dev DB is shared. Data loss affects the entire team.**

**Allowed operations:**
- `bun run db:migrate` — apply new migrations (additive only)
- `bun run db:generate` — regenerate Prisma client
- `prisma db push` — sync schema to DB without migration file (dev only)
- `SELECT`, `INSERT`, `UPDATE` queries via Prisma

**Never do, never suggest:**
- `DROP TABLE`, `TRUNCATE`, `DELETE FROM` on any table
- `bun run db:reset` / `prisma migrate reset` — drops entire DB
- `prisma db push --force-reset`
- Editing or deleting files in `prisma/migrations/`
- Any migration that removes a column or table with data in it

**Schema changes:**
1. Edit `prisma/schema.prisma`
2. Run `bun run db:migrate` — add a descriptive name, e.g. `add-order-notes-field`
3. Commit **both** the schema change and the migration file in the same PR

**Migrations are forward-only.** If a migration was wrong, write a new corrective migration — never edit the old one.
**After pulling main that has new migrations:** run `bun run db:migrate` to apply them locally.

---

## Git / PR Workflow

1. Pull `main` before starting: `git pull origin main`
2. Create branch: `git checkout -b feature/your-task-name`
3. Develop, commit often with descriptive messages (English)
4. Before PR: run the checklist in Rule 11
5. Open PR → assign to Brahiam for review
6. **Never push directly to `main`.** PRs only.
7. One feature per branch. Don't bundle unrelated changes.

**Commit format:**
```
feat(orders): add status transition validation

- Validates against VALID_TRANSITIONS map
- Logs every change to order_log table
- Returns typed error if transition is invalid
```

---

## Scripts Reference

```bash
bun run dev          # Next.js dev server (Turbopack)
bun run build        # Production build
bun run typecheck    # tsc --noEmit (must pass before PR)
bun run lint         # ESLint (must pass before PR)
bun run check        # lint + typecheck together

bun run db:generate  # Regenerate Prisma client after schema change
bun run db:migrate   # Apply pending migrations + generate client
bun run db:push      # Push schema without migration file (dev only, use sparingly)
bun run db:studio    # Prisma Studio GUI
bun run db:seed      # Seed team users into dev DB
bun run db:reset     # Drop + recreate + migrate + seed (destructive — dev only)

bun test             # Run unit tests (bun test runner)
bunx vitest run      # Run unit tests (vitest)
bunx vitest          # Watch mode
bunx vitest --ui     # UI mode
```

---

## Quick Start (New Team Member)

```bash
# 1. Clone + install
git clone <repo-url> tech-track
cd tech-track
bun install

# 2. Set up environment (get .env values from Brahiam)
cp .env.example .env
# Edit .env with provided values — DATABASE_URL already points to shared dev DB

# 3. Generate Prisma client
bun run db:generate

# 4. Apply any pending migrations
bun run db:migrate

# 5. Start dev server
bun run dev
# → http://localhost:3000

# Login with your team account (ask Brahiam for credentials)
# All accounts use password: TechTrack2026! (change after first login)
```

---

## Environment Variables

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string (VPS dev DB) |
| `BETTER_AUTH_SECRET` | Auth encryption key — get from Brahiam |
| `BETTER_AUTH_URL` | App base URL (http://localhost:3000 for dev) |
| `GOOGLE_CLIENT_ID` | Google OAuth — optional for dev, required for prod |
| `GOOGLE_CLIENT_SECRET` | Google OAuth secret |
| `MINIO_ENDPOINT` | MinIO S3 endpoint (s3.genlabs.us) |
| `MINIO_ACCESS_KEY` | MinIO access key |
| `MINIO_SECRET_KEY` | MinIO secret key |
| `MINIO_BUCKET` | MinIO bucket name (techtrack) |
| `MINIO_USE_SSL` | Use HTTPS for MinIO (true in prod) |
| `NEXT_PUBLIC_IMGPROXY_URL` | imgproxy CDN base URL |
| `NEXT_PUBLIC_APP_URL` | App base URL (for auth-client) |

**Never commit `.env`.** It's in `.gitignore`.
**Never hardcode any of these values in code.**

---

## Deployment (Leader Only)

Deployment is handled exclusively by Brahiam. Team members do not have VPS access.

```bash
ssh server
cd /opt/apps/tech-track   # (path TBD when deployed)
git pull origin main
docker compose build --no-cache
docker compose up -d
```

DB migrations run automatically on startup (or manually with `docker compose exec app bun run db:migrate`).

---

## What NOT To Do

- ❌ Don't import `@/lib/auth` in client components
- ❌ Don't use `new PrismaClient()` — import from `@/lib/prisma`
- ❌ Don't add `use client` to fetch-only components
- ❌ Don't use `sonner`/toast for post-mutation feedback — use `revalidatePath` + redirect
- ❌ Don't skip status transition validation — all changes go through the transition map
- ❌ Don't commit `.env`
- ❌ Don't hardcode credentials, IDs, or URLs
- ❌ Don't push to `main` — PRs only
- ❌ Don't edit files in `generated/prisma/`
- ❌ Don't delete or modify existing migration files
- ❌ Don't use npm or yarn — bun only
- ❌ Don't add speculative features — build only what the task requires
