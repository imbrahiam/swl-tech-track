# TechTrack MD — Board de Tareas MVP

**Cronograma:** 22 mayo – 15 agosto 2026 | **Equipo:** 7 personas | **Líder:** Brahiam (BS)

Rama por tarea: `feature/<ID-tarea>-nombre-corto` → Pull Request → Brahiam revisa → merge a `main`

---

## Leyenda de estado

| Símbolo | Significado |
|---------|-------------|
| ⬜ | Sin empezar |
| 🔵 | En progreso |
| ✅ | Listo / mergeado |
| 🔒 | Bloqueado |

---

## Fase 1 — Base (18 – 22 may)

> La base la hizo BS. El equipo toma tareas desde la Fase 2.

| ID | Tarea | Responsable | Rama | Estado | Notas |
|----|-------|-------------|------|--------|-------|
| F-01 | Repo + Next.js 16 + shadcn | BS | `main` | ✅ | |
| F-02 | Schema Prisma + migración inicial | BS | `main` | ✅ | PostgreSQL 16 en VPS |
| F-03 | Better Auth + seed de usuarios del equipo | BS | `main` | ✅ | 7 usuarios creados |
| F-04 | Middleware de rutas (proxy.ts) | BS | `main` | ✅ | |
| F-05 | Lib de almacenamiento MinIO | BS | `main` | ✅ | Bucket: techtrack |
| F-06 | CLAUDE.md + TASKS.md + README | BS | `main` | ✅ | |
| F-07 | Vitest + tests de ejemplo (transiciones) | BS | `main` | ✅ | Ver `__tests__/unit/` |
| F-08 | Páginas base: login, registro, dashboard (estructura) | BS | `main` | ✅ | Placeholders con shadcn |

---

## Fase 2 — Auth UI + Layout (22 may – 5 jun) — A-01, A-02, A-03 completados por BS en `main`

| ID | Tarea | Responsable | Rama | RF | Estado |
|----|-------|-------------|------|----|--------|
| A-01 | Conectar formulario de login (email + Google OAuth funcional) | BS | `main` | RF-13 | ✅ |
| A-02 | Sidebar de navegación responsivo (mobile + desktop) | BS | `main` | RF-14 | ✅ |
| A-03 | Menú de usuario en el sidebar (nombre, email, cerrar sesión, tema) | BS | `main` | RF-13 | ✅ |
| A-04 | Página de usuarios admin (lista, cambiar rol, desactivar) | DA | `feature/A-04-user-management` | RF-14, RF-15 | ⬜ |

**Guías:**

### A-04 — Gestión de usuarios (solo ADMIN)

**Qué construir:** Una página en `app/(dashboard)/admin/users/page.tsx` (el placeholder ya existe) que muestre la lista de todos los usuarios del sistema. El admin puede ver quiénes están registrados, cambiar su rol entre ADMIN y TECNICO, y desactivar/reactivar cuentas.

**Cómo hacerlo:**
1. Es un Server Component. Llama `prisma.user.findMany({ orderBy: { createdAt: "asc" } })` directamente — no necesitas una API.
2. Muestra una tabla con columnas: Nombre, Email, Rol, Estado (activo/baneado), Fecha de registro.
3. El botón "Cambiar rol" y "Desactivar" son formularios con Server Actions en `app/(dashboard)/admin/users/actions.ts`.
   - Cambiar rol: `prisma.user.update({ where: { id }, data: { role: nuevoRol } })`
   - Desactivar: `prisma.user.update({ where: { id }, data: { banned: true } })`
   - Reactivar: `prisma.user.update({ where: { id }, data: { banned: false } })`
4. Después de cada acción llama `revalidatePath("/admin/users")` para refrescar la tabla.
5. El layout `app/(dashboard)/admin/layout.tsx` ya llama `requireAdmin()` — no necesitas proteger la página de nuevo.
6. Un admin no debe poder desactivarse a sí mismo. Compara el `id` del usuario con `session.user.id` y deshabilita el botón si coinciden.

---

## Fase 2.5 — Especificaciones para desarrollo (22 may – 1 jun)

> DS entrega estas especificaciones **antes** de que DA empiece O-02. Sin DS-01, DA no sabe qué validar.

| ID | Tarea | Responsable | Entregable | RF | Estado |
|----|-------|-------------|------------|-----|--------|
| DS-01 | Especificación de validaciones del formulario de orden | DS | `docs/validaciones-formulario.md` en el repo | RF-01, RF-11 | ⬜ |
| DS-02 | Especificación de casos de prueba por RF | DS | `docs/plan-de-pruebas.md` en el repo | Todos los RF | ⬜ |

**Guías:**

### DS-01 — Especificación de validaciones del formulario de orden

