# TechTrack MD

Sistema de gestión de órdenes de servicio técnico para **Martinez Devices SRL**.
Reemplaza los formularios físicos en papel por un flujo digital completo: recepción, seguimiento y entrega de equipos.

---

## El equipo

| Iniciales | Nombre | Rol |
|-----------|--------|-----|
| **BS** | Brahiam Montero | Líder de proyecto |
| **DS** | Diomarys Abad | Analista de requerimientos |
| **LD** | Lía Fernández | Diseñadora UX/UI |
| **DA** | Darvin Aquino | Desarrollador backend |
| **CC** | Carlos Veras | Desarrollador frontend |
| **TG** | Thanney García | QA / Tester |
| **RP** | Reynaldo Peña | Documentador / DBA |

---

## Stack tecnológico

| Capa | Tecnología |
|------|-----------|
| Framework | Next.js 16 (App Router) |
| Auth | Better Auth — email/contraseña + Google OAuth |
| ORM | Prisma 7 |
| Base de datos | PostgreSQL 16 (VPS compartido) |
| Formularios | TanStack Form (`@tanstack/react-form-nextjs`) |
| UI | shadcn/ui + Tailwind CSS v4 |
| Almacenamiento | MinIO (S3) — bucket `techtrack` |
| CDN de imágenes | imgproxy (`images.genlabs.us`) |
| Package manager | **bun** (nunca npm ni yarn) |
| Testing | Vitest |
| Despliegue | Docker — solo el líder tiene acceso al VPS |

---

## Levantar el entorno de desarrollo

