import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