**Por qué es necesario:** DA va a implementar el formulario de nueva orden (O-02) y el buscador de clientes (O-01). Sin esta especificación, no sabe qué formato es válido para la cédula, qué campos son obligatorios, ni qué mensaje mostrar cuando el usuario se equivoca. Este documento es su contrato.

**Qué documentar** — crear `docs/validaciones-formulario.md` en el repositorio con esta estructura:

**Sección 1 — Datos del cliente:**
- `cédula`: formato dominicano `###-#######-#` (11 dígitos con guiones), obligatorio, debe ser único en el sistema
- `teléfono`: formato `000-000-0000` o `0000000000` (10 dígitos), obligatorio
- `nombre`: texto libre, mínimo 3 caracteres, máximo 100, obligatorio

**Sección 2 — Datos del equipo:**
- `marca`: texto libre, obligatorio, máximo 50 caracteres (ej: Samsung, Apple, HP, Lenovo)
- `modelo`: texto libre, obligatorio, máximo 100 caracteres (ej: Galaxy A54, MacBook Air M2)
- `serie`: texto libre, **opcional**, máximo 100 caracteres — muchos equipos no tienen serie visible
- `descripción de la falla`: texto libre, obligatorio, mínimo 10 caracteres, máximo 500 — debe ser lo suficientemente descriptivo

**Sección 3 — Campos opcionales:**
- `extras/accesorios`: texto libre, opcional, máximo 200 caracteres (ej: "Incluye cargador original y funda")

**Sección 4 — Mensajes de error** — especificar el texto exacto que verá el usuario para cada error:
- Campo obligatorio vacío: "Este campo es requerido"
- Cédula con formato inválido: "La cédula debe tener el formato 000-0000000-0"
- Cédula ya registrada para otro cliente: "Ya existe un cliente con esta cédula — búscalo por cédula para continuar"
- Descripción muy corta: "Describe la falla con al menos 10 caracteres"

### DS-02 — Plan de pruebas

**Por qué es necesario:** TG tiene que ejecutar el plan de pruebas en la Fase 6 (Q-01), pero TG no escribe los casos — DS los escribe. Sin este documento, Q-01 no puede empezar. Entregar antes del 1 de junio para que TG lo revise y pueda agregar casos adicionales.

**Qué documentar** — crear `docs/plan-de-pruebas.md` con casos de prueba para cada RF. Estructura de cada caso:

```
| CP-XX | Nombre del caso |
|-------|-----------------|
| RF relacionado | RF-01 |
| Precondición | El técnico tiene sesión activa |
| Pasos | 1. Ir a Nueva Orden. 2. Dejar cédula vacía. 3. Hacer clic en Guardar. |
| Resultado esperado | Se muestra el mensaje "Este campo es requerido" debajo del campo cédula |
| Resultado real | (llenar en fase QA) |
| Estado | ⬜ |
```

**Casos mínimos a cubrir:**
- Registro exitoso de una orden con todos los datos correctos (CA-01)
- Registro de orden con cliente existente (cédula ya en sistema)
- Registro de orden con cliente nuevo
- Intento de guardar orden con campos obligatorios vacíos
- Cambio de estado siguiendo el flujo correcto (todos los pasos del flujo)
- Intento de cambio de estado inválido (ej: de RECIBIDO directo a LISTO)
- Acceso a ruta protegida sin sesión → redirige a login (CA-06)
- Acceso a `/admin` con rol TECNICO → redirige a dashboard
- Generación e impresión del comprobante PDF (CA-03)
- Verificar que el log registra usuario y timestamp en cada cambio (CA-07)
- Orden con más de 10 días sin cambio aparece resaltada (CA-05)
- Login con email/contraseña
- Login con Google OAuth (CA-08)

---

## Fase 3 — Órdenes (2 jun – 27 jun)

| ID | Tarea | Responsable | Rama | RF | Estado |
|----|-------|-------------|------|----|--------|
| O-01 | Búsqueda de cliente existente por cédula/teléfono al crear orden | DA | `feature/O-01-client-autocomplete` | RF-11 | ⬜ |
| O-02 | Formulario de nueva orden + Server Action `createOrder` | DA | `feature/O-02-new-order` | RF-01 | ⬜ |
| O-03 | Tabla de órdenes con búsqueda y filtros | CC | `feature/O-03-order-list` | RF-02, RF-08 | ⬜ |
| O-04 | Página de detalle de orden (datos + historial de log) | CC | `feature/O-04-order-detail` | RF-02, RF-16 | ⬜ |
| O-05 | Acción de cambio de estado (validación + log + revalidate) | DA | `feature/O-05-status-update` | RF-04 | ⬜ |
| O-06 | Formulario de edición (bloqueado si ENTREGADO o SIN_REPARACION) | CC | `feature/O-06-edit-order` | RF-03 | ⬜ |
| O-07 | Selector de prioridad (ALTA / MEDIA / BAJA) | CC | `feature/O-07-priority` | RF-09 | ⬜ |
| O-08 | Cierre de orden con diálogo de confirmación | DA | `feature/O-08-close-order` | RF-05 | ⬜ |

