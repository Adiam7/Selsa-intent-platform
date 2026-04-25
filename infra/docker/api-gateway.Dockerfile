FROM node:20-alpine AS base
RUN corepack enable && corepack prepare pnpm@9 --activate

# ── Dependencies ────────────────────────────────────────────────────────────
FROM base AS deps
WORKDIR /app
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml* ./
COPY apps/api-gateway/package.json ./apps/api-gateway/
COPY libs/common-types/package.json ./libs/common-types/
COPY libs/constants/package.json ./libs/constants/
COPY libs/validation/package.json ./libs/validation/
COPY libs/event-schemas/package.json ./libs/event-schemas/
RUN pnpm install --frozen-lockfile --filter @intent/api-gateway...

# ── Build ───────────────────────────────────────────────────────────────────
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN pnpm --filter @intent/api-gateway build

# ── Production image ─────────────────────────────────────────────────────────
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder /app/apps/api-gateway/dist ./dist
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 3001
CMD ["node", "dist/main.js"]
