// The arithmetic on hand-checkable cases.

import { test } from "node:test";
import assert from "node:assert/strict";
import { parseProgram } from "../src/parse.mjs";
import { answer, bareNumber, ranking, run } from "../src/model.mjs";

// Cost 1,000 per person. 60% placed, 40% would have found work anyway,
// so the program adds 0.2 of a job per person: 1,000 / 0.2 = 5,000 per job.
const simple = parseProgram(`
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

test("the likely answer is cost over added outcome", () => {
  assert.equal(Math.round(answer(simple, (b) => b.likely)), 5000);
});

test("the bare number ignores the comparison group", () => {
  // 1,000 / 0.6
  assert.equal(Math.round(bareNumber(simple)), 1667);
});

test("a run where the program adds nothing has no finite answer", () => {
  const v = (b) => (b.kind === "without program" ? 0.6 : b.likely);
  assert.equal(answer(simple, v), Infinity);
});

test("the ranking puts the widest swing first and keeps both ends", () => {
  const r = ranking(simple);
  // Placed: at 50% adds 0.1 -> 10,000, at 70% adds 0.3 -> 3,333. Span 6,667.
  // Found work anyway: at 30% adds 0.3 -> 3,333, at 50% adds 0.1 -> 10,000. Span 6,667.
  // Staff: 800 / 0.2 = 4,000, 1,200 / 0.2 = 6,000. Span 2,000.
  assert.equal(r[2].block.label, "Staff");
  assert.equal(Math.round(r[2].atLow), 4000);
  assert.equal(Math.round(r[2].atHigh), 6000);
  assert.ok(r[0].span > r[2].span);
});

test("outcome size scales the answer", () => {
  const p = { ...simple, header: { ...simple.header, outcomeSize: 1000 } };
  assert.equal(Math.round(answer(p, (b) => b.likely)), 5000000);
});

test("cost avoided comes off the cost and a count check comes off the result", () => {
  const p = parseProgram(`
program: Example
outcome: one added job
[cost] Staff
low: 1,000
likely: 1,000
high: 1,000
source: budget
[cost avoided] Services the comparison group used
low: 200
likely: 200
high: 200
source: study
[added by program] Added
low: 10%
likely: 20%
high: 30%
source: study
[count check] Survey trust
low: 50%
likely: 50%
high: 50%
source: judgment
`);
  // (1,000 - 200) / (0.2 x 0.5) = 8,000
  assert.equal(Math.round(answer(p, (b) => b.likely)), 8000);
});

test("run is deterministic and reports the share of no-answer runs", () => {
  const a = run(simple, { draws: 2000, seed: 3 });
  const b = run(simple, { draws: 2000, seed: 3 });
  assert.equal(a.p50, b.p50);
  assert.equal(a.state, "ranged");
  assert.ok(a.p10 < a.p50 && a.p50 < a.p90);
  assert.equal(a.noAnswerShare, 0);
});

test("run refuses when most runs add nothing", () => {
  const p = parseProgram(`
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
  const r = run(p, { draws: 2000, seed: 3 });
  assert.equal(r.state, "refused");
  assert.ok(r.noAnswerShare >= 0.5);
});