**Guías:**

### O-01 — Búsqueda de cliente al crear orden

**Qué construir:** Al crear una nueva orden, el técnico no escribe los datos del cliente a mano cada vez. En su lugar, escribe la cédula o el teléfono del cliente en un campo de búsqueda. Si el cliente ya existe en la base de datos, sus datos (nombre, cédula, teléfono) se rellenan automáticamente. Si no existe, se muestran campos para crearlo en el mismo formulario.

**Cómo hacerlo:**
1. Crea el Route Handler `app/api/clients/search/route.ts` que recibe `GET /api/clients/search?q=<texto>` y busca en la tabla `client` por `cedula` o `phone` que contengan ese texto:
   ```ts
   const clients = await prisma.client.findMany({
     where: { OR: [{ cedula: { contains: q } }, { phone: { contains: q } }] },
     take: 5,
   })
   ```
2. Crea el componente cliente `components/client-search.tsx` con `"use client"`. Tiene un `<input>` de texto. Mientras el usuario escribe (con debounce de ~300ms), hace `fetch("/api/clients/search?q=<valor>")` y muestra una lista desplegable con los resultados.
3. Cuando el usuario selecciona un resultado de la lista, los campos nombre/cédula/teléfono del formulario de orden se rellenan y el `clientId` se guarda en un `<input type="hidden">`.
4. Si no hay resultados, mostrar opción "Crear cliente nuevo" que despliega los campos vacíos para llenar.
5. Este componente se usa dentro del formulario de O-02.

> ⚠️ El Route Handler sí requiere autenticación. Llama `requireSession()` al inicio.

### O-02 — Formulario de nueva orden

**Qué construir:** El formulario completo para registrar una orden de servicio. El técnico llena los datos del equipo, la falla, y opcionalmente notas adicionales. Al enviar, la orden queda registrada en la base de datos con estado `RECIBIDO`.

**Campos del formulario** (mapeados al modelo `Order` del schema):
- Cliente (viene de O-01): `clientId` — hidden field con el ID del cliente seleccionado/creado
- Marca del equipo: `brand` (texto libre, ej: Samsung, Apple, HP)
- Modelo: `model` (texto libre, ej: Galaxy S23, MacBook Pro)
- Número de serie: `serial` (opcional)
- Descripción de la falla: `faultDesc` (textarea — qué le pasa al equipo según el cliente)
- Extras/accesorios: `extras` (opcional, ej: "Incluye cargador y estuche")

**Cómo hacerlo:**
1. El formulario ya tiene estructura en `app/(dashboard)/orders/new/page.tsx` — conéctalo.
2. Crea `app/(dashboard)/orders/new/actions.ts` con `"use server"`:
   ```ts
   export async function createOrder(formData: FormData) {
     const session = await requireSession()
     // Leer campos del formData
     // Si clientId está vacío, primero crear el cliente con prisma.client.create()
     // Luego crear la orden:
     await prisma.order.create({
       data: {
         clientId, brand, model, serial, faultDesc, extras,
         status: "RECIBIDO",
         priority: "MEDIA",
         technicianId: session.user.id, // el técnico que crea la orden
       }
     })
     // Crear el primer OrderLog con newStatus: "RECIBIDO"
     revalidatePath("/orders")
     redirect("/orders")
   }
   ```
3. El técnico que crea la orden queda asignado automáticamente como `technicianId`. No hay selector de técnico en este formulario.
4. Después de crear, redirigir a `/orders` — no mostrar toast.

### O-03 — Tabla de órdenes

**Qué construir:** La página `/orders` muestra todas las órdenes del sistema en una tabla. El técnico puede buscar por número de orden, nombre de cliente, o filtrar por estado. Las órdenes se ordenan por fecha de creación descendente (más recientes primero).

**Columnas de la tabla:** N° Orden | Cliente | Equipo (marca + modelo) | Estado | Técnico | Fecha ingreso

**Cómo hacerlo:**
1. Es un Server Component. En `app/(dashboard)/orders/page.tsx`, acepta `searchParams` para búsqueda y filtro:
   ```ts
   export default async function OrdersPage({ searchParams }: { searchParams: { q?: string; status?: string } }) {
     const orders = await prisma.order.findMany({
       where: {
         AND: [
           searchParams.q ? {
             OR: [
               { client: { name: { contains: searchParams.q, mode: "insensitive" } } },
               { number: isNaN(+searchParams.q) ? undefined : +searchParams.q },
             ]
           } : {},
           searchParams.status ? { status: searchParams.status as OrderStatus } : {},
         ]
       },
       include: { client: true, technician: true },
       orderBy: { createdAt: "desc" },
     })
   }
   ```
