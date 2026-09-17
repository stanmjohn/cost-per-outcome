// The arithmetic. Cost per outcome is cost per participant divided by the
// outcome the program added per participant.
//
//   cost   = sum of [cost] blocks, minus sum of [cost avoided] blocks
//   added  = [with program] x [count check] x [still holding] - [without program]
//            or, from a study with a comparison group,
//            [added by program] x [count check] x [still holding]
//   answer = cost / added x outcome size
//
// When added is zero or less, the program bought nothing in that run and the
// answer is Infinity. Those runs are kept, never dropped.

import { rng, triangular, percentile } from "./simulate.mjs";

export const DEFAULT_DRAWS = 20000;
export const DEFAULT_SEED = 20260917;
// At or past this share of no-answer runs the tool prints no estimate at all.
export const REFUSE_AT = 0.5;

function pick(blocks, kind) {
  return blocks.find((b) => b.kind === kind) ?? null;
}

/** The blocks that vary from run to run. */
export function inputs(program) {
  const direct = pick(program.blocks, "added by program");
  return program.blocks.filter((b) => !(direct && b.kind === "with program"));
}

/** One answer from one set of values, keyed by block. */
export function answer(program, valueOf) {
  const { blocks, header } = program;
  let cost = 0;
  for (const b of blocks) {
    if (b.kind === "cost") cost += valueOf(b);
    if (b.kind === "cost avoided") cost -= valueOf(b);
  }
  const hold = pick(blocks, "still holding");
  const check = pick(blocks, "count check");
  const scale = (hold ? valueOf(hold) : 1) * (check ? valueOf(check) : 1);
  const direct = pick(blocks, "added by program");
  const added = direct
    ? valueOf(direct) * scale
    : valueOf(pick(blocks, "with program")) * scale - valueOf(pick(blocks, "without program"));
  if (added <= 0) return Infinity;
  return (Math.max(cost, 0) / added) * header.outcomeSize;
}

/** Cost per participant at the likely values, split by what the budget shows. */
export function costLines(program) {
  let inBudget = 0;
  let outside = 0;
  let avoided = 0;
  for (const b of program.blocks) {
    if (b.kind === "cost" && b.countedInBudget) inBudget += b.likely;
    if (b.kind === "cost" && !b.countedInBudget) outside += b.likely;
    if (b.kind === "cost avoided") avoided += b.likely;
  }
  return { inBudget, outside, avoided, net: inBudget + outside - avoided };
}

/**
 * The bare number: budget cost over the gross result, with no comparison
 * group, no count check, and nothing outside the budget. It is printed only
 * to be set beside the real answer.
 */
export function bareNumber(program) {
  const withBlock = pick(program.blocks, "with program");
  if (!withBlock || !(withBlock.likely > 0)) return null;
  return (costLines(program).inBudget / withBlock.likely) * program.header.outcomeSize;
}

/** Move one input from its low to its high with the rest at likely. */
export function ranking(program) {
  const vary = inputs(program).filter((b) => b.high > b.low);
  const rows = vary.map((b) => {
    const atLow = answer(program, (x) => (x === b ? b.low : x.likely));
    const atHigh = answer(program, (x) => (x === b ? b.high : x.likely));
    const span = atLow === Infinity || atHigh === Infinity ? Infinity : Math.abs(atHigh - atLow);
    return { block: b, atLow, atHigh, span };
  });
  return rows.sort((a, b) => (a.span === b.span ? 0 : b.span - a.span));
}

export function run(program, { draws = DEFAULT_DRAWS, seed = DEFAULT_SEED } = {}) {
  const next = rng(seed);
  const vary = inputs(program);
  const results = new Array(draws);
  let noAnswer = 0;
  for (let i = 0; i < draws; i++) {
    const values = new Map();
    for (const b of vary) values.set(b, triangular(next, b.low, b.likely, b.high));
    const a = answer(program, (b) => values.get(b));
    if (a === Infinity) noAnswer++;
    results[i] = a;
  }
  const noAnswerShare = noAnswer / draws;
  const p10 = percentile(results, 0.1);
  const p50 = percentile(results, 0.5);
  const p90 = percentile(results, 0.9);
  const state =
    noAnswerShare >= REFUSE_AT || p50 === Infinity ? "refused" : p90 === Infinity ? "open-ended" : "ranged";
  return {
    draws,
    seed,
    state,
    noAnswerShare,
    p10,
    p50,
    p90,
    atLikely: answer(program, (b) => b.likely),
    bare: bareNumber(program),
    costs: costLines(program),
    ranking: ranking(program),
  };
}
