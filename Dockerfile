FROM oven/bun:1.3.14-slim AS dependencies
WORKDIR /app
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

FROM dependencies AS build
COPY . .
ENV DATABASE_URL="file:/tmp/techtrack-build.db"
RUN bun run db:generate && bun run build

FROM oven/bun:1.3.14-slim AS runtime
WORKDIR /app
ENV NODE_ENV="production" PORT="3000" HOSTNAME="0.0.0.0"
COPY --from=dependencies /app/node_modules ./node_modules
COPY --from=build /app/package.json /app/bun.lock /app/prisma.config.ts /app/tsconfig.json ./
COPY --from=build /app/prisma ./prisma
COPY --from=build /app/generated ./generated
COPY --from=build /app/.next ./.next
COPY --from=build /app/public ./public
COPY --from=build /app/lib ./lib
CMD ["sh", "-c", "bunx prisma db push && bun run db:seed && bun run start"]