2. El buscador y el filtro de estado son un `<form>` con `method="GET"` — sin JavaScript extra, funciona con Server Components.
3. El filtro de estado es un `<select>` con las 7 opciones del enum `OrderStatus`.
4. Cada fila de la tabla tiene un badge de color según el estado (usa el componente `Badge` de shadcn).
5. Cada fila es clickeable y navega a `/orders/[id]`.

### O-04 — Página de detalle de orden

**Qué construir:** La página `/orders/[id]` muestra todos los datos de una orden específica: información del cliente, datos del equipo, estado actual, técnico asignado, y el historial completo de cambios de estado (log).

**Layout de la página** (el placeholder ya existe en `app/(dashboard)/orders/[id]/page.tsx`):
- Columna principal (2/3): datos del cliente y equipo, descripción de la falla, historial de estados
- Columna lateral (1/3): estado actual, prioridad, botones de acción (cambiar estado, imprimir)

**Cómo hacerlo:**
1. Obtén la orden con todos sus datos:
   ```ts
   const order = await prisma.order.findUniqueOrThrow({
     where: { id: params.id },
     include: {
       client: true,
       technician: true,
       logs: { include: { user: true }, orderBy: { createdAt: "asc" } },
     },
   })
   ```
2. El historial de estados se muestra como una lista cronológica: fecha + hora, quién hizo el cambio, estado anterior → nuevo estado, comentario si tiene.
3. No implementes el cambio de estado aquí — eso es O-05. Por ahora muestra el estado actual con un badge y deja el botón deshabilitado con un comentario.

### O-05 — Cambio de estado de una orden

**Qué construir:** Desde el detalle de una orden, el técnico puede avanzar el estado siguiendo el flujo establecido. No todos los estados son accesibles desde cualquier punto — solo las transiciones válidas están permitidas.

**Flujo de estados** (definido en `lib/order-transitions.ts`):
```
RECIBIDO → EN_DIAGNOSTICO
EN_DIAGNOSTICO → ESPERANDO_APROBACION | SIN_REPARACION
ESPERANDO_APROBACION → EN_REPARACION | SIN_REPARACION
EN_REPARACION → LISTO
LISTO → ENTREGADO
```
`ENTREGADO` y `SIN_REPARACION` son estados finales — no se puede avanzar desde ellos.

**Cómo hacerlo:**
1. Crea `app/(dashboard)/orders/[id]/actions.ts` con `"use server"`:
   ```ts
   export async function updateOrderStatus(orderId: string, newStatus: OrderStatus, comment?: string) {
     const session = await requireSession()
     const order = await prisma.order.findUniqueOrThrow({ where: { id: orderId } })
     
     if (!canTransition(order.status, newStatus)) {
       throw new Error(`Transición inválida: ${order.status} → ${newStatus}`)
     }
     
     await prisma.$transaction([
       prisma.order.update({ where: { id: orderId }, data: { status: newStatus } }),
       prisma.orderLog.create({
         data: {
           orderId,
           userId: session.user.id,
           previousStatus: order.status,
           newStatus,
           comment: comment ?? null,
         }
       }),
     ])
     revalidatePath(`/orders/${orderId}`)
   }
   ```
2. En la UI, muestra solo los estados a los que se puede transicionar desde el estado actual (usa `canTransition` para filtrar). Si el estado es final, muestra el badge pero sin botones.
3. Opcionalmente ofrece un campo de texto para comentario al cambiar estado (ej: "Esperando repuesto del cliente").

### O-06 — Edición de una orden

**Qué construir:** Formulario para editar los datos de una orden existente (marca, modelo, serie, descripción de la falla, extras). Solo disponible si la orden NO está en estado `ENTREGADO` ni `SIN_REPARACION`.

**Cómo hacerlo:**
1. Crea `app/(dashboard)/orders/[id]/edit/page.tsx` con el formulario pre-rellenado con los datos actuales.
2. Verifica al cargar la página (Server Component) que la orden no esté en estado final:
   ```ts
   const ESTADOS_FINALES = ["ENTREGADO", "SIN_REPARACION"] as const
   if (ESTADOS_FINALES.includes(order.status)) redirect(`/orders/${params.id}`)
   ```
