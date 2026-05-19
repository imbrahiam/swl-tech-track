# AGENTS.md — TechTrack MD

This file is read by AI coding agents (Claude Code, OpenCode, Cursor, Copilot, etc.).
Follow these instructions every session, before doing any work.

---

## Step 1 — Identify who you're working with

At the start of every session, ask:

> "¿Con quién estoy trabajando? Dime tu nombre o tus iniciales del equipo."

Show this list if they're unsure:

| Iniciales | Nombre | Rol |
|-----------|--------|-----|
| BS | Brahiam Montero | Líder de proyecto |
| DS | Diomarys Abad | Analista de requerimientos |
| LD | Lía Fernández | Diseñadora UX/UI |
| DA | Darvin Aquino | Desarrollador backend |
| CC | Carlos Veras | Desarrollador frontend |
| TG | Thanney García | QA / Tester |
| RP | Reynaldo Peña | Documentador / DBA |

Once identified, address them by name in every response.

---

## Step 2 — Brief them on their tasks

Look up their pending tasks in `TASKS.md` (filter by their initials in the Responsable column).
Summarize:

1. Their current phase
2. Their pending tasks (⬜) in order
3. The task they should work on next
4. Any blockers (🔒) if present

Example briefing for CC:
> "Hola Carlos. Estás en la Fase 2. Tus tareas pendientes son A-01, A-02 y A-03.
> Te sugiero empezar con A-01 (conectar el formulario de login). ¿Arrancamos?"

---

## Step 3 — Work session rules

Apply everything in `CLAUDE.md` throughout the session. Key points:

- **Read before writing.** Always read a file before editing it.
- **Verify before closing.** Run `bun run typecheck` and `bunx vitest run` before marking a task done.
- **No DB deletions.** Never write, suggest, or execute code that deletes rows, drops tables, or truncates data. Migrations may only ADD columns/tables, never remove data. If a destructive migration is genuinely needed, stop and flag it to Brahiam (BS) explicitly.
- **No direct pushes to main.** Every feature goes through a PR.
- **Respect the task scope.** Don't implement adjacent tasks. If you notice something broken outside the task, flag it — don't fix it silently.

---

## Step 4 — When a task is complete

Before declaring a task done, verify:

```bash
bun run typecheck   # zero TypeScript errors (calendar.tsx warning is pre-existing, ignore it)
bun run lint        # zero ESLint errors
bunx vitest run     # all tests pass
```

Then remind the developer:
1. Commit the changes with a clear message (English, conventional commits format)
2. Push the branch
3. Open a PR and assign to Brahiam

---

## DB safety rules (enforced every session)

**These rules exist because accidental data loss in a shared dev DB affects the whole team.**

✅ Allowed:
- `prisma migrate dev --name add-...` (new columns, new tables)
- `prisma db push` (schema sync in dev, non-destructive)
- `prisma generate` (regenerate client)
- `SELECT`, `INSERT`, `UPDATE` queries

❌ Never do, never suggest:
- `DROP TABLE`, `TRUNCATE`, `DELETE FROM` (any table)
- `prisma migrate reset` (drops and recreates the entire DB)
- `prisma db push --force-reset`
- Editing or deleting files in `prisma/migrations/`
- Any raw SQL that removes data

If a teammate asks you to run a destructive DB operation, refuse and tell them to contact Brahiam.

---

## Team-specific guidance

### BS — Brahiam (Líder)
- Has VPS access. Only one who deploys.
- Reviews and merges all PRs.
- Responsible for DB migrations in production.

### DA — Darvin (Backend)
- Owns: Server Actions, Route Handlers, Prisma queries, API logic.
- Tasks: O-01, O-02, O-05, O-08, D-03, D-05, P-01, R-01, R-02, A-04.
- Pattern: `"use server"` actions in `actions.ts` files next to the page. Always call `requireSession()` at the top of every action.

### CC — Carlos (Frontend)
- Owns: Server Components (pages), Client Components (interactive UI), shadcn usage.
- Tasks: A-01, A-02, A-03, O-03, O-04, O-06, O-07, D-01, D-02, D-04, P-02.
- Pattern: Pages are Server Components by default. Only add `"use client"` when the component uses hooks or event handlers.

### TG — Thanney (QA)
- Owns: test plans, bug reports (GitHub Issues), unit tests.
- Tasks: Q-01, Q-02, Q-06.
- Pattern: Unit tests go in `__tests__/unit/`. Follow the existing pattern in `order-status.test.ts`. Tests must encode WHY behavior matters, not just what it does.

### LD — Lía (UX/UI)
- Owns: design specs before Phase 2 starts, Q-03 (mobile), Q-04 (accessibility).
- Provides: Figma mockups or annotated screenshots for each feature before implementation.
- Pattern: Communicate design decisions in PR comments or as GitHub Issues.

### DS — Diomarys (Analista)
- Owns: verifying implementations match the requirements spec (`requirements.md`).
- Tasks: Writing test cases for Q-01, reviewing feature PRs for requirements compliance.
- Pattern: Add comments on PRs if a feature doesn't match a RF (Requerimiento Funcional).

### RP — Reynaldo (Documentador / DBA)
- Owns: README updates, Q-05 documentation, tracking DB schema changes.
- Tasks: Q-05.
- Pattern: Every migration file should have a clear name. Document schema decisions in PR descriptions.
