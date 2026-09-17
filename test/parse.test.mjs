// The program file reader. Good files parse, bad files name their line.

import { test } from "node:test";
import assert from "node:assert/strict";
import { parseProgram, number } from "../src/parse.mjs";

const good = `
program: Example
outcome: one added job
[cost] Staff
low: $4,000
likely: 5,000
high: 6,000
source: budget
[with program] Placed
low: 60%
likely: 70%
high: 80%
source: survey
[without program] Found work anyway
low: 50%
likely: 55%
high: 60%
source: study
`;

test("numbers accept dollars, commas, and percents", () => {
  assert.equal(number("$4,000", 1), 4000);
  assert.equal(number("12%", 1), 0.12);
  assert.equal(number("-2.1%", 1), -0.021);
  assert.throws(() => number("four", 9), /Line 9/);
});

test("a good file parses into header and blocks", () => {
  const p = parseProgram(good);
  assert.equal(p.header.program, "Example");
  assert.equal(p.blocks.length, 3);
  assert.equal(p.blocks[0].low, 4000);
  assert.equal(p.blocks[1].likely, 0.7);
  assert.equal(p.header.outcomeSize, 1);
});

test("a block missing its range is refused with its line number", () => {
  const bad = good.replace("high: 6,000\n", "");
  assert.throws(() => parseProgram(bad), /Line 4.*needs low, likely, and high/);
});

test("a block with no source is refused", () => {
  const bad = good.replace("source: budget\n", "");
  assert.throws(() => parseProgram(bad), /has no source/);
});

test("a file with no comparison is refused", () => {
  const bad = good.slice(0, good.indexOf("[without program]"));
  assert.throws(() => parseProgram(bad), /bare number/);
});

test("an unknown block or key names itself and the allowed list", () => {
  assert.throws(() => parseProgram(good.replace("[cost]", "[price]")), /"\[price\]" is not a block/);
  assert.throws(() => parseProgram(good.replace("source: budget", "cite: budget")), /"cite" is not a field/);
});

test("low, likely, high must run in order", () => {
  assert.throws(() => parseProgram(good.replace("likely: 5,000", "likely: 7,000")), /must run in that order/);
});
