# syntax=docker/dockerfile:1.7

# ---------- Build stage ----------
FROM oven/bun:1.1 AS builder
WORKDIR /app

# Install dependencies first (better layer cache).
COPY package.json bun.lockb* package-lock.json* ./
RUN bun install --frozen-lockfile || bun install

# Copy the rest of the source and build.
COPY . .

# Build-time env vars must be present (VITE_* are inlined into the client bundle).
ARG VITE_SUPABASE_URL
ARG VITE_SUPABASE_PUBLISHABLE_KEY
ARG VITE_SUPABASE_PROJECT_ID
ENV VITE_SUPABASE_URL=$VITE_SUPABASE_URL
ENV VITE_SUPABASE_PUBLISHABLE_KEY=$VITE_SUPABASE_PUBLISHABLE_KEY
ENV VITE_SUPABASE_PROJECT_ID=$VITE_SUPABASE_PROJECT_ID

RUN bun run build

# ---------- Runtime stage ----------
FROM node:22-slim AS runner
WORKDIR /app
ENV NODE_ENV=production

# Copy only what we need at runtime.
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/server-node.mjs ./server-node.mjs
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 3000
ENV PORT=3000
CMD ["node", "server-node.mjs"]