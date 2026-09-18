# AGENTS.md

Instructions for an AI coding tool working in this repo. The README is for people and says what the tool is for. This file says how to change it without breaking its promises.

## What this is

A command line tool. A plain text file describing a workforce program goes in, a one-page markdown brief on its cost per outcome comes out. Node 20 or newer, ES modules, no dependencies, no build step, no network.

## Commands

```
npm test                                                              # all tests
node bin/cost-per-outcome.mjs examples/year-up-earnings.txt --stdout  # print a brief
node bin/cost-per-outcome.mjs examples/year-up-earnings.txt           # rewrite examples/year-up-earnings.md
node bin/cost-per-outcome.mjs benchmarks                              # print the benchmark page
```

Run the tests before and after any change.

## Layout

- `bin/cost-per-outcome.mjs` reads the arguments and writes the file. No logic lives here.
- `src/parse.mjs` reads the program file. Every error names the line it came from.
- `src/benchmarks.mjs` fills in any block that names a benchmark and marks it so the brief can name it.
- `src/model.mjs` does all the arithmetic.
- `src/simulate.mjs` holds the seeded draws and the summary statistics. It knows nothing about programs.
- `src/report.mjs` formats the brief. It computes nothing.
- `benchmarks/workforce.json` is the data. `benchmarks/workforce.md` is the same data as a readable page.
- `examples/` holds each program file as `.txt` with its committed brief as `.md`.

Keep that split. Math added to `report.mjs` or formatting added to `model.mjs` is a wrong change.

## Rules that must survive any edit

1. Add no dependencies. The standard library and `node:test` cover everything here.
2. Same file, same brief, byte for byte, on any machine. The seed is fixed, the brief carries no date, and `.gitattributes` holds line endings to LF. Do not add a timestamp, `Math.random`, or anything that reads the clock or the locale.
3. `test/examples.test.mjs` rebuilds every example and compares it to the committed file. A change to the math or the wording means rerunning each `examples/*.txt` and committing the new `.md` files in the same commit.
4. A run where the program added nothing is kept as the most expensive run. Never drop it, and keep reporting its share.
5. A program file with no comparison of any kind is refused. Do not soften that into a warning.
6. The brief never prints a cost per outcome without a range, never compares two programs, never projects past the years the evidence covers, and never uses a benchmark without naming it.
7. Every benchmark entry carries its source, year, place, how it was measured, and what it does not cover. `test/benchmarks.test.mjs` refuses an entry that is missing one. Any program file can override any benchmark value.
8. `test/report.test.mjs` pins the sentences that must never disappear. When one of those tests fails, fix the brief, not the test.

## Adding a benchmark or an example

A benchmark needs a public source a reader can open. Add it to `workforce.json`. The `benchmarks` command prints the page, so send its output to `benchmarks/workforce.md`. An example needs a public study behind every measured number, with the source written in the block that uses it.

## Style

Comments describe what the code does now, not how it got there. Brief wording is plain enough for a board member. Error messages name the line and say what the file needs.
