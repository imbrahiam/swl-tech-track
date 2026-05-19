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

## Fase 2 — Auth UI + Layout (22 may – 5 jun)

| ID | Tarea | Responsable | Rama | RF | Estado |
|----|-------|-------------|------|----|--------|
| A-01 | Conectar formulario de login (email + Google OAuth funcional) | CC | `feature/A-01-login-form` | RF-13 | ⬜ |
| A-02 | Sidebar de navegación responsivo (mobile + desktop) | CC | `feature/A-02-sidebar-responsive` | RF-14 | ⬜ |
| A-03 | Menú de usuario en el sidebar (nombre, rol, cerrar sesión) | CC | `feature/A-03-user-menu` | RF-13 | ⬜ |
| A-04 | Página de usuarios admin (lista, cambiar rol, desactivar) | DA | `feature/A-04-user-management` | RF-14, RF-15 | ⬜ |

**Guías:**
- A-01: Usa `signIn.email()` y `signIn.social({ provider: "google" })` desde `@/lib/auth-client`. El formulario ya existe en `app/(auth)/login/form.tsx` — conéctalo.
- A-02: El sidebar base está en `components/nav-sidebar.tsx`. Maneja el estado colapsado/expandido con el componente `SidebarTrigger` de shadcn.
- A-03: Usa `useSession()` de `@/lib/auth-client`. La UI del usuario ya tiene placeholder en `nav-sidebar.tsx`.
- A-04: Usa `requireAdmin()` en `app/(dashboard)/admin/layout.tsx` (ya implementado). Obtén usuarios con `prisma.user.findMany()` en un Server Component.

---

## Fase 3 — Órdenes (2 jun – 27 jun)

| ID | Tarea | Responsable | Rama | RF | Estado |
|----|-------|-------------|------|----|--------|
| O-01 | Autocompletado de cliente por cédula/teléfono | DA | `feature/O-01-client-autocomplete` | RF-11 | ⬜ |
| O-02 | Formulario de nueva orden + Server Action `createOrder` | DA | `feature/O-02-new-order` | RF-01 | ⬜ |
| O-03 | Tabla de órdenes con búsqueda y filtros | CC | `feature/O-03-order-list` | RF-02, RF-08 | ⬜ |
| O-04 | Página de detalle de orden (datos + historial de log) | CC | `feature/O-04-order-detail` | RF-02, RF-16 | ⬜ |
| O-05 | Acción de cambio de estado (validación + log + revalidate) | DA | `feature/O-05-status-update` | RF-04 | ⬜ |
| O-06 | Formulario de edición (bloqueado si ENTREGADO o SIN_REPARACION) | CC | `feature/O-06-edit-order` | RF-03 | ⬜ |
| O-07 | Selector de prioridad (ALTA / MEDIA / BAJA) | CC | `feature/O-07-priority` | RF-09 | ⬜ |
| O-08 | Cierre de orden con diálogo de confirmación | DA | `feature/O-08-close-order` | RF-05 | ⬜ |

**Guías:**
- O-01: Route Handler `GET /api/clients/search?q=` llamado desde el componente de autocompletado (cliente).
- O-02: Server Action en `app/(dashboard)/orders/new/actions.ts`. Llama `revalidatePath("/orders")` después de crear y luego `redirect("/orders")`. El formulario ya tiene la estructura en `app/(dashboard)/orders/new/page.tsx`.
- O-05: Importa `canTransition` desde `lib/order-transitions.ts`. Crea un `OrderLog` por cada cambio. Rechaza con mensaje de error si la transición no es válida.
- O-05: Cada cambio de estado = un registro en `order_log` con: userId, previousStatus, newStatus, comment, timestamp.

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
- D-01: Server Component con `prisma.order.groupBy({ by: ["status"], _count: true })`. Las tarjetas de estadísticas ya tienen el placeholder en `app/(dashboard)/dashboard/page.tsx`.
- D-03: Días hábiles = lunes a viernes. Implementa la función pura en `lib/business-days.ts` y escribe un test en `__tests__/unit/`.
- D-05: `app/(dashboard)/clients/[id]/page.tsx`. Obtén el cliente con sus órdenes usando `prisma.client.findUniqueOrThrow({ where: { id }, include: { orders: true } })`.

---

## Fase 5 — PDF + Reportes (4 – 25 jul)

| ID | Tarea | Responsable | Rama | RF | Estado |
|----|-------|-------------|------|----|--------|
| P-01 | Generación de comprobante PDF | DA | `feature/P-01-pdf-receipt` | RF-06 | ⬜ |
| P-02 | Botón de descarga/impresión del comprobante en el detalle | CC | `feature/P-02-receipt-ui` | RF-06 | ⬜ |
| R-01 | Reporte diario (ADMIN: órdenes creadas/actualizadas hoy) | DA | `feature/R-01-daily-report` | RF-17 | ⬜ |
| R-02 | Filtro por rango de fechas + exportar | DA | `feature/R-02-date-report` | RF-18 | ⬜ |

**Guías:**
- P-01: Usa `@react-pdf/renderer` o genera HTML y usa el diálogo de impresión del navegador. El comprobante debe incluir: número de orden, fecha, nombre/teléfono/cédula del cliente, marca/modelo/serie, descripción de la falla, extras, nombre del técnico, estado.
- P-01: Guarda el PDF en MinIO bajo `receipts/{orderId}/receipt.pdf` usando el endpoint `/api/upload`.
- R-01 y R-02: Solo ADMIN. El admin layout ya aplica `requireAdmin()` — no necesitas protegerlos de nuevo.

---

## Fase 6 — QA + Pulido (18 jul – 8 ago)

| ID | Tarea | Responsable | Rama | Estado |
|----|-------|-------------|------|--------|
| Q-01 | Ejecución del plan de pruebas (todos los CA-xx) | TG | `feature/Q-01-test-plan` | ⬜ |
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

**DS** contribuye en: revisión de que las features implementadas cumplen los requerimientos del ERS, escritura de casos de prueba para Q-01.
**LD** contribuye en: especificaciones de diseño (Figma o mockups anotados) antes de la Fase 2, revisiones de Q-03 y Q-04.
**RP** contribuye en: documentación Q-05, seguimiento de cambios al schema de DB, revisión de que las migraciones están correctamente documentadas.
