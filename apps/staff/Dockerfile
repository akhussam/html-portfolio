# syntax=docker/dockerfile:1
# Staff app image (Next.js standalone server). Build from the repo root:
#   docker build -f apps/staff/Dockerfile -t platform-staff .

FROM node:22-alpine AS base
RUN corepack enable
WORKDIR /repo

FROM base AS prune
COPY . .
RUN pnpm dlx turbo@2.11.7 prune @platform/staff --docker --out-dir /out

FROM base AS build
COPY --from=prune /out/json/ .
COPY --from=prune /out/pnpm-lock.yaml ./pnpm-lock.yaml
RUN pnpm install --frozen-lockfile
COPY --from=prune /out/full/ .
COPY tsconfig.base.json ./
ENV NEXT_TELEMETRY_DISABLED=1
RUN pnpm turbo run build --filter=@platform/staff

FROM node:22-alpine AS runtime
ENV NODE_ENV=production NEXT_TELEMETRY_DISABLED=1 HOSTNAME=0.0.0.0 PORT=3000
WORKDIR /app
COPY --from=build --chown=node:node /repo/apps/staff/.next/standalone ./
COPY --from=build --chown=node:node /repo/apps/staff/.next/static ./apps/staff/.next/static
USER node
EXPOSE 3000
HEALTHCHECK --interval=10s --timeout=3s --retries=5 CMD wget -qO- http://127.0.0.1:3000/guide >/dev/null || exit 1
CMD ["node", "apps/staff/server.js"]