> **Requisito:** Tener [bun](https://bun.sh) instalado.

```bash
# 1. Clonar e instalar dependencias
git clone <url-del-repo> tech-track
cd tech-track
bun install

# 2. Configurar variables de entorno
cp .env.example .env
# Pídele a Brahiam los valores reales del .env
# (ya incluyen la URL de la base de datos del VPS)

# 3. Generar el cliente de Prisma
bun run db:generate

# 4. Aplicar migraciones pendientes
bun run db:migrate

# 5. Iniciar el servidor de desarrollo
bun run dev
# → http://localhost:3000
```

Con eso es suficiente. **No necesitas instalar PostgreSQL ni Docker localmente.** La base de datos de desarrollo está en el VPS y todos conectan a ella.

### Credenciales de desarrollo

Cada miembro del equipo tiene su cuenta ya creada. Contraseña inicial: pídela a Brahiam.

**Cuentas del equipo — todos con rol Admin** (para que cualquiera pueda acceder a todas las features durante desarrollo):

| Correo | Rol |
|--------|-----|
| `brahiam@techtrack.dev` | Admin |
| `diomarys@techtrack.dev` | Admin |
| `lia@techtrack.dev` | Admin |
| `darvin@techtrack.dev` | Admin |
| `carlos@techtrack.dev` | Admin |
| `thanney@techtrack.dev` | Admin |
| `reynaldo@techtrack.dev` | Admin |

**Cuentas de prueba — rol Técnico** (para debuggear la vista del técnico y features que apliquen solo al rol `TECNICO`):

| Correo | Contraseña | Rol |
|--------|------------|-----|
| `tecnico1@techtrack.dev` | `TechTrack2026!` | Técnico |
| `tecnico2@techtrack.dev` | `TechTrack2026!` | Técnico |

---

## Cómo trabajar — flujo de ramas

```
main (protegida)
  └── feature/O-03-order-list         ← tú trabajas aquí
        ↓ Pull Request
        ↓ Brahiam revisa y hace merge
      main ✓
```

1. Descarga los últimos cambios: `git pull origin main`
2. Crea tu rama: `git checkout -b feature/<ID-tarea>-short-name`
   - Ejemplo: `git checkout -b feature/O-03-order-list`
3. Desarrolla y haz commits frecuentes
4. Antes del PR, corre la lista de verificación (ver más abajo)
5. Abre un Pull Request y asígnalo a Brahiam para revisión
6. **Nunca hagas push directamente a `main`**

### Lista de verificación antes de abrir un PR

```bash
bun run typecheck   # debe pasar sin errores
bun run lint        # debe pasar sin errores
bunx vitest run     # todos los tests deben pasar
```

Además, verifica manualmente en el navegador que tu feature funcione.

---

## Scripts útiles

```bash
bun run dev           # Servidor de desarrollo con Turbopack
bun run build         # Build de producción
bun run typecheck     # Verificar tipos TypeScript
bun run lint          # ESLint
bun run check         # lint + typecheck juntos

bun run db:generate   # Regenerar cliente Prisma (después de cambiar schema.prisma)
bun run db:migrate    # Aplicar migraciones pendientes
bun run db:studio     # Prisma Studio — explorador visual de la DB
bun run db:seed       # Crear los 9 usuarios en la DB (7 equipo Admin + 2 demo Técnico)

bun test              # Correr tests
bunx vitest           # Tests en modo watch
```

---

## Estructura de carpetas

```
tech-track/
├── app/
│   ├── (auth)/              # Rutas públicas: /login, /register
│   ├── (dashboard)/         # Rutas protegidas — requieren sesión
│   │   ├── layout.tsx       # Protección + sidebar (no tocar)
│   │   ├── dashboard/       # Panel principal con estadísticas
│   │   ├── orders/          # Lista, detalle, nueva orden
│   │   ├── clients/         # Historial de clientes
│   │   └── admin/           # Solo ADMIN: usuarios (/admin/users)
│   └── api/
│       ├── auth/[...all]/   # Better Auth — no tocar
│       └── upload/          # Subida de archivos a MinIO
├── components/
│   ├── ui/                  # Componentes shadcn/ui
│   └── nav-sidebar.tsx      # Sidebar de navegación
├── lib/
│   ├── auth.ts              # Config servidor de Better Auth (no importar en cliente)
│   ├── auth-client.ts       # Hooks y funciones de auth para componentes cliente
│   ├── prisma.ts            # Cliente Prisma singleton (importa este, nunca new PrismaClient())
│   ├── session.ts           # getServerSession(), requireSession(), requireAdmin()
│   ├── storage.ts           # Helpers de MinIO: upload, download, imagen CDN
│   └── order-transitions.ts # Lógica pura de transiciones de estado (con tests)
├── generated/prisma/        # Auto-generado — NUNCA editar
├── prisma/
│   ├── schema.prisma        # Modelo de datos — fuente de verdad
│   ├── migrations/          # Historial de migraciones (no editar)
│   └── seed.ts              # Script de seed de usuarios
├── __tests__/
│   └── unit/                # Tests de lógica de negocio sin DB
├── proxy.ts                 # Middleware Next.js 16 — guarda de rutas por cookie
├── CLAUDE.md                # Guía técnica para agentes de IA
└── TASKS.md                 # Board de tareas del MVP
```

---

## Documentación técnica

- **[AGENTS.md](./AGENTS.md)** — El agente de IA lo lee al inicio de cada sesión para identificarte y briefearte en tus tareas. Si instalas Claude Code, OpenCode, Cursor o cualquier agente en este repo, arrancará por aquí.
- **[CLAUDE.md](./CLAUDE.md)** — Guía técnica completa de arquitectura, patrones, convenciones y reglas. Léela antes de empezar a codear.
- **[TASKS.md](./TASKS.md)** — Board de tareas del MVP con fases, responsables y criterios de aceptación.

---

## Despliegue

El despliegue lo maneja exclusivamente Brahiam (BS). No hay acceso al VPS de producción para el resto del equipo.

---

## Convenciones rápidas

| ¿Qué? | ¿Cómo? |
|-------|--------|
| Todo el código (rutas, archivos, variables, funciones, comentarios) | **Inglés** |
| Texto que se muestra en la UI | **Español** |
| Constantes de enums del schema | **Español** (ya definidas: `RECIBIDO`, `EN_DIAGNOSTICO`...) |
| Mensajes de commit | **Inglés** en formato `feat(orders): what and why` |
