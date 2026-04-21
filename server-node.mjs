// Node.js server wrapper for the TanStack Start build output.
// Used by Railway / Docker / any Node host. The build (`bun run build`) produces:
//   - dist/server/server.js  -> Web-style fetch handler (export default { fetch })
//   - dist/client/           -> static assets + index.html shell
// This wrapper serves the static assets first, then falls back to the SSR handler.

import { serve } from "@hono/node-server";
import { serveStatic } from "@hono/node-server/serve-static";
import { Hono } from "hono";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const clientDir = join(__dirname, "dist", "client");
const serverEntry = join(__dirname, "dist", "server", "server.js");

const mod = await import(serverEntry);
const handler = mod.default ?? mod.server;

if (!handler || typeof handler.fetch !== "function") {
  throw new Error(
    "Could not find a fetch handler in dist/server/server.js. Did `bun run build` succeed?"
  );
}

const app = new Hono();

// Serve hashed/static assets from the client build.
app.use(
  "/assets/*",
  serveStatic({ root: "./dist/client" })
);

// Serve any other top-level static files (favicon, robots.txt, images, etc.).
app.use(
  "*",
  serveStatic({
    root: "./dist/client",
    // Skip directories — let the SSR handler take over for HTML routes.
    onFound: (_path, c) => {
      c.header("Cache-Control", "public, max-age=3600");
    },
  })
);

// Fallback: hand every other request to the TanStack Start SSR handler.
app.all("*", (c) => handler.fetch(c.req.raw));

const port = Number(process.env.PORT) || 3000;

serve({ fetch: app.fetch, port, hostname: "0.0.0.0" }, (info) => {
  console.log(`✅ Server listening on http://0.0.0.0:${info.port}`);
});

// Suppress noisy file-not-found errors from the static middleware so the
// SSR fallback can handle unknown routes cleanly.
process.on("unhandledRejection", (err) => {
  if (err && typeof err === "object" && "code" in err && err.code === "ENOENT") return;
  console.error("Unhandled rejection:", err);
});

console.log("Client dir:", clientDir);
console.log("Server entry:", serverEntry);