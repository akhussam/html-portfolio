/**
 * Architecture boundary rules (CLAUDE.md rule 3: boundaries are real from day one).
 * Run: pnpm lint:boundaries. Each rule is proven to block a violation by
 * tools/boundaries/boundaries.test.mjs (pnpm test:boundaries).
 */
/** @type {import('dependency-cruiser').IConfiguration} */
module.exports = {
  forbidden: [
    {
      name: "api-module-boundary",
      severity: "error",
      comment:
        "An API module may not reach into another module's internals. " +
        "Use the other module's public index.ts (and, for data, its API or events).",
      from: { path: "^services/api/src/modules/([^/]+)/" },
      to: {
        path: "^services/api/src/modules/[^/]+/",
        pathNot: ["^services/api/src/modules/$1/", "^services/api/src/modules/[^/]+/index\\.ts$"],
      },
    },
    {
      name: "panel-isolation",
      severity: "error",
      comment: "Each control panel is its own package (seam register) and may not import another panel.",
      from: { path: "^packages/(panel-[^/]+)/" },
      to: { path: "^packages/panel-[^/]+/", pathNot: "^packages/$1/" },
    },
    {
      name: "apps-not-into-services",
      severity: "error",
      comment: "Apps talk to services only over contracts (HTTP/GraphQL), never by import.",
      from: { path: "^apps/" },
      to: { path: "^services/" },
    },
    {
      name: "services-not-into-apps",
      severity: "error",
      comment: "Services never import app code.",
      from: { path: "^services/" },
      to: { path: "^apps/" },
    },
    {
      name: "services-isolated",
      severity: "error",
      comment: "A service may not import another service's code; use contracts.",
      from: { path: "^services/([^/]+)/" },
      to: { path: "^services/", pathNot: "^services/$1/" },
    },
    {
      name: "apps-isolated",
      severity: "error",
      comment: "An app may not import another app's code; share through packages.",
      from: { path: "^apps/([^/]+)/" },
      to: { path: "^apps/", pathNot: "^apps/$1/" },
    },
    {
      name: "packages-not-into-apps-or-services",
      severity: "error",
      comment: "Shared packages must not depend on apps or services.",
      from: { path: "^packages/" },
      to: { path: "^(apps|services)/" },
    },
    {
      name: "student-app-no-panels",
      severity: "error",
      comment: "Staff panels are not part of the student app.",
      from: { path: "^apps/student/" },
      to: { path: "^packages/panel-" },
    },
    {
      name: "ui-no-panels",
      severity: "error",
      comment: "@platform/ui is the base layer; it may not import panels.",
      from: { path: "^packages/ui/" },
      to: { path: "^packages/panel-" },
    },
    {
      name: "contracts-standalone",
      severity: "error",
      comment: "Contracts are the bottom layer and import no other workspace package.",
      from: { path: "^packages/contracts/" },
      to: { path: "^(apps|services|packages/(?!contracts/))" },
    },
    {
      name: "no-unresolvable",
      severity: "error",
      comment: "Every import must resolve; an import of an undeclared workspace package is not allowed.",
      from: {},
      to: { couldNotResolve: true },
    },
    {
      name: "no-circular",
      severity: "error",
      from: {},
      to: { circular: true },
    },
  ],
  options: {
    doNotFollow: { path: "node_modules" },
    exclude: { path: ["(^|/)(node_modules|dist|\\.next|\\.expo|\\.turbo|coverage|\\.venv)/", "next-env\\.d\\.ts$"] },
    tsPreCompilationDeps: true,
    tsConfig: { fileName: "tsconfig.base.json" },
    enhancedResolveOptions: {
      exportsFields: ["exports"],
      mainFields: ["module", "main", "types", "typings"],
      conditionNames: ["import", "require", "node", "default", "types"],
      extensions: [".ts", ".tsx", ".js", ".mjs", ".cjs", ".json"],
    },
  },
};
