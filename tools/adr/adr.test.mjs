// Keeps docs/adr consistent: sequential numbering from 001, required sections,
// a valid status, and every ADR listed in docs/adr/README.md.
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, it } from "node:test";
import assert from "node:assert/strict";

const dir = join(import.meta.dirname, "..", "..", "docs", "adr");
const files = readdirSync(dir)
  .filter((f) => /^\d{3}-.+\.md$/.test(f))
  .sort();
const index = readFileSync(join(dir, "README.md"), "utf8");

describe("ADRs", () => {
  it("are numbered sequentially from 001", () => {
    assert.ok(files.length > 0, "no ADRs found");
    files.forEach((f, i) => assert.equal(f.slice(0, 3), String(i + 1).padStart(3, "0"), f));
  });

  for (const file of files) {
    const num = file.slice(0, 3);
    const text = readFileSync(join(dir, file), "utf8");

    it(`${file} has a matching title, status and required sections`, () => {
      assert.match(text, new RegExp(`^# ADR-${num}: \\S`), "title must be '# ADR-NNN: ...'");
      assert.match(text, /^- \*\*Status:\*\* (Proposed|Accepted|Superseded by ADR-\d{3})$/m);
      assert.match(text, /^- \*\*Date:\*\* \d{4}-\d{2}-\d{2}$/m);
      for (const section of ["Context", "Decision", "Consequences"]) {
        assert.match(text, new RegExp(`^## ${section}$`, "m"), `missing '## ${section}'`);
      }
    });

    it(`${file} is listed in the index with its status`, () => {
      const status = text.match(/^- \*\*Status:\*\* (.+)$/m)[1];
      const row = index.split("\n").find((l) => l.includes(`](${file})`));
      assert.ok(row, `${file} missing from docs/adr/README.md`);
      assert.ok(row.includes(status), `index status for ${file} should be '${status}'`);
    });
  }
});
