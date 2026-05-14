# syntax=docker/dockerfile:1.7

# ---------- Dependencies stage ----------
# Vite 7 requires Node 20.19+ or 22.12+. The old Bun 1.1 image bundled
# Node 22.6, which makes Railway builds fail or hang while building the image.
FROM node:22.12-slim AS deps
WORKDIR /app
ENV npm_config_audit=false npm_config_fund=false

# Install dependencies first (better layer cache) using the committed npm lockfile.
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund

# ---------- Build stage ----------
FROM node:22.12-slim AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules

# Copy the rest of the source and build.
COPY . .

# Build-time env vars are inlined into the client bundle by Vite.
# Defaults keep self-hosted Docker deploys working even when the host does not
# forward variables as Docker build args. These are publishable Lovable Cloud
# values, not private secrets.
ARG VITE_SUPABASE_URL=https://qlxdidtestxifqcovezs.supabase.co
ARG VITE_SUPABASE_PUBLISHABLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJIc3ViYXNlIiwicmVmIjoicWx4ZGlkdGVzdHhpZnFjb3ZlenMiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTc3NjM2MjcxMCwiZXhwIjoyMDkxOTM4NzEwfQ._VCG2XSOl9GgcrsGStVtxl2Fdc2OArt-35s70BiaVOA
ARG VITE_SUPABASE_PROJECT_ID=qlxdidtestxifqcovezs
ENV VITE_SUPABASE_URL=$VITE_SUPABASE_URL
ENV VITE_SUPABASE_PUBLISHABLE_KEY=$VITE_SUPABASE_PUBLISHABLE_KEY
ENV VITE_SUPABASE_PROJECT_ID=$VITE_SUPABASE_PROJECT_ID

RUN npm run build
RUN npm prune --omit=dev --no-audit --no-fund

# ---------- Runtime stage ----------
FROM node:22.12-slim AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV SUPABASE_URL=https://qlxdidtestxifqcovezs.supabase.co
ENV SUPABASE_PUBLISHABLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJIc3ViYXNlIiwicmVmIjoicWx4ZGlkdGVzdHhpZnFjb3ZlenMiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTc3NjM2MjcxMCwiZXhwIjoyMDkxOTM4NzEwfQ._VCG2XSOl9GgcrsGStVtxl2Fdc2OArt-35s70BiaVOA

# Copy only what we need at runtime.
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/server-node.mjs ./server-node.mjs
COPY --from=builder /app/dist ./dist

EXPOSE 3000
ENV PORT=3000
CMD ["node", "--enable-source-maps", "server-node.mjs"]