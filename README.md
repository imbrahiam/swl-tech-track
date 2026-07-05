# TechTrack

Sistema web para registrar, diagnosticar, reparar y entregar equipos de **Martinez Devices SRL**.

## Qué hace

- Inicio de sesión con correo y contraseña.
- Panel con órdenes activas, prioridades, actividad diaria y alertas por más de 10 días laborables.
- Registro de clientes y órdenes con foto del equipo.
- Flujo controlado: Recibido → Diagnóstico → Aprobación → Reparación → Listo → Entregado.
- Historial auditable de cada cambio de estado.
- Edición, prioridad, búsqueda y filtros de órdenes.
- Historial completo por cliente.
- Comprobante PDF imprimible.
- Administración de usuarios, roles y accesos.
- Reportes por fecha y exportación CSV.

Los datos se guardan en SQLite. En Docker, el archivo persistente es `/data/techtrack.db`. Las imágenes y comprobantes usan MinIO con claves deterministas bajo `techtrack/`; repetir el seed no duplica registros ni objetos.

## Requisitos

- [Bun](https://bun.sh/) 1.3 o posterior para desarrollo.
- Docker y Docker Compose para producción.
- Credenciales de un servicio S3 compatible con MinIO.

## Desarrollo local

```bash
git clone git@github.com:imbrahiam/swl-tech-track.git
cd swl-tech-track
bun install
cp .env.example .env
# Completar .env
bun run db:generate
bun run db:setup
bun run db:seed
bun run dev
```

La aplicación queda en `http://localhost:3000`.

## Variables de entorno

```dotenv
DATABASE_URL="file:./data/techtrack.db"
BETTER_AUTH_SECRET="secreto-aleatorio-de-32-bytes-o-mas"
BETTER_AUTH_URL="http://localhost:3000"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
MINIO_ENDPOINT="s3.ejemplo.com"
MINIO_ACCESS_KEY=""
MINIO_SECRET_KEY=""
MINIO_BUCKET="bucket-compartido"
MINIO_USE_SSL="true"
MINIO_FORCE_PATH_STYLE="false"
NEXT_PUBLIC_IMGPROXY_URL="https://images.ejemplo.com"
SEED_DEFAULT_PASSWORD="contraseña-temporal"
SEED_IMAGE_SOURCE_BUCKET="bucket-compartido"
SEED_IMAGE_SOURCE_KEYS="imagen1.webp,imagen2.webp,imagen3.webp,imagen4.webp,imagen5.webp,imagen6.webp"
```

`SEED_IMAGE_SOURCE_KEYS` es opcional. Cada imagen se copia una sola vez a una clave estable; las siguientes ejecuciones solamente verifican su existencia.

## Comandos

```bash
bun run dev          # desarrollo
bun run build        # compilar producción
bun run start        # servir build
bun run typecheck    # comprobar TypeScript
bun run lint         # comprobar estilo
bunx vitest run      # ejecutar pruebas

bun run db:generate  # regenerar Prisma Client
bun run db:setup     # crear/sincronizar tablas SQLite
bun run db:seed      # usuarios y datos de demostración idempotentes
bun run db:studio    # explorar la base de datos
```

## Docker

Crear `.env.production` con las variables anteriores y usar una ruta absoluta para SQLite:

```dotenv
DATABASE_URL="file:/data/techtrack.db"
```

Luego:

```bash
mkdir -p data
docker compose up -d --build
docker compose ps
docker compose logs -f techtrack
```

El contenedor publica la app solamente en `127.0.0.1:3100`; Caddy debe ser el único punto público:

```caddyfile
techtrack.ejemplo.com {
    reverse_proxy 127.0.0.1:3100
}
```

Operación habitual:

```bash
docker compose restart techtrack
docker compose pull
docker compose up -d --build
docker compose exec techtrack bun run db:seed
docker compose exec techtrack bun run db:studio
```

## Datos del seed

El seed crea cuentas administrativas del equipo, una cuenta `tecnico@techtrack.dev`, cuatro clientes y seis órdenes en diferentes estados. La contraseña inicial es `SEED_DEFAULT_PASSWORD`; debe cambiarse después de la demostración.
