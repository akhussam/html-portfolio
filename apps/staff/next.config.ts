import { join } from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Self-contained server for the Docker image (infra/compose); traced from the monorepo root.
  output: "standalone",
  outputFileTracingRoot: join(import.meta.dirname, "..", ".."),
  // Workspace packages ship TypeScript source; Next compiles them.
  transpilePackages: [
    "@platform/ui",
    "@platform/panel-guide",
    "@platform/panel-admin",
    "@platform/panel-author",
    "@platform/panel-ops",
  ],
};

export default nextConfig;
