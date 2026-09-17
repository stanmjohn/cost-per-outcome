// The brief is a document, so these tests pin the sentences that must
// never disappear: the range beside the number, the bare number labeled as
// such, the refusal, the benchmark named inline, and the missing-input flags.

import { test } from "node:test";
import assert from "node:assert/strict";
import { parseProgram } from "../src/parse.mjs";
import { loadBenchmarks, applyBenchmarks } from "../src/benchmarks.mjs";
import { run } from "../src/model.mjs";
import { report, money } from "../src/report.mjs";

function brief(text) {
  const p = applyBenchmarks(parseProgram(text), loadBenchmarks());
  return report(p, run(p, { draws: 2000, seed: 5 }));
}

const ranged = brief(`
program: Example
outcome: one added job
[cost] Staff
low: 800
likely: 1,000
high: 1,200
source: budget
[with program] Placed
low: 50%
likely: 60%
high: 70%
source: survey
[without program] Found work anyway
low: 30%
likely: 40%
high: 50%
source: study
`);

test("money prints three significant figures and words for no answer", () => {
  assert.equal(money(606.4), "$606");
  assert.equal(money(2341234), "$2,340,000");
  assert.equal(money(Infinity), "no finite answer");
});

test("the read never prints the number without its range", () => {
  assert.match(ranged, /costs about \*\*\$[\d,]+\*\* in the middle run\. The middle 80 percent of 2,000 runs fall between/);
});

test("the bare number is printed once and labeled as not the answer", () => {
  assert.ok(ranged.includes("## The bare number, and why it is not the answer"));
  assert.ok(ranged.includes("**$1,670** for one added job"));
});

test("the ranking names the assumption that moves the answer most", () => {
  assert.ok(ranged.includes("The assumption that moves the answer most is **"));
  assert.ok(ranged.includes("| Rank | Assumption | At its low | At its high |"));
});

test("missing inputs are flagged, not silently taken as fine", () => {
  assert.ok(ranged.includes("so the tool took it as 100 percent"));
  assert.ok(ranged.includes("so the tool took the count at face value"));
  assert.ok(ranged.includes("The file does not say when the result was measured."));
});

test("the refusal section ships in every brief", () => {
  assert.ok(ranged.includes("## What this brief refuses to do"));
  assert.ok(ranged.includes("It never prints a cost per outcome without a range."));
});

test("a benchmark is named inline and its points are listed", () => {
  const md = brief(`
program: Example
outcome: one added job
[cost] Staff
low: 1,000
likely: 1,000
high: 1,000
source: budget
[with program] Employed a year later
low: 90%
likely: 95%
high: 99%
source: survey
[without program] Found work anyway
benchmark: comparison-group-employment
`);
  assert.ok(md.includes("Benchmark `comparison-group-employment` from `benchmarks/workforce.json`."));
  assert.ok(md.includes("## Benchmarks this brief used"));
  assert.ok(md.includes("A benchmark is a default, never a fact."));
});

test("when most runs add nothing the brief refuses to print an estimate", () => {
  const md = brief(`
program: Example
outcome: one added job
[cost] Staff
low: 1,000
likely: 1,000
high: 1,000
source: budget
[with program] Placed
low: 50%
likely: 60%
high: 70%
source: survey
[without program] Found work anyway
low: 55%
likely: 65%
high: 75%
source: study
`);
  assert.ok(md.includes("**No estimate.**"));
  assert.ok(!md.includes("costs about **$"));
  assert.ok(md.includes("no assumption can be ranked in dollars"));
});

test("a made-up program is labeled at the top", () => {
  const md = brief(`
program: Example
outcome: one added job
made up: yes
[cost] Staff
low: 1,000
likely: 1,000
high: 1,000
source: budget
[with program] Placed
low: 90%
likely: 95%
high: 99%
source: survey
[without program] Found work anyway
low: 30%
likely: 40%
high: 50%
source: study
`);
  assert.ok(md.includes("**This program is made up.**"));
});
