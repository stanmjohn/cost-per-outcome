// The command reads one program file at a time and refuses a second one
// with a plain message, rather than dropping it without a word.

import { test } from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { ONE_FILE } from "../bin/cost-per-outcome.mjs";

const bin = fileURLToPath(new URL("../bin/cost-per-outcome.mjs", import.meta.url));
const example = (name) => fileURLToPath(new URL(`../examples/${name}`, import.meta.url));

function cli(...args) {
  return spawnSync(process.execPath, [bin, ...args], { encoding: "utf8" });
}

test("a second program file is refused with a plain message", () => {
  const r = cli(example("made-up-training-jobs.txt"), example("made-up-training-earnings.txt"), "--stdout");
  assert.equal(r.status, 1);
  assert.equal(r.stdout, "");
  assert.ok(r.stderr.includes(ONE_FILE));
});

test("one program file with options still prints its brief", () => {
  const r = cli(example("made-up-training-jobs.txt"), "--stdout", "--draws", "500");
  assert.equal(r.status, 0);
  assert.ok(r.stdout.startsWith("# Cost per outcome:"));
});
