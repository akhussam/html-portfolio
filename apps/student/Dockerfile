# syntax=docker/dockerfile:1
# Student app image: the Expo web export served as static files (React Native Web seam).
# Build from the repo root:
#   docker build -f apps/student/Dockerfile -t platform-student .

FROM node:22-alpine AS base
RUN corepack enable
WORKDIR /repo

FROM base AS prune
COPY . .
RUN pnpm dlx turbo@2.11.7 prune @platform/student --docker --out-dir /out

FROM base AS build
COPY --from=prune /out/json/ .
COPY --from=prune /out/pnpm-lock.yaml ./pnpm-lock.yaml
RUN pnpm install --frozen-lockfile
COPY --from=prune /out/full/ .
COPY tsconfig.base.json ./
ENV EXPO_NO_TELEMETRY=1
RUN pnpm turbo run build --filter=@platform/student

FROM nginx:1.29-alpine AS runtime
COPY apps/student/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /repo/apps/student/dist /usr/share/nginx/html
EXPOSE 80
HEALTHCHECK --interval=10s --timeout=3s --retries=5 CMD wget -qO- http://127.0.0.1/ >/dev/null || exit 1
