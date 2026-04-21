// Node.js server wrapper for the TanStack Start build output.
// Heavily instrumented so failures on Railway are visible in the logs.

import { serve } from "@hono/node-server";
import { serveStatic } from "@hono/node-server/serve-static";
import { Hono } from "hono";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { existsSync, statSync, readdirSync } from "node:fs";

const log = (...args) => console.log("[server]", ...args);
const errlog = (...args) => console.error("[server][ERROR]", ...args);

log("Boot starting. Node:", process.version, "PID:", process.pid);
log("CWD:", process.cwd());
log("ENV PORT:", process.env.PORT, "NODE_ENV:", process.env.NODE_ENV);
log(
  "Has VITE_SUPABASE_URL:",
  !!process.env.VITE_SUPABASE_URL,
  "Has SUPABASE_URL:",
  !!process.env.SUPABASE_URL,
);

const __dirname = dirname(fileURLToPath(import.meta.url));
const clientDir = join(__dirname, "dist", "client");
const serverEntry = join(__dirname, "dist", "server", "server.js");

log("__dirname:", __dirname);
log("clientDir:", clientDir, "exists:", existsSync(clientDir));
log("serverEntry:", serverEntry, "exists:", existsSync(serverEntry));

if (existsSync(clientDir)) {
  try {
    log("clientDir contents:", readdirSync(clientDir).slice(0, 20));
  } catch (err) {
    errlog("Failed to read clientDir:", err);
  }
}

if (!existsSync(serverEntry)) {
  errlog(
    "FATAL: dist/server/server.js is missing. The build did not produce a server bundle.",
  );
  process.exit(1);
}

let handler;
try {
  log("Importing server entry...");
  const mod = await import(serverEntry);
  log("Server entry imported. Exports:", Object.keys(mod));
  handler = mod.default ?? mod.server;
  if (!handler || typeof handler.fetch !== "function") {
    errlog(
      "FATAL: server entry has no fetch handler. default keys:",
      handler && Object.keys(handler),
    );
    process.exit(1);
  }
  log("Handler ready (typeof fetch =", typeof handler.fetch, ")");
} catch (err) {
  errlog("FATAL while importing server entry:", err);
  process.exit(1);
}

const app = new Hono();

// Log every incoming request so we can see what Railway is sending us.
app.use("*", async (c, next) => {
  const start = Date.now();
  log("→", c.req.method, c.req.url);
  try {
    await next();
    log("←", c.res.status, c.req.method, c.req.url, `${Date.now() - start}ms`);
  } catch (err) {
    errlog("Request handler threw:", err);
    throw err;
  }
});

// Static assets (hashed). These should always exist.
app.use("/assets/*", serveStatic({ root: "./dist/client" }));

// Other top-level static files (favicon, robots.txt, images...).
app.use(
  "*",
  serveStatic({
    root: "./dist/client",
    onFound: (_path, c) => {
      c.header("Cache-Control", "public, max-age=3600");
    },
  }),
);

// Everything else → TanStack Start SSR.
app.all("*", async (c) => {
  try {
    const res = await handler.fetch(c.req.raw);
    return res;
  } catch (err) {
    errlog("SSR handler threw for", c.req.url, err);
    return new Response(
      `SSR error: ${err?.message ?? String(err)}\n\n${err?.stack ?? ""}`,
      { status: 500, headers: { "Content-Type": "text/plain" } },
    );
  }
});

const port = Number(process.env.PORT) || 3000;
log("About to listen on 0.0.0.0:" + port);

try {
  serve({ fetch: app.fetch, port, hostname: "0.0.0.0" }, (info) => {
    log(`✅ Server listening on http://0.0.0.0:${info.port}`);
  });
} catch (err) {
  errlog("FATAL while starting HTTP server:", err);
  process.exit(1);
}

process.on("unhandledRejection", (err) => {
  if (err && typeof err === "object" && "code" in err && err.code === "ENOENT") {
    return; // noisy static-file misses
  }
  errlog("unhandledRejection:", err);
});

process.on("uncaughtException", (err) => {
  errlog("uncaughtException:", err);
});