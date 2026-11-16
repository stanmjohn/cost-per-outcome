// The README pastes excerpts of committed briefs. Each excerpt sits between
// an "excerpt" comment that names its brief and a closing comment. Every
// line inside must appear, word for word, as a line of that brief, so the
// README cannot drift from what the tool prints.

import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const root = new URL("../", import.meta.url);
const readme = readFileSync(new URL("README.md", root), "utf8").replace(/\r\n/g, "\n");
const blocks = [...readme.matchAll(/<!-- excerpt (\S+) -->\n([\s\S]*?)<!-- \/excerpt -->/g)];

test("the README carries at least one excerpt of a committed brief", () => {
  assert.ok(blocks.length >= 1);
});

for (const [, path, body] of blocks) {
  test(`the README excerpt of ${path} matches the brief`, () => {
    const brief = readFileSync(fileURLToPath(new URL(path, root)), "utf8").replace(/\r\n/g, "\n").split("\n");
    for (const line of body.split("\n").filter((l) => l.trim() !== "")) {
      assert.ok(brief.includes(line), `not in ${path}: ${line}`);
    }
  });
}