3. Server Action `updateOrder` en `actions.ts` que actualiza solo los campos editables (`brand`, `model`, `serial`, `faultDesc`, `extras`). No se puede cambiar el cliente ni el técnico desde aquí.
4. Después de guardar, redirigir a `/orders/[id]`.

### O-07 — Selector de prioridad

**Qué construir:** En la página de detalle de una orden, el técnico puede cambiar la prioridad entre ALTA, MEDIA y BAJA. La prioridad afecta el orden visual en la cola de trabajo del dashboard (O-03 y D-02).

**Cómo hacerlo:**
1. En `app/(dashboard)/orders/[id]/actions.ts` (mismo archivo que O-05), agrega:
   ```ts
   export async function updateOrderPriority(orderId: string, priority: Priority) {
     await requireSession()
     await prisma.order.update({ where: { id: orderId }, data: { priority } })
     revalidatePath(`/orders/${orderId}`)
   }
   ```
2. En la UI del detalle, muestra un `<select>` o un grupo de botones (ALTA / MEDIA / BAJA) con el valor actual seleccionado. Al cambiar, envía la acción.
3. No requiere confirmación — es un cambio trivial y reversible.

### O-08 — Cierre de orden

**Qué construir:** El técnico puede cerrar una orden que esté en estado `LISTO` marcándola como `ENTREGADO`. Por ser una acción irreversible (estado final), requiere confirmación explícita del usuario antes de ejecutarse.

**Cómo hacerlo:**
1. En la página de detalle, si la orden está en estado `LISTO`, mostrar el botón "Marcar como entregado" (destructivo/prominente).
2. Al hacer clic, abrir un diálogo de confirmación (`AlertDialog` de shadcn) con el mensaje: _"¿Confirmar entrega de la orden #N? Esta acción no se puede deshacer."_
3. El botón de confirmar dentro del diálogo ejecuta la Server Action `updateOrderStatus(orderId, "ENTREGADO")` de O-05.
4. No crear una acción separada — reutiliza la de O-05 que ya valida la transición y crea el log.

---

## Fase 4 — Dashboard + Alertas (20 jun – 11 jul)

| ID | Tarea | Responsable | Rama | RF | Estado |
|----|-------|-------------|------|----|--------|
| D-01 | Tarjetas de estadísticas (órdenes por estado, ingresadas hoy) | CC | `feature/D-01-stats-cards` | RF-07 | ⬜ |
| D-02 | Cola de trabajo (órdenes activas, ordenable) | CC | `feature/D-02-work-queue` | RF-08 | ⬜ |
| D-03 | Lógica de alerta de tiempo (+10 días hábiles sin cambio) | DA | `feature/D-03-time-alerts` | RF-10 | ⬜ |
| D-04 | Badges de alerta en lista y dashboard | CC | `feature/D-04-alert-badges` | RF-10 | ⬜ |
| D-05 | Página de historial de cliente (todas sus órdenes) | DA | `feature/D-05-client-history` | RF-12 | ⬜ |

**Guías:**

### D-01 — Tarjetas de estadísticas

**Qué construir:** Las 4 tarjetas en la parte superior del dashboard muestran números reales obtenidos de la base de datos: cuántas órdenes están activas (no finalizadas), cuántas se ingresaron hoy, cuántas llevan más de 10 días hábiles sin cambio (alerta), y cuántas se completaron hoy.

**Cómo hacerlo:**
1. En `app/(dashboard)/dashboard/page.tsx` (Server Component), reemplaza los valores `"—"` con consultas reales:
   ```ts
   const [activas, ingresadasHoy, completadasHoy] = await Promise.all([
     prisma.order.count({ where: { status: { notIn: ["ENTREGADO", "SIN_REPARACION"] } } }),
     prisma.order.count({ where: { createdAt: { gte: startOfToday() } } }),
     prisma.order.count({ where: { status: { in: ["ENTREGADO", "SIN_REPARACION"] }, updatedAt: { gte: startOfToday() } } }),
   ])
   ```
2. Para `startOfToday()` usa `new Date()` con horas en 0: `new Date(new Date().setHours(0,0,0,0))`.
3. La tarjeta "Con alerta" depende de D-03 — déjala en `"—"` por ahora y conéctala cuando D-03 esté listo.

### D-02 — Cola de trabajo

**Qué construir:** Una tabla en el dashboard que muestra todas las órdenes activas (estados que no son `ENTREGADO` ni `SIN_REPARACION`), ordenadas por prioridad (ALTA primero) y luego por fecha de ingreso (más antiguas primero, ya que llevan más tiempo esperando).

**Columnas:** N° | Cliente | Equipo | Estado | Prioridad | Días activa

