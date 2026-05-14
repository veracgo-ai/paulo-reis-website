// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - tanstackStart, viteReact, tailwindcss, tsConfigPaths, cloudflare (build-only),
//     componentTagger (dev-only), VITE_* env injection, @ path alias, React/TanStack dedupe,
//     error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... } }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

const isRailwayBuild = process.env.RAILWAY_BUILD === "1";

// Keep Lovable's preview/publish runtime on the default adapter. Only Docker
// builds for Railway switch to the Node server target.
export default defineConfig(
  isRailwayBuild
    ? {
        cloudflare: false,
        tanstackStart: {
          target: "node-server",
        },
      }
    : {},
);
