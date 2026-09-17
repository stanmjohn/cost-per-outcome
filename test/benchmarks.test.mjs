// The benchmark file keeps its promises: every entry carries its source,
// year, place, and limits, and a program file can override any value.

import { test } from "node:test";
import assert from "node:assert/strict";
import { loadBenchmarks, applyBenchmarks, REQUIRED_ENTRY_FIELDS, REQUIRED_POINT_FIELDS } from "../src/benchmarks.mjs";
import { parseProgram } from "../src/parse.mjs";

const benchmarks = loadBenchmarks();

test("every benchmark carries every required field", () => {
  assert.ok(benchmarks.length >= 2);
  for (const e of benchmarks) {
    for (const f of REQUIRED_ENTRY_FIELDS) assert.ok(e[f] != null && e[f] !== "", `${e.id ?? "?"} lacks ${f}`);
    assert.ok(e.low <= e.likely && e.likely <= e.high, `${e.id} range out of order`);
    assert.ok(e.points.length >= 1);
    for (const p of e.points) {
      for (const f of REQUIRED_POINT_FIELDS) assert.ok(p[f] != null && p[f] !== "", `${e.id} point lacks ${f}`);
      assert.ok(p.url.startsWith("https://"), `${e.id} point url`);
    }
  }
});

test("low and high never fall outside the points behind them", () => {
  for (const e of benchmarks) {
    const values = e.points.map((p) => p.value);
    assert.ok(e.low >= Math.min(...values), `${e.id} low below its lowest point`);
    assert.ok(e.high <= Math.max(...values), `${e.id} high above its highest point`);
  }
});

const file = `
program: Example
outcome: one added job
[cost] Staff
low: 100
likely: 100
high: 100
source: budget
[with program] Placed
low: 85%
likely: 90%
high: 95%
source: survey
[without program] Found work anyway
benchmark: comparison-group-employment
`;

test("a benchmark fills the block and is marked as used", () => {
  const p = applyBenchmarks(parseProgram(file), benchmarks);
  const b = p.blocks[2];
  assert.equal(b.likely, 0.796);
  assert.equal(b.benchmarkEntry.id, "comparison-group-employment");
  assert.deepEqual(b.overridden, []);
});

test("a value in the program file wins over the benchmark", () => {
  const p = applyBenchmarks(parseProgram(file + "likely: 70%\nlow: 60%\n"), benchmarks);
  const b = p.blocks[2];
  assert.equal(b.likely, 0.7);
  assert.equal(b.low, 0.6);
  assert.equal(b.high, 0.811);
  assert.deepEqual(b.overridden, ["low", "likely"]);
});

test("an unknown benchmark name is refused with the list", () => {
  assert.throws(() => applyBenchmarks(parseProgram(file.replace("comparison-group-employment", "nope")), benchmarks), /no benchmark named "nope"/);
});