**Cómo hacerlo:**
1. Consulta en `app/(dashboard)/dashboard/page.tsx`:
   ```ts
   const ordenes = await prisma.order.findMany({
     where: { status: { notIn: ["ENTREGADO", "SIN_REPARACION"] } },
     include: { client: true, technician: true },
     orderBy: [
       { priority: "asc" },   // ALTA < BAJA alfabéticamente, necesitas mapear
       { createdAt: "asc" },
     ],
   })
   ```
   > Nota: Prisma ordena enums por su valor string. Para ALTA → MEDIA → BAJA, necesitas ordenar en la app: `["ALTA","MEDIA","BAJA"].indexOf(order.priority)`.
2. La columna "Días activa" es `Math.floor((Date.now() - order.createdAt.getTime()) / 86_400_000)`.
3. Cada fila navega a `/orders/[id]` al hacer clic.

### D-03 — Lógica de alerta de tiempo

**Qué construir:** Una función que determina si una orden lleva más de 10 días hábiles (lunes a viernes, sin contar fines de semana) sin cambiar de estado. Esta función es la base para D-04 y D-01 (tarjeta de alertas).

**Cómo hacerlo:**
1. Crea `lib/business-days.ts` con una función pura:
   ```ts
   export function businessDaysBetween(from: Date, to: Date): number {
     // Contar días lunes a viernes entre from y to
   }
   
   export function isOrderOverdue(lastUpdated: Date, thresholdDays = 10): boolean {
     return businessDaysBetween(lastUpdated, new Date()) > thresholdDays
   }
   ```
2. Escribe tests en `__tests__/unit/business-days.test.ts` — casos a cubrir: fechas dentro de la misma semana, cruce de fin de semana, exactamente 10 días, 11 días.
3. Usa `order.updatedAt` como la fecha del último cambio (Prisma lo actualiza automáticamente en cada `update`).

### D-04 — Badges de alerta

**Qué construir:** Las órdenes que superan los 10 días hábiles sin cambio deben visualizarse de forma destacada. En la tabla de órdenes (`/orders`) y en la cola de trabajo del dashboard, estas órdenes muestran un badge o ícono de advertencia (ej: ícono de triángulo amarillo + texto "10+ días").

**Cómo hacerlo:**
1. Importa `isOrderOverdue` de `lib/business-days.ts` (depende de D-03).
2. En la tabla de `app/(dashboard)/orders/page.tsx`, agrega una columna o indicador visual:
   ```tsx
   {isOrderOverdue(order.updatedAt) && (
     <Badge variant="destructive">⚠ {días} días</Badge>
   )}
   ```
3. Aplica el mismo patrón en la cola de D-02.
4. En D-01, ya puedes conectar la tarjeta "Con alerta": cuenta las órdenes activas donde `isOrderOverdue(order.updatedAt)` sea true.

### D-05 — Historial de cliente

**Qué construir:** Al hacer clic en el nombre de un cliente (desde la lista de órdenes o el detalle), se navega a `/clients/[id]` que muestra los datos del cliente y todas las órdenes que ha tenido, ordenadas por fecha.

**Cómo hacerlo:**
1. Crea `app/(dashboard)/clients/[id]/page.tsx`:
   ```ts
   const client = await prisma.client.findUniqueOrThrow({
     where: { id: params.id },
     include: {
       orders: {
         include: { technician: true },
         orderBy: { createdAt: "desc" },
       },
     },
   })
   ```
2. Muestra: nombre, cédula, teléfono del cliente, y debajo una tabla de sus órdenes con columnas: N° | Equipo | Estado | Técnico | Fecha.
3. En la tabla de órdenes (O-03) y en el detalle (O-04), convierte el nombre del cliente en un link `<Link href={`/clients/${order.clientId}`}>`.

---

## Fase 5 — PDF + Reportes (4 – 25 jul)

| ID | Tarea | Responsable | Rama | RF | Estado |
|----|-------|-------------|------|----|--------|
| P-01 | Generación de comprobante PDF | DA | `feature/P-01-pdf-receipt` | RF-06 | ⬜ |
| P-02 | Botón de descarga/impresión del comprobante en el detalle | CC | `feature/P-02-receipt-ui` | RF-06 | ⬜ |
| R-01 | Reporte diario (ADMIN: órdenes creadas/actualizadas hoy) | DA | `feature/R-01-daily-report` | RF-17 | ⬜ |
| R-02 | Filtro por rango de fechas + exportar | DA | `feature/R-02-date-report` | RF-18 | ⬜ |

**Guías:**

### P-01 — Generación de comprobante PDF

**Qué construir:** Al registrar una orden, el cliente recibe un comprobante impreso con los datos del equipo y la falla reportada. El comprobante se genera como PDF y se guarda en MinIO para poder imprimirlo en cualquier momento.

