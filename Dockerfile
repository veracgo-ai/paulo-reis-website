# syntax=docker/dockerfile:1.7

# ---------- Build stage ----------
FROM oven/bun:1.1 AS builder
WORKDIR /app

# Install dependencies first (better layer cache).
COPY package.json bun.lockb* package-lock.json* ./
RUN bun install --frozen-lockfile || bun install

# Copy the rest of the source and build.
COPY . .

# Build-time env vars are inlined into the client bundle by Vite.
# Defaults keep self-hosted Docker deploys working even when the host does not
# forward variables as Docker build args. These are publishable Lovable Cloud
# values, not private secrets.
ARG VITE_SUPABASE_URL=https://qlxdidtestxifqcovezs.supabase.co
ARG VITE_SUPABASE_PUBLISHABLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJIc2ViYXNlIiwicmVmIjoicWx4ZGlkdGVzdHhpZnFjb3ZlenMiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTc3NjM2MjcxMCwiZXhwIjoyMDkxOTM4NzEwfQ._VCG2XSOl9GgcrsGStVtxl2Fdc2OArt-35s70BiaVOA
ARG VITE_SUPABASE_PROJECT_ID=qlxdidtestxifqcovezs
ENV VITE_SUPABASE_URL=$VITE_SUPABASE_URL
ENV VITE_SUPABASE_PUBLISHABLE_KEY=$VITE_SUPABASE_PUBLISHABLE_KEY
ENV VITE_SUPABASE_PROJECT_ID=$VITE_SUPABASE_PROJECT_ID

RUN bun run build

# ---------- Runtime stage ----------
FROM node:22-slim AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV SUPABASE_URL=https://qlxdidtestxifqcovezs.supabase.co
ENV SUPABASE_PUBLISHABLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJIc2ViYXNlIiwicmVmIjoicWx4ZGlkdGVzdHhpZnFjb3ZlenMiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTc3NjM2MjcxMCwiZXhwIjoyMDkxOTM4NzEwfQ._VCG2XSOl9GgcrsGStVtxl2Fdc2OArt-35s70BiaVOA

# Copy only what we need at runtime.
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/package-lock.json* ./
COPY --from=builder /app/server-node.mjs ./server-node.mjs
COPY --from=builder /app/dist ./dist

# Reinstall production dependencies cleanly with npm in the Node runtime image.
# This avoids any Bun-specific node_modules layout issues.
RUN npm install --omit=dev --no-audit --no-fund || npm install --omit=dev --no-audit --no-fund --legacy-peer-deps

EXPOSE 3000
ENV PORT=3000
CMD ["node", "--enable-source-maps", "server-node.mjs"]