# ===== 共通ベース =====
FROM node:24.11-slim AS base
WORKDIR /app

ENV HOME=/app
ENV COREPACK_HOME=/app/.cache/node/corepack
ENV NODE_ENV=production

# Corepack のキャッシュディレクトリを作成（ビルド時は root 所有でOK）
RUN mkdir -p /app/.cache/node/corepack

# pnpm を使う
RUN corepack enable

# ===== 依存インストール =====
FROM base AS deps
# 依存解決に必要なファイルだけコピー
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY apps/frontend/package.json apps/frontend/package.json
COPY apps/backend/package.json apps/backend/package.json
COPY packages ./packages
RUN pnpm install

# ===== 開発用イメージ（docker-compose 用） =====
FROM base AS dev
ENV NODE_ENV=development
WORKDIR /app
# ソースコードを全部コピー
COPY . .
# 依存関係をコピー
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/frontend/node_modules ./apps/frontend/node_modules
EXPOSE 3000
# monorepo 内の frontend を dev 起動
CMD ["pnpm", "--filter", "./apps/frontend", "dev"]

# ===== ビルド用（本番ビルド） =====
FROM base AS builder
WORKDIR /app
COPY . .
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/frontend/node_modules ./apps/frontend/node_modules
# Next.js をビルド
RUN pnpm --filter ./apps/frontend build

# ===== 本番実行用（ECS 用など） =====
FROM base AS runner
ENV NODE_ENV=production
WORKDIR /app

# ★ 実行ユーザのホームを /app にする
RUN addgroup --system nodejs \
 && adduser --system --home /app --ingroup nodejs nextjs

# ★ Corepack キャッシュ含め /app 配下を nextjs に所有させる
RUN mkdir -p /app/.cache/node/corepack \
 && chown -R nextjs:nodejs /app


# ビルド成果物と package.json だけコピー
COPY --from=builder /app/apps/frontend ./apps/frontend
COPY --from=deps /app/node_modules ./node_modules

WORKDIR /app/apps/frontend
EXPOSE 3000
CMD ["pnpm", "start"]
