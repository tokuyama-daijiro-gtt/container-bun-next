# syntax=docker/dockerfile:1.7

FROM oven/bun:1.4.3-debian AS base
WORKDIR /workspace

FROM mcr.microsoft.com/devcontainers/base:debian AS development
COPY --from=base /usr/local/bin/bun /usr/local/bin/bun
RUN ln -sf /usr/local/bin/bun /usr/local/bin/bunx \
    && ln -sf /usr/local/bin/bun /usr/bin/bun \
    && ln -sf /usr/local/bin/bun /usr/bin/bunx \
    && /usr/bin/bun --version
ENV PATH="/usr/local/bin:/usr/bin:${PATH}"
WORKDIR /workspace
CMD ["sleep", "infinity"]

FROM base AS builder
COPY package.json bun.lock ./
COPY apps/web/package.json apps/web/package.json
COPY apps/api/package.json apps/api/package.json
RUN --mount=type=secret,id=zscaler_cert,required=false \
    if [ -f /run/secrets/zscaler_cert ]; then \
      NODE_EXTRA_CA_CERTS=/run/secrets/zscaler_cert bun install --frozen-lockfile; \
    else \
      bun install --frozen-lockfile; \
    fi
COPY . .
RUN bun run build

FROM node:22-bookworm-slim AS production
ENV NODE_ENV=production \
    HOSTNAME=0.0.0.0 \
    PORT=3000 \
    API_HOST=127.0.0.1 \
    API_PORT=3001 \
    API_BASE_URL=http://127.0.0.1:3001
WORKDIR /app
COPY --from=builder --chown=node:node /workspace/apps/web/.next/standalone ./
COPY --from=builder --chown=node:node /workspace/apps/web/.next/static ./apps/web/.next/static
COPY --from=builder --chown=node:node /workspace/apps/web/public ./apps/web/public
COPY --from=builder --chown=node:node /workspace/apps/api/dist/index.js ./apps/api/index.js
COPY --chown=node:node scripts/start-production.mjs ./scripts/start-production.mjs
USER node
EXPOSE 3000
CMD ["node", "scripts/start-production.mjs"]
