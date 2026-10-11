// Proves each boundary rule in .dependency-cruiser.cjs blocks a real violation
// (step 0.2 "Done when": boundary rules block cross-module imports).
// Each case writes a temporary violating file, runs dependency-cruiser on it,
// expects a failure naming the rule, then deletes the file.
import { execFileSync } from "node:child_process";
import { rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { after, describe, it } from "node:test";
import assert from "node:assert/strict";

const root = join(import.meta.dirname, "..", "..");
const created = [];

function cruise(file) {
  try {
    execFileSync("pnpm", ["exec", "depcruise", file, "--config", ".dependency-cruiser.cjs"], {
      cwd: root,
      stdio: "pipe",
      encoding: "utf8",
    });
    return { failed: false, output: "" };
  } catch (err) {
    return { failed: true, output: `${err.stdout}${err.stderr}` };
  }
}

function probe(file, source) {
  const path = join(root, file);
  writeFileSync(path, source);
  created.push(path);
  return cruise(file);
}

after(() => created.forEach((p) => rmSync(p, { force: true })));

const violations = [
  {
    rule: "api-module-boundary",
    file: "services/api/src/modules/roster/__probe__.ts",
    source: 'export * from "../identity/identity.module.js";\n',
  },
  {
    rule: "panel-isolation",
    file: "packages/panel-guide/src/__probe__.ts",
    source: 'export * from "../../panel-admin/src/index.js";\n',
  },
  {
    rule: "apps-not-into-services",
    file: "apps/staff/app/__probe__.ts",
    source: 'export * from "../../../services/api/src/health.controller.js";\n',
  },
  {
    rule: "services-not-into-apps",
    file: "services/api/src/__probe__.ts",
    source: 'export * from "../../../apps/staff/app/page.js";\n',
  },
  {
    rule: "apps-isolated",
    file: "apps/student/__probe__.ts",
    source: 'export * from "../staff/app/page.js";\n',
  },
  {
    rule: "packages-not-into-apps-or-services",
    file: "packages/ui/src/__probe__.ts",
    source: 'export * from "../../../apps/staff/app/page.js";\n',
  },
  {
    rule: "student-app-no-panels",
    file: "apps/student/__probe__.ts",
    source: 'export * from "../../packages/panel-guide/src/index.js";\n',
  },
  {
    rule: "no-unresolvable",
    file: "apps/student/__probe__.ts",
    source: 'export * from "@platform/panel-guide";\n',
  },
  {
    rule: "ui-no-panels",
    file: "packages/ui/src/__probe__.ts",
    source: 'export * from "../../panel-ops/src/index.js";\n',
  },
  {
    rule: "contracts-standalone",
    file: "packages/contracts/src/__probe__.ts",
    source: 'export * from "../../ui/src/index.js";\n',
  },
];

describe("boundary rules block violations", () => {
  for (const { rule, file, source } of violations) {
    it(`${rule}: ${file}`, () => {
      const result = probe(file, source);
      rmSync(join(root, file), { force: true });
      assert.equal(result.failed, true, `expected ${rule} to fail the cruise`);
      assert.match(result.output, new RegExp(rule));
    });
  }

  it("allows a module to use another module's public index.ts", () => {
    const result = probe(
      "services/api/src/modules/roster/__probe__.ts",
      'export * from "../identity/index.js";\n',
    );
    rmSync(join(root, "services/api/src/modules/roster/__probe__.ts"), { force: true });
    assert.equal(result.failed, false, result.output);
  });
});