**Contenido del comprobante** (equivalente al formulario físico actual):
- Logo + nombre del taller (Martinez Devices SRL)
- Número de orden (ej: `#1042`)
- Fecha y hora de ingreso
- Datos del cliente: nombre, cédula, teléfono
- Datos del equipo: marca, modelo, número de serie
- Descripción de la falla (tal como la describió el cliente)
- Extras/accesorios incluidos
- Nombre del técnico que recibió el equipo
- Estado inicial: RECIBIDO
- Espacio para firma del cliente

**Cómo hacerlo:**
1. Instala `@react-pdf/renderer`: `bun add @react-pdf/renderer`.
2. Crea `lib/receipt-pdf.tsx` con el componente PDF usando la API de `@react-pdf/renderer` (`Document`, `Page`, `View`, `Text`, `Image`).
3. Crea el Route Handler `app/api/orders/[id]/receipt/route.ts`:
   - Llama `requireSession()`
   - Obtiene la orden con cliente y técnico de Prisma
   - Renderiza el PDF: `await renderToBuffer(<ReceiptDocument order={order} />)`
   - Si no existe en MinIO, lo guarda: `await getUploadUrl("receipts/{orderId}/receipt.pdf", "application/pdf")`
   - Devuelve el PDF como respuesta con `Content-Type: application/pdf`
4. Guarda la key en MinIO bajo `receipts/{order.id}/receipt.pdf`.

### P-02 — Botón de impresión en el detalle

**Qué construir:** En la página de detalle de una orden (`/orders/[id]`), el botón "Imprimir comprobante" (ya existe deshabilitado) debe activarse y abrir/descargar el PDF generado en P-01.

**Cómo hacerlo:**
1. El botón hace `window.open(`/api/orders/${orderId}/receipt`, "_blank")` — el browser abre el PDF en una pestaña nueva donde el usuario puede imprimir con Ctrl+P.
2. Es un componente cliente (`"use client"`) solo por el `onClick`. Extrae solo el botón como componente cliente, el resto de la página sigue siendo Server Component.
3. Depende de P-01 — no implementar hasta que P-01 esté mergeado.

### R-01 — Reporte diario

**Qué construir:** Una página en `/admin/reports` (solo ADMIN) que muestra un resumen del día: cuántas órdenes se crearon, cuántas cambiaron de estado, y la lista de ambas con sus detalles.

**Cómo hacerlo:**
1. Crea `app/(dashboard)/admin/reports/page.tsx` (Server Component, protegido por el admin layout).
2. Consultas:
   ```ts
   const hoy = new Date(new Date().setHours(0, 0, 0, 0))
   const [creadas, actualizadas] = await Promise.all([
     prisma.order.findMany({ where: { createdAt: { gte: hoy } }, include: { client: true, technician: true } }),
     prisma.orderLog.findMany({ where: { createdAt: { gte: hoy } }, include: { order: { include: { client: true } }, user: true } }),
   ])
   ```
3. Muestra dos secciones: "Órdenes ingresadas hoy" y "Cambios de estado hoy".

### R-02 — Reporte por rango de fechas

**Qué construir:** En la misma página de reportes, el admin puede seleccionar un rango de fechas (desde/hasta) y ver las órdenes creadas en ese período. Incluye botón para exportar como CSV.

**Cómo hacerlo:**
1. Agrega un `<form method="GET">` con dos `<input type="date">` (fecha inicio y fin) — funciona con Server Components via `searchParams`.
2. Filtra con `createdAt: { gte: fechaInicio, lte: fechaFin }`.
3. El botón "Exportar CSV" apunta a `GET /api/reports/export?from=...&to=...`. El Route Handler genera y devuelve un archivo `.csv` con `Content-Disposition: attachment; filename="reporte.csv"`.
4. Solo ADMIN. Verifica con `requireAdmin()` en el Route Handler también — los Route Handlers son endpoints públicos.

---

## Fase 6 — QA + Pulido (18 jul – 8 ago)

| ID | Tarea | Responsable | Rama | Estado |
|----|-------|-------------|------|--------|
| Q-01 | Ejecución del plan de pruebas (todos los CA-xx) — usa `docs/plan-de-pruebas.md` de DS-02 | TG | `feature/Q-01-test-plan` | ⬜ |
| Q-02 | Registro y seguimiento de bugs | TG | Issues del repo | ⬜ |
| Q-03 | Revisión de responsividad (móvil y tablet) | LD | `feature/Q-03-responsive` | ⬜ |
| Q-04 | Revisión de accesibilidad (labels, contraste, teclado) | LD | `feature/Q-04-accessibility` | ⬜ |
| Q-05 | Documentación final y comentarios de código crítico | RP | `feature/Q-05-docs` | ⬜ |
| Q-06 | Tests unitarios para lógica de negocio (alertas, días hábiles) | TG | `feature/Q-06-unit-tests` | ⬜ |

