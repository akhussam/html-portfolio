# syntax=docker/dockerfile:1
# API image (NestJS). Build from the repo root:
#   docker build -f services/api/Dockerfile -t platform-api .
# The same image runs the API and, with `node dist/db/migrate.js`, the migrations.

FROM node:22-alpine AS base
RUN corepack enable
WORKDIR /repo

# Only the workspaces the API depends on (turbo prune keeps the lockfile consistent).
FROM base AS prune
COPY . .
RUN pnpm dlx turbo@2.11.7 prune @platform/api --docker --out-dir /out

FROM base AS build
COPY --from=prune /out/json/ .
COPY --from=prune /out/pnpm-lock.yaml ./pnpm-lock.yaml
RUN pnpm install --frozen-lockfile
COPY --from=prune /out/full/ .
COPY tsconfig.base.json ./
RUN pnpm turbo run build --filter=@platform/api
RUN pnpm --filter @platform/api deploy --prod --legacy /prod

FROM node:22-alpine AS runtime
ENV NODE_ENV=production PORT=3001
WORKDIR /app
COPY --from=build --chown=node:node /prod ./
USER node
EXPOSE 3001
HEALTHCHECK --interval=10s --timeout=3s --retries=5 CMD wget -qO- http://127.0.0.1:3001/health || exit 1
CMD ["node", "dist/main.js"]
