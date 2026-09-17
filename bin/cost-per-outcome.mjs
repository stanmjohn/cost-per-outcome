#!/usr/bin/env node
// cost-per-outcome <program.txt> [--stdout | --out file.md] [--draws n] [--seed n]
// cost-per-outcome benchmarks
//
// One program file in, one markdown brief out. No server, no key, no account.

import { readFileSync, writeFileSync } from "node:fs";
import { parseProgram } from "../src/parse.mjs";
import { loadBenchmarks, applyBenchmarks, benchmarksPage } from "../src/benchmarks.mjs";
import { run } from "../src/model.mjs";
import { report } from "../src/report.mjs";

const args = process.argv.slice(2);

function usage(code) {
  console.log(`Usage:
  cost-per-outcome <program.txt>              Write the brief beside the file, as <program>.md
  cost-per-outcome <program.txt> --stdout     Print the brief instead
  cost-per-outcome <program.txt> --out x.md   Write to a chosen path
  cost-per-outcome benchmarks                 Print the benchmark file as a readable page

Options:
  --draws n   Number of runs, default 20000
  --seed n    Seed for the random draws, default 20260917`);
  process.exitCode = code;
}

function flag(name) {
  const i = args.indexOf(name);
  return i !== -1 && args[i + 1] ? args[i + 1] : null;
}

/** Program file text in, brief markdown out. */
export function build(text, options = {}) {
  const program = applyBenchmarks(parseProgram(text), loadBenchmarks());
  return report(program, run(program, options));
}

function main() {
  if (args.length === 0 || args[0] === "--help" || args[0] === "-h") return usage(args.length ? 0 : 1);
  if (args[0] === "benchmarks") return console.log(benchmarksPage(loadBenchmarks()));

  const path = args[0];
  let text;
  try {
    text = readFileSync(path, "utf8");
  } catch {
    console.error(`Cannot read "${path}". Check the path.`);
    process.exitCode = 1;
    return;
  }

  const options = {};
  if (flag("--draws")) options.draws = Number(flag("--draws"));
  if (flag("--seed")) options.seed = Number(flag("--seed"));

  let md;
  try {
    md = build(text, options);
  } catch (e) {
    console.error(e.message);
    process.exitCode = 1;
    return;
  }

  if (args.includes("--stdout")) return console.log(md);
  const out = flag("--out") ?? path.replace(/\.[^./\\]+$/, "") + ".md";
  writeFileSync(out, md, "utf8");
  console.log(`Wrote ${out}`);
}

// Run only when called from the command line, so tests can import build().
import { fileURLToPath } from "node:url";
import { resolve } from "node:path";
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main();
