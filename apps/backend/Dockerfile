# ===== 共通ベース =====
FROM node:24.11-slim AS base
WORKDIR /app
ENV NODE_ENV=production
RUN corepack enable

# ===== 依存インストール =====
FROM base AS deps
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY apps/backend/package.json apps/backend/package.json
COPY apps/frontend/package.json apps/frontend/package.json
COPY packages ./packages
RUN pnpm install

# ===== 開発用（docker-compose 用） =====
FROM base AS dev
ENV NODE_ENV=development
WORKDIR /app
COPY . .
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/backend/node_modules ./apps/backend/node_modules
EXPOSE 4000
CMD ["pnpm", "--filter", "./apps/backend", "dev"]

# ===== ビルド用 =====
FROM base AS builder
WORKDIR /app
COPY . .
COPY --from=deps /app/node_modules ./node_modules
RUN pnpm --filter ./apps/backend build

# ===== 本番実行用 =====
FROM base AS runner
ENV NODE_ENV=production
WORKDIR /app
COPY --from=builder /app/apps/backend/dist ./apps/backend/dist
COPY --from=deps /app/node_modules ./node_modules
WORKDIR /app/apps/backend
EXPOSE 4000
CMD ["node", "dist/index.js"]