---

## Fase 7 — Despliegue (1 – 15 ago)

> Solo BS tiene acceso al VPS. El resto del equipo no participa en esta fase.

| ID | Tarea | Responsable | Estado | Notas |
|----|-------|-------------|--------|-------|
| DEP-01 | `docker-compose.yml` de producción | BS | ⬜ | |
| DEP-02 | Variables de entorno en VPS | BS | ⬜ | |
| DEP-03 | Migración de base de datos en producción | BS | ⬜ | |
| DEP-04 | Seed del usuario admin real | BS | ⬜ | |
| DEP-05 | Smoke test final en producción | BS + TG | ⬜ | Todos los CA-xx |
| DEP-06 | Configuración de Caddy (dominio + HTTPS) | BS | ⬜ | |

---

## Criterios de aceptación (del cliente)

Verificar antes de dar la Fase 6 por terminada:

- [ ] CA-01: Se puede registrar una orden en menos de 2 minutos
- [ ] CA-02: El dashboard muestra correctamente todas las órdenes activas al cargar
- [ ] CA-03: El comprobante PDF contiene todos los campos del formulario físico actual
- [ ] CA-04: Un usuario nuevo puede registrar una orden tras 10 minutos de capacitación
- [ ] CA-05: Las órdenes con más de 10 días hábiles sin cambio de estado aparecen resaltadas
- [ ] CA-06: No es posible acceder a ninguna ruta protegida sin sesión válida
- [ ] CA-07: Todo cambio de estado queda en el log con usuario y timestamp
- [ ] CA-08: El login con Google OAuth funciona correctamente en producción
- [ ] CA-09: Un integrante nuevo puede levantar el entorno de desarrollo en menos de 10 minutos

---

## Gantt aproximado

```
         | May W4 | Jun W1 | Jun W2 | Jun W3 | Jun W4 | Jul W1 | Jul W2 | Jul W3 | Jul W4 | Ago W1 | Ago W2
---------|--------|--------|--------|--------|--------|--------|--------|--------|--------|--------|--------
Fase 1   | ██     |        |        |        |        |        |        |        |        |        |
Fase 2   | ██████ | ██████ |        |        |        |        |        |        |        |        |
Fase 3   |        | ████   | ██████ | ██████ | ████   |        |        |        |        |        |
Fase 4   |        |        |        | ████   | ██████ | ██████ |        |        |        |        |
Fase 5   |        |        |        |        |        | ████   | ██████ | ██████ |        |        |
Fase 6   |        |        |        |        |        |        | ████   | ██████ | ██████ | ████   |
Fase 7   |        |        |        |        |        |        |        |        | ████   | ██████ | ██████
```

*May W4 = 19-23 may | Jun W1 = 26 may-6 jun | Jun W2 = 9-13 jun | Jun W3 = 16-20 jun | Jun W4 = 23-27 jun | Jul W1 = 30 jun-4 jul | Jul W2 = 7-11 jul | Jul W3 = 14-18 jul | Jul W4 = 21-25 jul | Ago W1 = 28 jul-8 ago | Ago W2 = 8-15 ago*

---

## Clave de responsables

| Iniciales | Nombre | Rol |
|-----------|--------|-----|
| BS | Brahiam Montero | Líder de proyecto |
| DS | Diomarys Abad | Analista de requerimientos |
| LD | Lía Fernández | Diseñadora UX/UI |
| DA | Darvin Aquino | Desarrollador backend |
| CC | Carlos Veras | Desarrollador frontend |
| TG | Thanney García | QA / Tester |
| RP | Reynaldo Peña | Documentador / DBA |

**DS** tiene tres entregas concretas:
1. **DS-01** (antes del 1 jun): `docs/validaciones-formulario.md` — reglas de validación exactas para todos los campos del formulario de orden. DA no puede terminar O-02 sin esto.
2. **DS-02** (antes del 1 jun): `docs/plan-de-pruebas.md` — casos de prueba detallados para cada RF. TG ejecuta este plan en Q-01; sin DS-02, Q-01 no puede empezar.
3. **Revisión de PRs** (Fases 3–5, continuo): cuando se mergea una feature, DS la revisa contra el RF correspondiente y abre un Issue en GitHub si algo no cumple lo especificado. Esto garantiza que lo que se construye coincide con lo que se pidió.
**LD** contribuye en: especificaciones de diseño (Figma o mockups anotados) antes de la Fase 2, revisiones de Q-03 y Q-04.
**RP** contribuye en: documentación Q-05, seguimiento de cambios al schema de DB, revisión de que las migraciones están correctamente documentadas.
